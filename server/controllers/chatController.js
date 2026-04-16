import { getCollections } from "../db.js";
import { createId } from "../services/bookingService.js";
import { loadState } from "../services/stateService.js";

function createConversationId(role, userId, providerId) {
  return `${role}-${userId}-${providerId}`;
}

function getParticipant(state, role, userId) {
  return role === "admin" ? state.maps.admins.get(userId) : state.maps.customers.get(userId);
}

function createAutoReply(provider, latestMessage) {
  const text = latestMessage.toLowerCase();

  if (text.includes("slot") || text.includes("time") || text.includes("available")) {
    return `I can help with timing. Please share your preferred date or slot and I will guide you on the best option.`;
  }

  if (text.includes("price") || text.includes("cost") || text.includes("fee")) {
    return `I can clarify pricing and what is included before your visit. Let me know the service you are planning for.`;
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return `Hi, I am ${provider.name}. Tell me what you need and I will help you prepare for the appointment.`;
  }

  return `Thanks for your message. I have noted it and will help you with the next steps for your appointment.`;
}

function mapConversation(messageGroup, provider) {
  const messages = messageGroup.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const lastMessage = messages[messages.length - 1];

  return {
    id: messageGroup[0].conversationId,
    provider,
    lastMessage,
    messages
  };
}

export async function getConversations(req, res) {
  try {
    const { role, userId } = req.query;
    if (!role || !userId) {
      return res.status(400).json({ message: "role and userId are required." });
    }

    const state = await loadState();
    const participant = getParticipant(state, role, userId);
    if (!participant) {
      return res.status(404).json({ message: "Chat participant not found." });
    }

    const accessibleProviders = [...state.providers].sort((a, b) => {
      const aPreferred = participant.preferredProviders?.includes(a.id) ? 1 : 0;
      const bPreferred = participant.preferredProviders?.includes(b.id) ? 1 : 0;
      return bPreferred - aPreferred || a.name.localeCompare(b.name);
    });

    const messages = state.chatMessages.filter((item) => item.participantRole === role && item.participantId === userId);
    const grouped = new Map();

    messages.forEach((message) => {
      const list = grouped.get(message.conversationId) || [];
      list.push(message);
      grouped.set(message.conversationId, list);
    });

    const conversations = accessibleProviders.map((provider) => {
      const conversationId = createConversationId(role, userId, provider.id);
      const providerMessages = grouped.get(conversationId) || [];

      return {
        id: conversationId,
        provider,
        lastMessage: providerMessages[providerMessages.length - 1] || null,
        messages: providerMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      };
    });

    return res.json(conversations.sort((a, b) => (b.lastMessage?.createdAt || "").localeCompare(a.lastMessage?.createdAt || "")));
  } catch {
    return res.status(500).json({ message: "Unable to load specialist chats." });
  }
}

export async function sendMessage(req, res) {
  try {
    const { role, userId, providerId, text } = req.body;
    if (!role || !userId || !providerId || !text?.trim()) {
      return res.status(400).json({ message: "role, userId, providerId and text are required." });
    }

    const state = await loadState();
    const participant = getParticipant(state, role, userId);
    const provider = state.maps.providers.get(providerId);

    if (!participant || !provider) {
      return res.status(404).json({ message: "Customer, admin or specialist not found." });
    }

    const conversationId = createConversationId(role, userId, providerId);
    const collections = await getCollections();
    const createdAt = new Date().toISOString();

    const outgoingMessage = {
      id: createId("chat"),
      conversationId,
      participantRole: role,
      participantId: userId,
      providerId,
      senderType: role,
      senderId: userId,
      senderName: participant.name,
      text: String(text).trim(),
      createdAt
    };

    const replyMessage = {
      id: createId("chat"),
      conversationId,
      participantRole: role,
      participantId: userId,
      providerId,
      senderType: "specialist",
      senderId: provider.id,
      senderName: provider.name,
      text: createAutoReply(provider, outgoingMessage.text),
      createdAt: new Date(Date.now() + 1500).toISOString()
    };

    await collections.chatMessages.insertMany([outgoingMessage, replyMessage]);

    return res.status(201).json({
      message: "Message sent to specialist.",
      conversation: mapConversation([outgoingMessage, replyMessage], provider)
    });
  } catch {
    return res.status(500).json({ message: "Unable to send message to specialist." });
  }
}
