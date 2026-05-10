import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Folder, Plus, LayoutDashboard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    // Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/projects', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setProjects(data);
                    if (data.length > 0) setSelectedProject(data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };
        fetchProjects();
    }, [user.token]);

    // Fetch Tasks
    useEffect(() => {
        if (!selectedProject) return;
        const fetchTasks = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/tasks/project/${selectedProject._id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (res.ok) setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            }
        };
        fetchTasks();
    }, [selectedProject, user.token]);

    // --- NEW: Update Task Status ---
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5001/api/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Instantly update the UI without reloading the page
                setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            }
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-72 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-lg">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="text-indigo-400" />
                        <h1 className="font-bold text-xl tracking-tight">TaskFlow</h1>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 text-sm text-slate-400 font-medium">
                        <span>PROJECTS</span>
                        {/* Open Modal Button */}
                        {user.role === 'Admin' && (
                            <button onClick={() => setIsProjectModalOpen(true)} className="hover:text-indigo-400 transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        {projects.length === 0 ? (
                            <p className="text-slate-500 text-sm">No projects yet.</p>
                        ) : (
                            projects.map((project) => (
                                <button
                                    key={project._id} onClick={() => setSelectedProject(project)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${selectedProject?._id === project._id ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/5 text-slate-300'
                                        }`}
                                >
                                    <Folder className="w-4 h-4" />
                                    <span className="truncate">{project.title}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Profile */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex justify-between items-center">
                        <div className="truncate">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-indigo-400">{user.role}</p>
                        </div>
                        <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {selectedProject ? (
                    <>
                        <header className="p-8 border-b border-white/5 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                                <p className="text-slate-400 mt-1">{selectedProject.description}</p>
                            </div>
                            {user.role === 'Admin' && (
                                <button onClick={() => setIsTaskModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <Plus className="w-4 h-4" /> Add Task
                                </button>
                            )}
                        </header>

                        <div className="p-8 flex-1 overflow-y-auto">
                            {tasks.length === 0 ? (
                                <div className="text-center mt-20 text-slate-500">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No tasks found for this project.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {tasks.map(task => {
                                        // Overdue Logic
                                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

                                        return (
                                            <div key={task._id} className={`bg-white/5 border p-5 rounded-xl backdrop-blur-sm transition-all ${isOverdue ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/10'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                                            {task.title}
                                                            {isOverdue && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue</span>}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                                    </div>

                                                    {/* Status Dropdown */}
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                        className={`text-sm rounded-lg px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none transition-colors
                                                            ${task.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                                task.status === 'In Progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}
                                                    >
                                                        <option value="Pending" className="bg-slate-800 text-white">Pending</option>
                                                        <option value="In Progress" className="bg-slate-800 text-white">In Progress</option>
                                                        <option value="Completed" className="bg-slate-800 text-white">Completed</option>
                                                    </select>
                                                </div>

                                                <div className="mt-4 text-xs text-slate-500 flex gap-4">
                                                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                    {task.assignedTo && <span>Assigned to: {task.assignedTo.name}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        Select a project from the sidebar to view tasks.
                    </div>
                )}
            </main>

            {/* Mount the Modal Component */}
            <CreateProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                token={user.token}
                onProjectCreated={(newProject) => {
                    // Update UI immediately with the new project
                    setProjects([...projects, newProject]);
                    setSelectedProject(newProject);
                }}
            />

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                token={user.token}
                projectId={selectedProject?._id}
                onTaskCreated={(newTask) => setTasks([...tasks, newTask])}
            />
        </div>
    );
};

export default Dashboard;