import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthstore';
import authService from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { HeartPulse, Lock, Mail, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, token, role } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && role) {
      if (useAuthStore.getState().requiresPasswordChange) {
        navigate('/reset-password');
        return;
      }
      const lowerRole = role.toLowerCase().replace(/^role_/, '');
      if (lowerRole === 'patient') navigate('/patient');
      else if (lowerRole === 'doctor') navigate('/doctor');
      else if (lowerRole === 'admin') navigate('/admin');
    }
  }, [token, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email.trim(), password);

      if (!data?.token) {
        setError('Authentication failed. No access token received.');
        return;
      }

      const userRole = (data.role || '').toLowerCase().replace(/^role_/, '');
      const userObj = { username: data.username, role: data.role };

      if (selectedRole === 'patient' && userRole === 'patient') {
        login(userObj, data.token, data.role, data.requiresPasswordChange);
        if (data.requiresPasswordChange) {
          navigate('/reset-password');
        } else {
          toast.success('Successfully logged in as Patient!');
          navigate('/patient');
        }
        return;
      }

      if (selectedRole === 'doctor' && userRole === 'doctor') {
        login(userObj, data.token, data.role, data.requiresPasswordChange);
        if (data.requiresPasswordChange) {
          navigate('/reset-password');
        } else {
          toast.success('Welcome back, Doctor!');
          navigate('/doctor');
        }
        return;
      }

      if (selectedRole === 'admin' && userRole === 'admin') {
        login(userObj, data.token, data.role, data.requiresPasswordChange);
        toast.success('Administrator access granted!');
        navigate('/admin');
        return;
      }

      setError(`Account is registered as ${userRole.toUpperCase()}, not ${selectedRole.toUpperCase()}.`);
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          apiError.response?.data ||
          'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:px-24 justify-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-12">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">HealthCare+</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Your Health, Our Priority</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back!</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Please login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Login Role</label>
              <div className="flex space-x-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setSelectedRole(r.value); setError(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedRole === r.value
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start space-x-2 text-rose-700 text-xs font-semibold">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-slate-600">
            Don't have an account?{' '}
            <Link
              to={selectedRole === 'doctor' ? '/doctor/register' : '/patient/register'}
              className="text-blue-600 font-bold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Image/Graphic Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 items-center justify-center overflow-hidden">
        {/* We will use auth-bg.png which the user will provide. We position it to cover the right side. */}
        <div 
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('../../public/image.png')" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
