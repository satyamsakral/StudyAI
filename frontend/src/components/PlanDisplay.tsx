import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Calendar, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Day, StudyPlan } from '../types';

interface PlanDisplayProps {
  plan: StudyPlan;
  onDayToggle: (dayNumber: number) => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onDayToggle }) => {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [notes, setNotes] = React.useState<string>('');
  const [loadingNotes, setLoadingNotes] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!plan || !plan.days || plan.days.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-gray-500">No study plan available. Generate one to get started!</p>
      </div>
    );
  }

  const selected = plan.days.find((d) => d.day === selectedDay);

  const generateAINotes = async () => {
    if (!selected) {
      toast.error('Please select a day first');
      return;
    }

    setLoadingNotes(true);
    setError(null);
    setNotes('');
    try {
      const response = await fetch('http://localhost:8000/generate-notes-from-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: selected.topic,
          day: selected.day,
          tasks: selected.tasks || []
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate notes');
      }
      
      const data = await response.json();
      setNotes(data.notes || 'No notes available for this topic.');
      toast.success('AI notes generated successfully!');
    } catch (error) {
      console.error('Error generating notes:', error);
      setError('Failed to generate AI notes. Please try again.');
      toast.error('Failed to generate AI notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 md:px-0">
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 tracking-wide">
          {plan.title || 'Your Study Plan'}
        </h2>
        <div className="flex flex-wrap items-center gap-6 text-gray-700 text-sm">
          {plan.totalDays && (
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-500" />{plan.totalDays} days</div>
          )}
          {plan.dailyHours && (
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-green-500" />{plan.dailyHours}h / day</div>
          )}
          {plan.estimatedCompletion && (
            <div className="flex items-center"><Target className="w-4 h-4 mr-2 text-red-500" />Est. Completion: {plan.estimatedCompletion}</div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 mb-2 font-medium">Select a day:</label>
          <select
            value={selectedDay || ''}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2 shadow-sm"
          >
            <option value="">-- Choose a Day --</option>
            {plan.days.map((day) => (
              <option key={day.day} value={day.day}>
                Day {day.day}: {day.topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected && (
        <motion.div
          layout
          initial={{ borderRadius: 12 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {selected.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3">
                  {selected.day}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
                {selected.topic || 'Untitled Topic'}
              </h3>
            </div>
            <p className="text-sm text-gray-500 font-medium mr-4">{selected.time || 'Duration Unknown'}</p>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Daily Tasks:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pl-3">
              {selected.tasks && selected.tasks.length > 0 ? (
                selected.tasks.map((task: string, index: number) => <li key={index}>{task}</li>)
              ) : (
                <li>No tasks available.</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => onDayToggle(selected.day)}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            {selected.completed ? 'Completed ✓' : 'Mark as Complete'}
          </button>

          <div className="mt-6 space-y-4">
            {/* Generate AI Notes Button */}
            <button
              onClick={generateAINotes}
              disabled={loadingNotes || !selected}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loadingNotes ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating AI Notes...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate AI Notes for "{selected?.topic}"
                </>
              )}
            </button>

            {/* Display Generated Notes */}
            {notes && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">AI Generated Notes:</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {notes}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlanDisplay;
