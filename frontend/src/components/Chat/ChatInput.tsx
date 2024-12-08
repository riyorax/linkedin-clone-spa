import { useState } from 'react'
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState<string>("");

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault(); // Prevent page reload
    if (!text.trim()) return; // Prevent empty messages
    try {
      await onSendMessage(text); // Call parent function
      setText(""); // Clear input
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
