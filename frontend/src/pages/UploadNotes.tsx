import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import NotesDisplay from '../components/NotesDisplay';
import { Topic } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { parseRawTopics, cleanMarkdown } from '../utils/noteParser';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const UploadNotes: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { user } = useAuth();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setTopics([]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setTopics([]); // Clear previous notes
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const jwt = user?.id; // We'll use user ID for now since we're not using JWT auth
      const response = await fetch('http://localhost:8000/generate-notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to generate notes');
      
      const data = await response.json();
      
      console.log('Raw notes data:', data); // Debug log
      
      // Clean markdown from the notes
      const cleanedNotes = cleanMarkdown(data.notes);
      
      // Parse the notes content
      const parsedTopics = parseRawTopics(cleanedNotes);
      console.log('Parsed topics:', parsedTopics); // Debug log
      
      // Always create a fallback structure with download info
      const fallbackTopic: Topic = {
        id: 'ai-notes-topic',
        title: 'AI Generated Notes',
        notes: [{
          id: 'ai-notes-content',
          title: 'Generated Content',
          content: data.notes || 'Notes generated successfully.',
          downloadUrl: `http://localhost:8000/download-notes/${encodeURIComponent(data.docx_path)}`,
          filename: data.filename
        }]
      };
      
      // If parsing worked, use parsed topics but add download info
      if (parsedTopics.length > 0) {
        if (parsedTopics[0].notes.length > 0) {
          parsedTopics[0].notes[0].downloadUrl = `http://localhost:8000/download-notes/${encodeURIComponent(data.docx_path)}`;
          parsedTopics[0].notes[0].filename = data.filename;
        }
        setTopics(parsedTopics);
      } else {
        setTopics([fallbackTopic]);
      }
      
      setFileName(uploadedFile.name);
    } catch (error: any) {
      console.error('Error processing file:', error);
      setTopics([{ 
        id: 'error', 
        title: 'Error', 
        notes: [{ 
          id: 'error-msg', 
          title: 'Processing Failed', 
          content: 'Failed to generate notes. Please try again.' 
        }] 
      }]);
    }
    
    setIsProcessing(false);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setTopics([]);
    setIsProcessing(false);
  };

  const saveNotesToSupabase = async () => {
    if (!user) {
      toast.error('Please log in to save notes');
      return;
    }

    if (topics.length === 0) {
      toast.error('No notes to save');
      return;
    }

    try {
      // Save the main notes content
      const mainContent = topics.map(topic => 
        topic.notes.map(note => note.content).join('\n\n')
      ).join('\n\n');

      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: fileName || 'Uploaded Document',
          content: mainContent,
          filename: fileName,
          note_type: 'upload',
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        toast.error('Failed to save notes');
      } else {
        toast.success('Notes saved successfully!');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      toast.error('Failed to save notes');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            AI Note Generation
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Upload your study materials and let AI generate comprehensive notes, summaries, and key insights.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Upload Study Material
          </h2>

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 transform scale-105'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {dragActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center"
                >
                  <div className="w-20 h-20 border-3 border-blue-500 border-dashed rounded-full animate-pulse" />
                </motion.div>
              )}
              <motion.div
                animate={{ y: dragActive ? -5 : 0 }}
                className="text-gray-500"
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <h3 className="text-base font-semibold mb-2">
                  Drop your files here or click to browse
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Supports PDF, DOCX, and TXT files up to 10MB
                </p>
                
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group text-sm"
                    type="button"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative z-10">
                    Choose File
                    </span>
                  </motion.button>
                </label>
              </motion.div>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer text-sm"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{uploadedFile.name}</h3>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for processing
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>

              {!isProcessing && topics.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processFile}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Notes
                  </span>
                </motion.button>
              )}

              {isProcessing && (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    AI is analyzing your document...
                  </h3>
                  <p className="text-sm text-gray-600">
                    This may take a few moments depending on file size
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* File Format Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, TXT. Max file size: 10MB.
            </p>
          </motion.div>
        </motion.div>

        {/* Notes Display */}
        {topics.length > 0 && (
          <NotesDisplay 
            topics={topics} 
            fileName={fileName || undefined} 
            onSave={saveNotesToSupabase}
            saving={false}
          />
        )}
      </div>
    </div>
  );
};

export default UploadNotes;