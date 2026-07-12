import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        role: 'PATIENT',
        username: formData.username.trim(),
        password: formData.password,
      };

      const res = await api.post('/api/auth/register/patient', payload);
      
      if (res.status === 200) {
        alert('Patient registration successful! Please log in.');
        navigate('/login');
      }
    } catch (apiError) {
      console.error('Registration Failure:', apiError);
      setError(apiError.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Registration</h2>
          <p className="text-sm text-slate-500 mt-1">Create your medical portal account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Email Address or Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
              placeholder="name@example.com"
            />
          </div>

          

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-800 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start space-x-2 text-red-700 text-sm font-medium">
              <span className="text-xs">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3.5 shadow-md hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Register as Patient'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;