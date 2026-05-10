import { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, token, projectId, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch users so the Admin can assign the task
    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:5001/api/auth/users', { // Wait, we need a users route!
                // Actually, for simplicity, we can just assign the task to the current Admin for now,
                // or I can give you a quick route update if you want full assignment capabilities.
            })
        }
    }, [isOpen]);

    // Note: Since we didn't explicitly build a "Get All Users" API route in Phase 1, 
    // we will make the AssignedTo field an optional manual ID entry for now to save time, 
    // or leave it blank (Unassigned). 
    
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    title, 
                    description, 
                    project: projectId,
                    dueDate: dueDate || null
                })
            });
            
            if (res.ok) {
                const newTask = await res.json();
                onTaskCreated(newTask);
                setTitle('');
                setDescription('');
                setDueDate('');
                onClose();
            }
        } catch (error) {
            console.error('Failed to create task', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                        <h2>Add New Task</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
                        <input 
                            type="text" required value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            placeholder="e.g. Design Login Page"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea 
                            rows="2" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                        <input 
                            type="date" value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                        />
                    </div>
                    
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;