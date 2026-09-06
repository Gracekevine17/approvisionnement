import React, { useState } from 'react';
import { CalendarCheck, Clock, Plus, CheckCircle2, AlertTriangle, Bell, Trash2, Calendar } from 'lucide-react';
import { Reminder } from '../types';

interface RemindersViewProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [siteName, setSiteName] = useState('Horizon West Tower');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<Reminder['priority']>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      description: `Jobsite reminder for ${siteName}`,
      timeLabel: date || 'Upcoming',
      type: 'CRITICAL_STOCK',
      priority,
      completed: false,
    });

    setTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Operational Reminders
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Cycle counts and reorder checkpoints</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Replenishment Deadlines & Jobsite Reminders</h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Never miss a critical order: schedule your material audits, PPE distributions, and supplier delivery follow-ups.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Reminder</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900">Add Reminder / Follow-up</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Objective *</label>
              <input
                type="text"
                required
                placeholder="e.g. Follow up on cement reorder with Lafarge..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-400">
            No reminders scheduled. Click "+ Add Reminder" to track deadlines.
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                reminder.completed ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleReminder(reminder.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    reminder.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {reminder.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <p className={`text-xs font-bold ${reminder.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {reminder.title}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>{reminder.description}</span>
                    <span>•</span>
                    <span>{reminder.timeLabel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    reminder.priority === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : reminder.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {reminder.priority}
                </span>
                <button
                  onClick={() => onDeleteReminder(reminder.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
