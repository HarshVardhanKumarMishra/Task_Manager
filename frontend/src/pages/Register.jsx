import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Admin' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await fetch('https://taskmanager-production-47bc.up.railway.app/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                login(data); 
                navigate('/'); 
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            {/* Glassmorphism Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-indigo-500/20 p-3 rounded-full inline-block mb-3">
                        <UserPlus className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Create an Account</h2>
                    <p className="text-slate-400 text-sm mt-1">Join the workspace</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Full Name" required
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input type="email" placeholder="Email Address" required
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input type="password" placeholder="Password" required
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="role" value="Admin" defaultChecked 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="accent-indigo-500" /> Admin
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input type="radio" name="role" value="Member"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="accent-indigo-500" /> Member
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;