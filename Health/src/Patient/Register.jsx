import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { HeartPulse, Lock, Mail, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    emergencyContact: '',
    chronicConditions: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role: 'PATIENT',
        username: formData.username.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        chronicConditions: formData.chronicConditions.trim(),
      };

      const res = await api.post('/api/auth/register/patient', payload);

      if (res.status === 200 || res.status === 201) {
        toast.success('Patient account registered! Please sign in.');
        navigate('/');
      }
    } catch (apiError) {
      console.error('Registration Failure:', apiError);
      setError(
        apiError.response?.data?.message ||
          apiError.response?.data ||
          'Registration failed. Please check your inputs.'
      );
      toast.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:px-24 justify-center h-screen overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8 mt-10">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">HealthCare+</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Your Health, Our Priority</p>
          </div>
        </div>

        <div className="w-full max-w-md pb-10">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Register as a patient to book consultations</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (234) 567-8900"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Name and Phone Number"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Chronic Conditions (if any)</label>
              <input
                type="text"
                name="chronicConditions"
                value={formData.chronicConditions}
                onChange={handleChange}
                placeholder="e.g. Asthma, Diabetes"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            <hr className="my-4" />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address (Login)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center disabled:opacity-70 mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Register Patient Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Image/Graphic Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 items-center justify-center overflow-hidden">
        {/* We will use auth-bg.png which the user will provide. We position it to cover the right side. */}
        <div 
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        />
      </div>
    </div>
  );
};

export default Register;