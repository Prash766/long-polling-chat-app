import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { pollMessages, sendMessage, leaveRoom } from '../services/api';
import type { Message } from '../types/chat';
import {toast} from 'sonner';

interface ChatRoomProps {
  roomId: string;
  username: string;
  onLeave: () => void;
}

export default function ChatRoom({ roomId, username, onLeave }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [polling, setPolling] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const pollForMessages = async () => {
      try {
        const lastMessageId = messages[messages.length - 1]?.id;
        const newMessages = await pollMessages(roomId, lastMessageId);
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages]);
        }
      } catch (error) {
        toast.error('Room has expired');
        console.log(error)
        setPolling(false);
        onLeave();
      }
    };

    const interval = setInterval(pollForMessages, 1000);
    return () => clearInterval(interval);
  }, [roomId, messages, onLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await sendMessage(roomId, newMessage, username);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.log(error)
      toast.error('Failed to send message');
    }
  };

  const handleLeave = async () => {
    try {
      await leaveRoom(roomId, username);
      setPolling(false);
      onLeave();
    } catch (error) {
      console.log(error)
      toast.error('Failed to leave room');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Room: {roomId}</h2>
          <p className="text-sm text-gray-600">Joined as: {username}</p>
        </div>
        <button
          onClick={handleLeave}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <LogOut size={20} />
          Leave Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.username === username ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.username === username
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.username === username ? 'You' : message.username}
              </p>
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-75">
                {format(new Date(message.timestamp), 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send size={20} />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}