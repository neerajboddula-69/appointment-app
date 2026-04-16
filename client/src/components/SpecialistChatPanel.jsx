import { useEffect, useMemo, useState } from "react";

function formatChatTime(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function SpecialistChatPanel({ session, conversations, onSend, sending, fullPage = false }) {
  const [activeConversationId, setActiveConversationId] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!conversations.length) {
      setActiveConversationId("");
      return;
    }

    setActiveConversationId((current) => (current && conversations.some((item) => item.id === current) ? current : conversations[0].id));
  }, [conversations]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0] || null,
    [activeConversationId, conversations]
  );

  async function handleSend(event) {
    event.preventDefault();

    if (!activeConversation || !draft.trim()) {
      return;
    }

    await onSend(activeConversation.provider.id, draft);
    setDraft("");
  }

  return (
    <section className={fullPage ? "card specialist-chat-card specialist-chat-card-full" : "card specialist-chat-card"}>
      <div className="section-head">
        <div>
          <p className="eyebrow">{session?.user.role === "admin" ? "Specialist coordination" : "Direct support"}</p>
          <h3>Chat with specialists</h3>
        </div>
      </div>

      {!conversations.length ? <p className="helper-text">Specialist chats will appear here once you have an assigned provider relationship.</p> : null}

      {conversations.length ? (
        <div className={fullPage ? "chat-shell chat-shell-full" : "chat-shell"}>
          <aside className="chat-sidebar">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={conversation.id === activeConversation?.id ? "chat-contact active" : "chat-contact"}
                onClick={() => setActiveConversationId(conversation.id)}
                type="button"
              >
                <div className="chat-contact-avatar">{conversation.provider.name.slice(0, 1)}</div>
                <div className="chat-contact-copy">
                  <strong>{conversation.provider.name}</strong>
                  <span>{conversation.provider.title}</span>
                  <small>{conversation.lastMessage?.text || "Start a conversation with this specialist."}</small>
                </div>
              </button>
            ))}
          </aside>

          <div className="chat-thread">
            <header className="chat-thread-head">
              <div className="chat-thread-avatar">{activeConversation?.provider.name.slice(0, 1)}</div>
              <div>
                <strong>{activeConversation?.provider.name}</strong>
                <p>
                  {activeConversation?.provider.title} | {activeConversation?.provider.location}
                </p>
              </div>
            </header>

            <div className="chat-message-list">
              {activeConversation?.messages.length ? (
                activeConversation.messages.map((message) => (
                  <article
                    key={message.id}
                    className={message.senderType === "specialist" ? "chat-bubble specialist" : "chat-bubble mine"}
                  >
                    <strong>{message.senderType === "specialist" ? activeConversation.provider.name : "You"}</strong>
                    <p>{message.text}</p>
                    <small>{formatChatTime(message.createdAt)}</small>
                  </article>
                ))
              ) : (
                <div className="chat-empty-state">
                  <strong>No messages yet</strong>
                  <p>Ask about availability, preparation, pricing or anything you would normally discuss before an appointment.</p>
                </div>
              )}
            </div>

            <form className="chat-composer" onSubmit={handleSend}>
              <input
                placeholder="Type your message to the specialist..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button className="primary-button" disabled={sending || !draft.trim()} type="submit">
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
