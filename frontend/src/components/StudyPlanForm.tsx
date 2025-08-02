import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Target, Clock, Calendar, Zap, Sparkles } from 'lucide-react';
import { Button } from './ui/button'; // Assuming you have a Button component

interface StudyPlanFormProps {
  onSubmit: (formData: any) => Promise<void>; // Make it async
  onClose: () => void; // Add onClose prop
}

interface FormData {
  goal: string;
  learningSpeed: 'slow' | 'average' | 'fast';
  hoursPerDay: number;
  timeframe: number;
  timeframeUnit: 'days' | 'weeks' | 'months';
  file?: File;
}

const StudyPlanForm: React.FC<StudyPlanFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    goal: '',
    learningSpeed: 'average',
    hoursPerDay: 2,
    timeframe: 4,
    timeframeUnit: 'weeks',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let durationInDays = formData.timeframe;
    if (formData.timeframeUnit === 'weeks') {
      durationInDays *= 7;
    } else if (formData.timeframeUnit === 'months') {
      durationInDays *= 30; // Approximation
    }

    try {
      await onSubmit({ ...formData, timeframe: durationInDays });
      onClose(); // Close the dialog on success
    } catch (error) {
      console.error("Failed to submit plan:", error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Create Your Study Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's design a personalized learning journey tailored to your goals and schedule
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Study Goal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80"
          >
            <label className="flex items-center text-base font-semibold text-gray-700 mb-3">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Study Goal
            </label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              placeholder="e.g., Complete Data Structures & Algorithms, Crack CAT 2025"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
              required
            />
          </motion.div>

          {/* Learning Speed & Hours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80"
            >
              <label className="flex items-center text-base font-semibold text-gray-700 mb-3">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                Learning Speed
              </label>
              <select
                value={formData.learningSpeed}
                onChange={(e) => handleInputChange('learningSpeed', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-800"
              >
                <option value="slow">🐢 Slow & Steady</option>
                <option value="average">⚡ Average Pace</option>
                <option value="fast">🚀 Fast Track</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80"
            >
              <label className="flex items-center text-base font-semibold text-gray-700 mb-3">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                Hours per Day
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={formData.hoursPerDay}
                onChange={(e) => handleInputChange('hoursPerDay', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-800"
              />
            </motion.div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80"
            >
              <label className="flex items-center text-base font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                Duration
              </label>
              <input
                type="number"
                min="1"
                value={formData.timeframe}
                onChange={(e) => handleInputChange('timeframe', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-gray-800"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80"
            >
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Time Unit
              </label>
              <select
                value={formData.timeframeUnit}
                onChange={(e) => handleInputChange('timeframeUnit', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-gray-800"
              >
                <option value="days">📅 Days</option>
                <option value="weeks">📆 Weeks</option>
                <option value="months">🗓️ Months</option>
              </select>
            </motion.div>
          </div>

          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 hover:bg-white/80 relative overflow-hidden"
          >
            <label className="flex items-center text-base font-semibold text-gray-700 mb-3">
              <Upload className="w-5 h-5 mr-2 text-indigo-500" />
              Upload Study Material (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 backdrop-blur-sm'
                  : formData.file
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="text-green-600">
                  <Upload className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold">{formData.file.name}</p>
                  <p className="text-sm text-gray-500 mt-2">✅ File uploaded successfully</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Upload className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-2">Drop your files here or click to browse</p>
                  <p className="text-sm">PDF, DOCX, TXT supported</p>
                  <p className="text-xs text-gray-400 mt-1">Upload study materials (optional)</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="absolute inset-0 cursor-pointer"
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex justify-end pt-6"
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? 'Generating...' : 'Generate My Plan'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default StudyPlanForm;