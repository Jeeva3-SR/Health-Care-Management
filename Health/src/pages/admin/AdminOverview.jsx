import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Stethoscope, Users, Clock, ShieldCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOverview = () => {
  const navigate = useNavigate();

  const { data: doctors, isLoading: docsLoading, isError: docsErr, refetch: refetchDocs } = useQuery({
    queryKey: ['adminOverviewDoctors'],
    queryFn: adminService.getAllDoctors,
  });

  const { data: patients, isLoading: patsLoading, isError: patsErr } = useQuery({
    queryKey: ['adminOverviewPatients'],
    queryFn: adminService.getAllPatients,
  });

  if (docsLoading || patsLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (docsErr || patsErr) return <ErrorState onRetry={refetchDocs} />;

  const pendingDoctors = (doctors || []).filter((d) => d.status === 'PENDING');
  const approvedDoctors = (doctors || []).filter((d) => d.status === 'APPROVED');

  const columns = [
    { label: 'Doctor Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Degree', key: 'degree' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'APPROVED' ? 'success' : 'warning'}>
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-xs text-slate-500 font-medium">Doctor credential validation and hospital user management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Pending Doctor Approvals"
          value={pendingDoctors.length}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Approved Doctors"
          value={approvedDoctors.length}
          icon={Stethoscope}
          color="primary"
        />
        <StatsCard
          title="Registered Patients"
          value={patients?.length || 0}
          icon={Users}
          color="success"
        />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Pending Doctor Verification Requests</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/doctors')}>
            Go to Doctor Approvals &rarr;
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={pendingDoctors.length > 0 ? pendingDoctors : (doctors || []).slice(0, 5)}
          emptyMessage="No pending doctor approvals."
        />
      </div>
    </div>
  );
};

export default AdminOverview;
