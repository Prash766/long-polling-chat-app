import React, { useState } from 'react';
import { MessageSquarePlus, LogIn } from 'lucide-react';
import {toast} from 'sonner'
import { createRoom, joinRoom } from '../services/api';

interface JoinFormProps {
  onJoin: (roomId: string, username: string) => void;
}

export default function JoinForm({ onJoin }: JoinFormProps) {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isCreating) {
        const response = await createRoom(username || `Anonymous${Math.ceil(Math.random()*10)}`);
        onJoin(response.roomId, username || `Anonymous${Math.ceil(Math.random()*10)}`);
      } else {
        await joinRoom(roomId, username || `Anonymous${Math.ceil(Math.random()*10)}`);
        onJoin(roomId, username || `Anonymous${Math.ceil(Math.random()*10)}`);
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to join room. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to ChatRooms
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name or stay anonymous"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {!isCreating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID to join"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={!isCreating}
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <MessageSquarePlus size={20} />
                  Create Room
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Join Room
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsCreating(!isCreating)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isCreating ? 'Join existing room instead' : 'Create new room instead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}