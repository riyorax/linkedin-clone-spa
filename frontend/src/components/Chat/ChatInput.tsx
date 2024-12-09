import { useState, useEffect } from 'react'
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onTyping: () => void;
  onStopTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping, onStopTyping  }) => {
  const [text, setText] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (text.trim()) {
      onTyping();
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const timeout = setTimeout(() => {
        onStopTyping();
      }, 3000);
      
      setTypingTimeout(timeout);
    } else {
      onStopTyping();
    }


    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [text, onTyping, onStopTyping, typingTimeout]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await onSendMessage(text);
      setText("");
      onStopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }


  return (
    <div className="p-2 sm:p-4 w-full">
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered text-[10px] rounded-lg input-xs sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput
