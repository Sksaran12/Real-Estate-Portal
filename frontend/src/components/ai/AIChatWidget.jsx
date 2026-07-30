import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Namaste! I am EstateAI, your personal real estate assistant for Guwahati & India. Ask me anything like "Find 2BHK flat in Guwahati under ₹30,000" or "Luxury villas on GS Road".',
      properties: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', { message: userQuery });
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply,
            properties: data.properties || [],
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I ran into an issue finding properties. Please try asking in a different way!',
          properties: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatRupees = (price, type) => {
    let formatted = '';
    if (price >= 10000000) formatted = `₹${(price / 10000000).toFixed(2)} Cr`;
    else if (price >= 100000) formatted = `₹${(price / 100000).toFixed(2)} Lakhs`;
    else formatted = `₹${price.toLocaleString('en-IN')}`;
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  const samplePrompts = [
    '2BHK under ₹30k in Guwahati',
    'Flats for sale in GS Road',
    'Rental in Ganeshguri',
    'Commercial space in Beltola',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 border border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"></span>
          </div>
          <span className="text-sm">Ask EstateAI</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-brand-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm">EstateAI Assistant</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Guwahati & India
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Natural language property search</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm font-normal'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Recommended Properties inside chat bubble */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">Recommended Listings:</p>
                      {msg.properties.map((prop) => (
                        <Link
                          key={prop._id}
                          to={`/properties/${prop._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 p-2 bg-slate-50 hover:bg-brand-50 rounded-xl border border-slate-200 transition-colors group"
                        >
                          <img
                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'}
                            alt={prop.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600">
                              {prop.title}
                            </p>
                            <p className="text-[11px] font-extrabold text-emerald-600">
                              {formatRupees(prop.price, prop.propertyType)}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {prop.bedrooms} BHK • {prop.location?.city}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium p-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                <span>Searching properties in Guwahati...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(prompt);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 font-medium transition-colors border border-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask EstateAI (e.g. 2BHK flat in Beltola)..."
              className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-full bg-brand-600 text-white disabled:opacity-50 hover:bg-brand-700 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
