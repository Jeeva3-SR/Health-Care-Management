import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthstore';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import authService from '../../services/authService';
import { toast } from 'sonner';

const AdminProfile = () => {
  const { user, role } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please enter both old and new password.');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage system administrator account settings</p>
      </div>

      <Card className="flex items-center space-x-4">
        <Avatar name={user?.username || 'Admin'} size="xl" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{user?.username}</h3>
          <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">{role}</p>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-bold text-slate-900 mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminProfile;
