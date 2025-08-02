import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Search, Filter, Calendar, FileText, Youtube, X, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SavedNote, YouTubeNote, UnifiedNote } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const NotesHistory: React.FC = () => {
  const [notes, setNotes] = useState<UnifiedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upload' | 'youtube'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [selectedNote, setSelectedNote] = useState<UnifiedNote | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingNote, setDeletingNote] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      // Fetch all notes from unified table
      const { data: allNotesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error('Error fetching notes:', notesError);
      }

      // Format notes based on their type
      const allNotes = (allNotesData || []).map(note => ({
        ...note,
        title: note.title || (note.note_type === 'youtube' ? 'YouTube Video' : 'Uploaded Document'),
        content: note.content || 'No content available'
      }));

      setNotes(allNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || note.note_type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const downloadNote = (note: UnifiedNote) => {
    const content = note.content || 'No content available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNoteIcon = (noteType: string) => {
    return noteType === 'youtube' ? <Youtube className="w-5 h-5 text-red-500" /> : <FileText className="w-5 h-5 text-blue-500" />;
  };

  const openNoteModal = (note: UnifiedNote) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const closeNoteModal = () => {
    setShowModal(false);
    setSelectedNote(null);
  };

  const deleteNote = async (note: UnifiedNote) => {
    if (!user) {
      toast.error('Please log in to delete notes');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${note.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingNote(note.id);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      } else {
        toast.success('Note deleted successfully!');
        // Refresh the notes list
        fetchNotes();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Failed to delete note');
    } finally {
      setDeletingNote(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-sky-blue to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-sky-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Notes History
              </h1>
              <p className="text-slate-600 mt-1">View and manage all your saved notes</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search through your notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'upload' | 'youtube')}
                className="px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <option value="all">All Notes</option>
                <option value="upload">Uploaded</option>
                <option value="youtube">YouTube</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-3">No notes found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by uploading a document or generating YouTube notes'
                }
              </p>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/20"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                        {getNoteIcon(note.note_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">
                          {note.note_type} note
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openNoteModal(note)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                        title="View full note"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadNote(note)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-all duration-300 hover:scale-110"
                        title="Download note"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteNote(note)}
                        disabled={deletingNote === note.id}
                        className="p-2 text-slate-400 hover:text-red-600 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                        title="Delete note"
                      >
                        {deletingNote === note.id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                                    {/* Content Preview */}
                  <div className="mb-4">
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {note.content ? note.content.substring(0, 150) + '...' : 'No content available'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      note.content 
                        ? (note.content.length > 1000 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700')
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {note.content ? (note.content.length > 1000 ? 'Long' : 'Short') : 'Empty'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-deep-sky-blue">{notes.length}</div>
              <div className="text-sm text-gray-600">Total Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {notes.filter(n => n.note_type === 'upload').length}
              </div>
              <div className="text-sm text-gray-600">Uploaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {notes.filter(n => n.note_type === 'youtube').length}
              </div>
              <div className="text-sm text-gray-600">YouTube</div>
            </div>
          </div>
        </motion.div>

        {/* Full View Modal */}
        {showModal && selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeNoteModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {getNoteIcon(selectedNote.note_type)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedNote.title}</h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedNote.note_type} note • {formatDate(selectedNote.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadNote(selectedNote)}
                    className="p-2 text-gray-400 hover:text-deep-sky-blue transition-colors"
                    title="Download note"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      deleteNote(selectedNote);
                      closeNoteModal();
                    }}
                    disabled={deletingNote === selectedNote.id}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete note"
                  >
                    {deletingNote === selectedNote.id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={closeNoteModal}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedNote.content || 'No content available'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotesHistory; 