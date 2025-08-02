import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Youtube, 
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UnifiedNote } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { cleanMarkdown } from '../utils/noteParser';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  referencedNotes?: string[];
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<UnifiedNote[]>([]);
  const [availableNotes, setAvailableNotes] = useState<UnifiedNote[]>([]);
  const [showNoteSelector, setShowNoteSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserNotes();
      setShowRecommendation(true); // Show recommendation on first open
      setTimeout(() => setShowRecommendation(false), 3000); // Hide after 3 seconds
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserNotes = async () => {
    try {
      // Fetch all notes from unified table
      const { data: allNotesData } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Format notes based on their type
      const allNotes = (allNotesData || []).map(note => ({
        ...note,
        title: note.title || (note.note_type === 'youtube' ? 'YouTube Video' : 'Uploaded Document'),
        content: note.content || 'No content available'
      }));

      setAvailableNotes(allNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Prepare context from selected notes
      const context = selectedNotes.length > 0 
        ? selectedNotes.map(note => 
            `Note: ${note.title}\nContent: ${note.content}`
          ).join('\n\n')
        : '';

      const response = await fetch('http://localhost:8000/chat-with-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context,
          selected_notes: selectedNotes.map(n => n.id),
          user_id: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const cleanedResponse = cleanMarkdown(data.response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedResponse,
        timestamp: new Date(),
        referencedNotes: data.referenced_notes || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleNoteSelection = (note: UnifiedNote) => {
    setSelectedNotes(prev => 
      prev.find(n => n.id === note.id)
        ? prev.filter(n => n.id !== note.id)
        : [...prev, note]
    );
  };

  const getNoteIcon = (noteType: string) => {
    return noteType === 'youtube' ? 
      <Youtube className="w-4 h-4 text-red-500" /> : 
      <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 right-6 z-40 w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-visible"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white relative z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Study Assistant</h3>
                    <p className="text-sm text-slate-300">Your AI learning companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNoteSelector(!showNoteSelector)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Toggle note selector"
                >
                  <span className={`transition-transform duration-200 ${showNoteSelector ? 'rotate-180' : ''}`}> 
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
              </div>
              {/* Note Selector Dropdown - absolute below header */}
              <AnimatePresence>
                {showNoteSelector && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 border border-blue-100 bg-slate-50 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto"
                    style={{ minWidth: '100%' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="p-4">
                      {availableNotes.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500">No notes available</p>
                          <p className="text-xs text-slate-400 mt-1">Upload documents or generate YouTube notes first</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {availableNotes.map(note => (
                            <div
                              key={note.id}
                              onClick={() => toggleNoteSelection(note)}
                              className={`flex items-center space-x-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedNotes.find(n => n.id === note.id)
                                  ? 'bg-blue-100 border-2 border-blue-300 shadow-sm'
                                  : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${
                                  selectedNotes.find(n => n.id === note.id)
                                    ? 'bg-blue-200'
                                    : 'bg-slate-100'
                                }`}>
                                  {getNoteIcon(note.note_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-semibold text-slate-800 truncate block">
                                    {note.title}
                                  </span>
                                  <span className="text-xs text-slate-500 capitalize">
                                    {note.note_type} note
                                  </span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={!!selectedNotes.find(n => n.id === note.id)}
                                readOnly
                                className="form-checkbox h-5 w-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedNotes.length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-medium text-blue-700">
                            ✅ {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages (scrollable area) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
              {/* Recommendation Banner */}
              {showRecommendation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mb-3 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2 shadow-sm animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Chat with your AI Study Assistant!</span>
                </motion.div>
              )}
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 py-8 flex-1 flex flex-col justify-end">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Start a conversation!</p>
                  <p className="text-xs text-slate-500 mb-4">Ask me anything about your notes</p>
                  {selectedNotes.length === 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-1 flex items-center">
                        💡 Pro Tip
                      </p>
                      <p className="text-xs text-blue-600">
                        Select notes below for personalized responses based on your study materials!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      {message.referencedNotes && message.referencedNotes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-500 flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            Referenced {message.referencedNotes.length} note{message.referencedNotes.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your notes..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Removed duplicate note selector toggle and panel below input */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 