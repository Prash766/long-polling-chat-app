import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const rooms = new Map();
const ROOM_EXPIRY = 1000 * 60 * 60; // 1 hour

function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    clearTimeout(room.expiryTimeout);
    rooms.delete(roomId);
  }
}

app.post('/api/rooms', (req, res) => {
  const { username } = req.body;
  const roomId = uuidv4();
  
  rooms.set(roomId, {
    id: roomId,
    messages: [],
    users: new Set([username]),
    lastActivity: Date.now(),
    expiryTimeout: setTimeout(() => cleanupRoom(roomId), ROOM_EXPIRY)
  });
  
  res.json({ roomId });
});

app.post('/api/rooms/join', (req, res) => {
  const { roomId, username } = req.body;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  room.users.add(username);
  room.lastActivity = Date.now();
  
  res.json({ success: true });
});

app.post('/api/rooms/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const { message, username } = req.body;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const newMessage = {
    id: uuidv4(),
    text: message,
    username,
    timestamp: new Date().toISOString()
  };
  
  room.messages.push(newMessage);
  room.lastActivity = Date.now();
  
  res.json(newMessage);
});

app.get('/api/rooms/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const { lastMessageId } = req.query;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  let messages;
  if (lastMessageId) {
    const lastIndex = room.messages.findIndex(m => m.id === lastMessageId);
    messages = room.messages.slice(lastIndex + 1);
  } else {
    messages = room.messages;
  }
  
  room.lastActivity = Date.now();
  res.json(messages);
});

app.post('/api/rooms/:roomId/leave', (req, res) => {
  const { roomId } = req.params;
  const { username } = req.body;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  room.users.delete(username);
  
  if (room.users.size === 0) {
    cleanupRoom(roomId);
  }
  
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});