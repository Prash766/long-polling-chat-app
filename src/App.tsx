import  { useState } from 'react';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<{ id: string; username: string } | null>(null);

  const handleJoin = (roomId: string, username: string) => {
    setCurrentRoom({ id: roomId, username });
  };

  const handleLeave = () => {
    setCurrentRoom(null);
  };

  return (
    <>
      {currentRoom ? (
        <ChatRoom
          roomId={currentRoom.id}
          username={currentRoom.username}
          onLeave={handleLeave}
        />
      ) : (
        <JoinForm onJoin={handleJoin} />
      )}
    </>
  );
}

export default App;