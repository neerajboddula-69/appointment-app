import SpecialistChatPanel from "../components/SpecialistChatPanel";
import { useApp } from "../services/appContext";

export default function ChatPage() {
  const { session, conversations, sendChatMessage, loading } = useApp();

  return (
    <section className="chat-page-shell">
      <SpecialistChatPanel
        session={session}
        conversations={conversations}
        onSend={sendChatMessage}
        sending={loading}
        fullPage
      />
    </section>
  );
}
