import { InboxContent } from "@/components/inbox/inbox-content";

export default function ConversationDetailPage({ params }: { params: { id: string }}) {
    return <InboxContent selectedConversationId={params.id} />;
}
