import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../../services/chatService';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm CitizenSafe AI. I can help you with real-time disaster information and safety alerts. How can I assist you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                text: msg.text
            }));
            
            const data = await sendMessage(input, history);
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting. Please check your internet or try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Floating Toggle Button */}
            <motion.button
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className="chatbot-header">
                            <div className="header-info">
                                <div className="bot-avatar">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3>CitizenSafe AI</h3>
                                    <span className="status">Online</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="chatbot-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message-wrapper ${msg.role}`}>
                                    <div className="message-bubble">
                                        {msg.text.split('\n').map((line, i) => (
                                            <div key={i}>
                                                {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-wrapper assistant">
                                    <div className="message-bubble loading">
                                        <Loader2 size={18} className="spin" />
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chatbot-input" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Ask me about disasters..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={!input.trim() || isLoading}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
