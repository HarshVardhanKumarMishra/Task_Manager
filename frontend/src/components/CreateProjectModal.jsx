import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, token, onProjectCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });
            
            if (res.ok) {
                const newProject = await res.json();
                onProjectCreated(newProject); // Send new project back to Dashboard
                setTitle('');
                setDescription('');
                onClose();
            }
        } catch (error) {
            console.error('Failed to create project', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <FolderPlus className="w-5 h-5 text-indigo-400" />
                        <h2>Create New Project</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
                        <input 
                            type="text" required value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                            placeholder="e.g. Website Redesign"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea 
                            rows="3" value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                            placeholder="Briefly describe the project goals..."
                        />
                    </div>
                    
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;