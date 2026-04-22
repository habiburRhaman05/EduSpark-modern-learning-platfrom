import { useState } from "react";
import { Send, Paperclip, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { chatConversations } from "@/lib/mock-data";

export default function StudentChat() {
  const [activeConv, setActiveConv] = useState(chatConversations[0]?.id || "");
  const [message, setMessage] = useState("");
  const [searchConv, setSearchConv] = useState("");

  const filteredConvs = chatConversations.filter((c) => c.participantName.toLowerCase().includes(searchConv.toLowerCase()));
  const activeConversation = chatConversations.find((c) => c.id === activeConv);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <>
      <PageHeader title="Chat" description="Message your tutors" />

      <div className="bento-card p-0 overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchConv} onChange={(e) => setSearchConv(e.target.value)} placeholder="Search conversations..." className="pl-10 h-9 bg-muted/50 border-none rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((conv) => (
                <button key={conv.id} onClick={() => setActiveConv(conv.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors ${activeConv === conv.id ? "bg-muted/50" : ""}`}>
                  <div className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 ${conv.online ? "status-online" : ""}`}>{conv.participantAvatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground truncate">{conv.participantName}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">{conv.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                <div className="h-14 flex items-center gap-3 px-4 border-b border-border">
                  <div className={`w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary ${activeConversation.online ? "status-online" : ""}`}>{activeConversation.participantAvatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{activeConversation.participantName}</p>
                    <p className="text-[10px] text-muted-foreground">{activeConversation.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted/50 text-foreground rounded-bl-md"}`}>
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-muted-foreground h-9 w-9 p-0"><Paperclip className="w-4 h-4" /></Button>
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 h-9 bg-muted/50 border-none rounded-lg text-sm" />
                    <Button size="sm" onClick={handleSend} disabled={!message.trim()} className="bg-primary hover:bg-primary/90 h-9 w-9 p-0 rounded-lg"><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a conversation</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
