import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import StudyPlanForm from '../components/StudyPlanForm';
import PlanDisplay from '../components/PlanDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose, DialogDescription
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, BookOpen, Target, LayoutDashboard, Calendar } from 'lucide-react';
import { StudyPlan } from '../types';
import { motion } from 'framer-motion';

interface Todo {
  id: number;
  task: string;
  is_complete: boolean;
}

const StudyPlanner = () => {
  const { user, session } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [allPlans, setAllPlans] = useState<StudyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const completionRatio = useMemo(() => {
    if (todos.length === 0) return 0;
    const completed = todos.filter(t => t.is_complete).length;
    return (completed / todos.length) * 100;
  }, [todos]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch Todos
        const { data: todosData, error: todosError } = await supabase
          .from('todos').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        if (todosError) throw todosError;
        setTodos(todosData || []);
        
        // Fetch All Study Plans
        const { data: planData, error: planError } = await supabase
          .from('study_plans').select('id, plan_data, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
        if (planError) throw planError;
        
        if (planData && planData.length > 0) {
          const formattedPlans = planData.map(p => ({ ...p.plan_data, id: p.id, title: p.title, created_at: p.created_at }));
          setAllPlans(formattedPlans);
          setCurrentPlan(formattedPlans[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;
    try {
      const { data, error } = await supabase.from('todos').insert([{ task: newTask, user_id: user.id }]).select();
      if (error) throw error;
      if (data) setTodos([...todos, ...data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const savePlan = async (planToSave: StudyPlan) => {
    if (!user) return null;
    try {
      const { id, created_at, ...plan_data } = planToSave;
      if (id) {
        // UPDATE existing plan
        const { data, error } = await supabase.from('study_plans').update({ plan_data, title: planToSave.title }).eq('id', id).select('id, plan_data, title, created_at').single();
        if (error) throw error;
        return { ...data.plan_data, id: data.id, title: data.title, created_at: data.created_at };
      } else {
        // INSERT new plan
        const { data, error } = await supabase.from('study_plans').insert({ user_id: user.id, plan_data, title: planToSave.title }).select('id, plan_data, title, created_at').single();
        if (error) throw error;
        return { ...data.plan_data, id: data.id, title: data.title, created_at: data.created_at };
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      return null;
    }
  };

  const handlePlanSubmit = async (formData: any) => {
    setIsLoadingPlan(true);
    try {
      const payload = { goal: formData.goal, speed: formData.learningSpeed, hours_per_day: formData.timeframe, duration_days: formData.timeframe };
      const response = await fetch('http://localhost:8000/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate plan');
      const data = await response.json();
      
      const savedPlan = await savePlan(data.plan);

      if (savedPlan) {
        setAllPlans([savedPlan, ...allPlans]);
        setCurrentPlan(savedPlan);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };
  
  const handleDayToggle = async (dayNumber: number) => {
    if (!currentPlan) return;
    const updatedDays = currentPlan.days.map(d =>
      d.day === dayNumber ? { ...d, completed: !d.completed } : d
    );
    const updatedPlan = { ...currentPlan, days: updatedDays };
    
    const savedPlan = await savePlan(updatedPlan);
    if (savedPlan) {
      setCurrentPlan(savedPlan);
      setAllPlans(allPlans.map(p => p.id === savedPlan.id ? savedPlan : p));
    }
  };

  const handleDeletePlan = async () => {
    if (!user || !currentPlan?.id) return;
    try {
      await supabase.from('study_plans').delete().eq('id', currentPlan.id);
      const remainingPlans = allPlans.filter(p => p.id !== currentPlan.id);
      setAllPlans(remainingPlans);
      setCurrentPlan(remainingPlans.length > 0 ? remainingPlans[0] : null);
      setIsDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await supabase.from('todos').delete().eq('id', taskId);
      setTodos(todos.filter(todo => todo.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id: number, new_is_complete: boolean) => {
    try {
      const { data, error } = await supabase.from('todos').update({ is_complete: new_is_complete }).eq('id', id).select();
      if (error) throw error;
      if (data) setTodos(todos.map(todo => (todo.id === id ? data[0] : todo)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Study Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.email}!</p>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {allPlans.length > 0 && currentPlan && (
              <Select 
                value={currentPlan.id?.toString()} 
                onValueChange={(planId) => setCurrentPlan(allPlans.find(p => p.id === parseInt(planId)) || null)}
              >
                <SelectTrigger className="w-full sm:w-[320px]">
                  <SelectValue placeholder="Select a plan...">
                    {/* This ensures only the title is shown when the dropdown is closed */}
                    {currentPlan?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id!.toString()}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{plan.title}</span>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(plan.created_at!).toLocaleDateString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                  <BookOpen className="mr-2 h-4 w-4" /> New Study Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogTitle className="text-lg font-semibold mb-4">Create New Study Plan</DialogTitle>
                <StudyPlanForm 
                  onSubmit={handlePlanSubmit} 
                  onClose={() => setIsPlanFormOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {currentPlan && (
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                              This will permanently delete the "{currentPlan.title}" plan. This action cannot be undone.
                          </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                          <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDeletePlan}>Delete</Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg"><LayoutDashboard className="mr-2 text-blue-500"/>Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                      <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600">Daily Tasks</span>
                          <span className="text-sm font-bold text-gray-800">{todos.filter(t => t.is_complete).length}/{todos.length}</span>
                      </div>
                      <Progress value={completionRatio} className="h-2" />
                  </div>
                  {currentPlan && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">Plan Completion</span>
                            <span className="text-sm font-bold text-gray-800">
                              {currentPlan.days ? `${Math.round((currentPlan.days.filter(d => d.completed).length / currentPlan.days.length) * 100)}%` : 'N/A'}
                            </span>
                        </div>
                        <Progress value={currentPlan.days ? Math.round((currentPlan.days.filter(d => d.completed).length / currentPlan.days.length) * 100) : 0} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Daily To-Do List</CardTitle>
                  <CardDescription>Stay on track with your daily tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                    <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a new task..." className="flex-grow"/>
                    <Button type="submit" size="icon" className="flex-shrink-0"><Plus/></Button>
                  </form>
                  {loading ? <p>Loading tasks...</p> : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {todos.map(todo => (
                        <motion.li
                          key={todo.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/60"
                        >
                          <Checkbox
                            id={`todo-${todo.id}`}
                            checked={todo.is_complete}
                            onCheckedChange={(checked) => handleToggleComplete(todo.id, Boolean(checked))}
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`flex-grow cursor-pointer text-sm ${
                              todo.is_complete ? "line-through text-gray-400" : "text-gray-700"
                            }`}
                          >
                            {todo.task}
                          </label>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-full"
                            onClick={() => handleDeleteTask(todo.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </motion.li>
                      ))}
                      {todos.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No tasks yet. Add one!</p>}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-full"><p>Loading your plans...</p></div>
            ) : currentPlan ? (
              <PlanDisplay plan={currentPlan} onDayToggle={handleDayToggle} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-blue-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Study Plan Selected</h2>
                <p className="text-gray-500 mt-2 mb-6">Create a new plan to begin your journey.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;