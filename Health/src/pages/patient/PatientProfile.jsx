import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthstore';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../lib/api';
import { toast } from 'sonner';

const PatientProfile = () => {
  const { user, role, logout } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    emergencyContact: '',
    chronicConditions: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/patient/me');
        const data = res.data;
        setFormData({
          name: data.name || '',
          email: data.user?.username || '',
          phone: data.phone || '',
          age: data.age || '',
          gender: data.gender || 'Male',
          bloodGroup: data.bloodGroup || '',
          emergencyContact: data.emergencyContact || '',
          chronicConditions: data.chronicConditions || '',
          password: '', // don't pre-fill password
        });
      } catch (err) {
        toast.error('Failed to load profile.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password; // Don't send empty password
      }
      
      await api.put('/api/patient/me', payload);
      toast.success('Profile updated successfully!');
      
      // If email or password was changed, user should re-login for safety
      if (payload.password || (payload.email && payload.email !== user.username)) {
        toast.info('Credentials updated. Please log in again.');
        logout();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center font-bold text-slate-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Account & Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage personal demographics and account credentials</p>
      </div>

      <Card className="flex items-center space-x-4">
        <Avatar name={formData.name || user?.username || 'Patient'} size="xl" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{formData.name || user?.username}</h3>
          <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">{role}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-bold text-slate-900 mb-4">Update Profile Details</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            <Input label="Email (Login)" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium">
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
          
          <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
          <Input label="Chronic Conditions" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} />
          
          <hr className="my-4" />
          
          <h3 className="text-base font-bold text-slate-900 mb-2">Change Password (Optional)</h3>
          <p className="text-xs text-slate-500 mb-4">Leave blank if you do not want to change your password.</p>
          <Input label="New Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />

          <Button type="submit" variant="primary" loading={loading} className="mt-4">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PatientProfile;
