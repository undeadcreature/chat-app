import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css"; // Optional for styling

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("Anonymous"); // Default username

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Connect to backend
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]); // Add new message to list
    });

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, []);

  // Send message to server
  const handleSend = () => {
    if (message.trim() && socket) {
      const msgData = {
        text: message,
        sender: username, // Hardcoded for now (upgrade to auth later)
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", msgData); // Send to server
      setMessage(""); // Clear input
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="App">
      <h1>Simple Chat App 🐢</h1>
      
      {/* Username input (optional) */}
      <div className="username-section">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Message display */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
            <small> ({msg.timestamp})</small>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;