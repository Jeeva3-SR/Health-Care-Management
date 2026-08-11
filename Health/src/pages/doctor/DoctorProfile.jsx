import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthstore';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../lib/api';
import { toast } from 'sonner';
import { Clock, KeyRound, UserRoundCog } from 'lucide-react';

const DoctorProfile = () => {
  const { user, role, logout } = useAuthStore();

  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('16:30');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    degree: '',
    specialization: '',
    hospitalName: '',
    hospitalLocation: '',
    password: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/doctor/me');
        const data = res.data;
        setStartTime(data.startTime || '09:30');
        setEndTime(data.endTime || '16:30');
        setFormData({
          name: data.name || '',
          email: data.user?.username || '',
          degree: data.degree || '',
          specialization: data.specialization || '',
          hospitalName: data.hospitalName || '',
          hospitalLocation: data.hospitalLocation || '',
          password: '',
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

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    setScheduleLoading(true);
    try {
      await api.put('/api/doctor/schedule', {
        startTime,
        endTime,
      });
      toast.success('Consultation hours & time slots updated successfully!');
    } catch (err) {
      toast.error('Failed to update consultation schedule.');
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    
    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password; // Don't send empty password
      }
      
      await api.put('/api/doctor/me', payload);
      toast.success('Profile updated successfully!');
      
      if (payload.password || (payload.email && payload.email !== user.username)) {
        toast.info('Credentials updated. Please log in again.');
        logout();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center font-bold text-slate-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Practitioner Profile & Schedule</h1>
        <p className="text-xs text-slate-500 font-medium">Manage clinical working shifts and account credentials</p>
      </div>

      <Card className="flex items-center space-x-4">
        <Avatar name={formData.name || user?.username || 'Doctor'} size="xl" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{formData.name || user?.username}</h3>
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{role}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Update */}
        <Card>
          <div className="flex items-center space-x-2 mb-4 text-slate-900">
            <UserRoundCog className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold">Profile Details</h3>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email (Login)" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Degree" name="degree" value={formData.degree} onChange={handleChange} required />
            <Input label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} required />
            <Input label="Hospital Name" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />
            <Input label="Hospital Location" name="hospitalLocation" value={formData.hospitalLocation} onChange={handleChange} required />

            <hr className="my-4" />
            
            <h3 className="text-sm font-bold text-slate-900 mb-2">Change Password (Optional)</h3>
            <Input label="New Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />

            <Button type="submit" variant="primary" loading={profileLoading} className="w-full mt-4">
              Update Profile Details
            </Button>
          </form>
        </Card>

        {/* Shift Operating Hours Settings */}
        <Card>
          <div className="flex items-center space-x-2 mb-4 text-slate-900">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold">Consultation Shifts</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Set your daily starting and ending shift times. Patient booking slots will be generated automatically in 30-minute intervals within this window.</p>

          <form onSubmit={handleUpdateSchedule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Shift Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="Shift End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" loading={scheduleLoading} className="w-full">
              Save Working Hours & Time Slots
            </Button>
          </form>
        </Card>
        
      </div>
    </div>
  );
};

export default DoctorProfile;
