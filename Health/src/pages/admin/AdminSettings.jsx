import React from 'react';
import Card from '../../components/ui/Card';
import { Settings, Bell, Lock, Server } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure clinical system thresholds and infrastructure options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center space-x-3 text-teal-600">
            <Server className="h-5 w-5" />
            <h3 className="font-bold text-slate-900">Database & Backend</h3>
          </div>
          <p className="text-xs text-slate-500">Connected to Spring Boot API running on port 3000 with MySQL storage.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Bell className="h-5 w-5" />
            <h3 className="font-bold text-slate-900">Email Notifications</h3>
          </div>
          <p className="text-xs text-slate-500">JavaMailSender enabled for doctor approval credentials delivery.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center space-x-3 text-amber-600">
            <Lock className="h-5 w-5" />
            <h3 className="font-bold text-slate-900">Security & CORS</h3>
          </div>
          <p className="text-xs text-slate-500">Stateless JWT session security with CORS configured for Vite dev server.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center space-x-3 text-rose-600">
            <Settings className="h-5 w-5" />
            <h3 className="font-bold text-slate-900">File Storage</h3>
          </div>
          <p className="text-xs text-slate-500">Multipart file uploads configured for doctor license proofs.</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
