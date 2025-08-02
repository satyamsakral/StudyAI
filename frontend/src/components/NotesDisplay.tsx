import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, ChevronDown, Sparkles, Download, Save, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note, Topic } from '../types';

interface NotesDisplayProps {
  topics: Topic[];
  fileName?: string;
  onSave?: () => void;
  saving?: boolean;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({ topics, fileName, onSave, saving }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openTopics, setOpenTopics] = useState<string[]>([]);
  const [openNotes, setOpenNotes] = useState<string[]>([]);
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});

  const handleToggleTopic = (id: string) => {
    setOpenTopics(prev =>
      prev.includes(id) ? prev.filter(topicId => topicId !== id) : [...prev, id]
    );
  };

  const handleToggleNote = (id:string) => {
    setOpenNotes(prev =>
        prev.includes(id) ? prev.filter(noteId => noteId !== id) : [...prev, id]
      );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-gray-600">No notes available. Please upload a file and generate notes.</p>
      </div>
    );
  }
  
  const filteredTopics = topics.map(topic => ({
    ...topic,
    notes: topic.notes.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(topic => topic.notes.length > 0 || topic.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleGetInsights = async (note: Note) => {
    if (loadingInsights[note.id] || insights[note.id]) return;

    setLoadingInsights(prev => ({ ...prev, [note.id]: true }));

    try {
      const response = await fetch('http://localhost:8000/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note_content: note.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get insights');
      }

      const data = await response.json();
      setInsights(prev => ({ ...prev, [note.id]: data.insights }));
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsights(prev => ({ ...prev, [note.id]: 'Failed to load insights.' }));
    } finally {
      setLoadingInsights(prev => ({ ...prev, [note.id]: false }));
    }
  };

  const handleDownload = async (note: Note) => {
    if (!note.downloadUrl || !note.filename) return;
    
    try {
      const response = await fetch(note.downloadUrl);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto mt-12"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">AI-Generated Notes</h2>
              {fileName && (
                <p className="text-sm text-gray-600">From: {fileName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Save button */}
            {onSave && (
              <button
                onClick={onSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </>
                )}
              </button>
            )}
            
            {/* Download button for the entire file */}
            {topics.length > 0 && topics[0].notes.length > 0 && topics[0].notes[0].downloadUrl && topics[0].notes[0].filename && (
              <button
                onClick={() => handleDownload(topics[0].notes[0])}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download DOCX
              </button>
            )}
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <input
                type="text"
                placeholder="Search topics or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          className="w-full space-y-2"
        >
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <motion.div
                key={topic.id}
                variants={itemVariants}
                className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md bg-gray-50"
              >
                <button
                  onClick={() => handleToggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex-1 text-lg">{topic.title}</span>
                  <motion.div
                    animate={{ rotate: openTopics.includes(topic.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openTopics.includes(topic.id) && (
                    <motion.section
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden pl-4"
                    >
                      {topic.notes.map(note => (
                        <div key={note.id} className="border-t">
                             <button
                                onClick={() => handleToggleNote(note.id)}
                                className="w-full flex items-center justify-between p-3 sm:p-4 text-left font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                <span className="flex-1">{note.title}</span>
                                <motion.div
                                    animate={{ rotate: openNotes.includes(note.id) ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="ml-4"
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {openNotes.includes(note.id) && (
                                    <motion.section
                                        key="note-content"
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { opacity: 1, height: 'auto' },
                                            collapsed: { opacity: 0, height: 0 },
                                        }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="overflow-hidden"
                                        >
                                        <div className="px-4 sm:px-6 pb-4 pt-2 text-sm text-gray-800 leading-relaxed border-t prose">
                                            <ReactMarkdown>{note.content}</ReactMarkdown>
                                        </div>
                                        <div className="px-4 sm:px-6 pb-4 border-t bg-gray-50">
                                            <button
                                            onClick={() => handleGetInsights(note)}
                                            disabled={loadingInsights[note.id]}
                                            className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg shadow-md hover:from-violet-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            {loadingInsights[note.id] ? 'Getting Insights...' : 'Get AI Insights'}
                                            </button>
                                            {insights[note.id] && (
                                            <div className="mt-4 p-4 bg-white rounded-lg border prose prose-sm">
                                                <ReactMarkdown>{insights[note.id]}</ReactMarkdown>
                                            </div>
                                            )}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </div>
                      ))}
                    </motion.section>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <p>No notes found for "{searchTerm}".</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotesDisplay;