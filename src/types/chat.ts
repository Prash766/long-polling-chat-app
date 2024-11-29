export interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: string;
}

export interface Room {
  id: string;
  messages: Message[];
}