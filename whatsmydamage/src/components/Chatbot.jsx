// src/components/Chatbot.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';  // Import the CSS for chatbot styling

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the conversation
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);

    try {
      // Call the Firebase Cloud Function
      const response = await axios.post('http://localhost:5001/whatsmydamage-dd0fb/us-central1/getChatResponse', {
        message: input
      });

      // Add bot response to the conversation
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Error: Unable to fetch response' }]);
    }

    setInput('');  // Clear input
  };

  return (
    <div className="chatbot-box">
      {/* Introduction Message */}
      <div className="chatbot-header">
        <img src="chatbot.jfif" alt="Chatbot Logo" className="chatbot-logo" />
        <span>I'm a chatbot here to assist with your questions!</span>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
