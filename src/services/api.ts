const API_BASE_URL = 'http://localhost:3000/api';

export const createRoom = async (username: string) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return response.json();
};

export const joinRoom = async (roomId: string, username: string) => {
  const response = await fetch(`${API_BASE_URL}/rooms/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, username }),
  });
  return response.json();
};

export const sendMessage = async (roomId: string, message: string, username: string) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, username }),
  });
  return response.json();
};

export const pollMessages = async (roomId: string, lastMessageId?: string) => {
  const url = new URL(`${API_BASE_URL}/rooms/${roomId}/messages`);
  if (lastMessageId) {
    url.searchParams.append('lastMessageId', lastMessageId);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Room not found');
  }
  return response.json();
};

export const leaveRoom = async (roomId: string, username: string) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return response.json();
};