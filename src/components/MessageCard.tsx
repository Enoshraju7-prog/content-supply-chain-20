import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  type: "user" | "agent";
  content: string;
  timestamp: string;
}

export function MessageCard({ type, content, timestamp }: MessageCardProps) {
  const isUser = type === "user";
  
  return (
    <div className={cn("flex gap-4 p-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[80%]", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        {/* Message Content */}
        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          <div className={cn(
            "rounded-2xl px-4 py-3 shadow-soft",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-card border border-border"
          )}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
          <span className="text-xs text-muted-foreground mt-2 px-1">
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}