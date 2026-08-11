import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthstore';
import authService from '../../services/authService';
import { ShieldAlert, Lock, EyeOff, Eye } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { user, token, role, clearPasswordChangeFlag } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(oldPassword, newPassword);
      clearPasswordChangeFlag();
      toast.success('Password successfully reset!');
      
      const lowerRole = role?.toLowerCase().replace(/^role_/, '');
      if (lowerRole === 'patient') navigate('/patient');
      else if (lowerRole === 'doctor') navigate('/doctor');
      else if (lowerRole === 'admin') navigate('/admin');
      else navigate('/');
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          apiError.response?.data ||
          'Failed to reset password. Please check your old password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Required</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            You must reset your administrator-provided password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current temporary password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
             >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
             </button>
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
              'Reset Password and Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
