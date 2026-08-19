import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerMessages() {
  const { messages, sendMessage, currentUser } = useAuth();
  const [activeConvId, setActiveConvId] = useState(messages[0]?.id || 'conv-1');
  const [inputText, setInputText] = useState('');

  const activeConv = messages.find(m => m.id === activeConvId) || messages[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="dashboard-content-flow messages-page-layout">
      <div className="page-header-row">
        <div>
          <h2>Freelancer Client Chat & Collaboration</h2>
          <p className="text-secondary">Coordinate directly with clients on requirements, revisions, and milestone sign-offs.</p>
        </div>
      </div>

      <div className="chat-container-card">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Client Threads</h3>
            <span className="chat-active-count">{messages.length} Active</span>
          </div>

          <div className="conversations-scroll-list">
            {messages.map((c) => (
              <div
                key={c.id}
                className={`conv-item ${c.id === activeConvId ? 'active freelancer-active' : ''}`}
                onClick={() => setActiveConvId(c.id)}
              >
                <div className="conv-avatar-wrap">
                  <img src={c.participant.avatar} alt={c.participant.name} />
                  {c.participant.online && <span className="online-indicator"></span>}
                </div>
                <div className="conv-meta">
                  <div className="conv-top">
                    <strong>Elena Rostova (Client)</strong>
                    <span className="conv-time">
                      {c.messages[c.messages.length - 1]?.time || 'Today'}
                    </span>
                  </div>
                  <span className="conv-project-tag">{c.project}</span>
                  <p className="conv-preview">
                    {c.messages[c.messages.length - 1]?.text || 'No messages yet.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Body */}
        <div className="chat-main-window">
          {activeConv ? (
            <>
              <div className="chat-window-header">
                <div className="chat-header-user">
                  <img src={activeConv.participant.avatar} alt="Client" />
                  <div>
                    <h4>Elena Rostova</h4>
                    <span className="user-role-sub">
                      Client Account • <span className="status-online">Active Now</span>
                    </span>
                  </div>
                </div>
                <div className="chat-header-project">
                  <i className="ri-folder-3-line"></i>
                  <span>{activeConv.project}</span>
                </div>
              </div>

              <div className="chat-messages-body">
                {activeConv.messages.map((m) => (
                  <div key={m.id} className={`message-bubble-row ${m.isMe ? 'sent' : 'received'}`}>
                    <div className={`message-bubble ${m.isMe ? 'freelancer-bubble' : ''}`}>
                      <div className="bubble-sender">{m.sender}</div>
                      <div className="bubble-text">{m.text}</div>
                      <div className="bubble-time">{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Send milestone updates or answer client questions..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="chat-send-btn success-send-btn" disabled={!inputText.trim()}>
                  <i className="ri-send-plane-fill"></i>
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat-select">
              <i className="ri-chat-voice-line"></i>
              <p>Select a client conversation to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
