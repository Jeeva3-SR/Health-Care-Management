import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { CheckCircle2, Copy, FileText, ExternalLink, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const DoctorManagement = () => {
  const [search, setSearch] = useState('');
  const [doctorToApprove, setDoctorToApprove] = useState(null);
  const [approvalResult, setApprovalResult] = useState(null);
  const [doctorToReject, setDoctorToReject] = useState(null);
  const queryClient = useQueryClient();

  const { data: doctors, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDoctors'],
    queryFn: adminService.getAllDoctors,
  });

  const approveMutation = useMutation({
    mutationFn: adminService.approveDoctor,
    onSuccess: (data) => {
      toast.success('Doctor credentials approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminDoctors'] });
      setDoctorToApprove(null);

      if (data && data.email && data.password) {
        setApprovalResult({ email: data.email, password: data.password });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to approve doctor.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adminService.rejectDoctor,
    onSuccess: () => {
      toast.success('Doctor registration rejected.');
      queryClient.invalidateQueries({ queryKey: ['adminDoctors'] });
      setDoctorToReject(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reject doctor.');
    },
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filteredDoctors = (doctors || []).filter(
    (doc) =>
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.email?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard!');
  };

  const handleViewProof = (proofPath) => {
    if (!proofPath) {
      toast.error('No verification proof document uploaded.');
      return;
    }
    const fileName = proofPath.split(/[/\\]/).pop();
    const proofUrl = `http://localhost:3000/api/admin/doctors/proof/${encodeURIComponent(fileName)}`;
    window.open(proofUrl, '_blank', 'noopener,noreferrer');
  };

  const columns = [
    {
      label: 'Doctor Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-xs text-blue-600 font-semibold">{row.email}</div>
        </div>
      ),
    },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Degree', key: 'degree' },
    { label: 'Hospital', key: 'hospitalName' },
    {
      label: 'License Proof',
      key: 'verificationProofPath',
      render: (path) => (
        <Button
          size="sm"
          variant="outline"
          icon={FileText}
          onClick={() => handleViewProof(path)}
          title="View Doctor License Verification Document"
        >
          <span className="flex items-center gap-1">
            Proof <ExternalLink className="h-3 w-3 text-slate-400" />
          </span>
        </Button>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'APPROVED' ? 'success' : val === 'PENDING' ? 'warning' : 'error'}>
          {val}
        </Badge>
      ),
    },
    {
      label: 'Action',
      key: 'id',
      render: (id, row) =>
        row.status === 'PENDING' ? (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setDoctorToApprove(row)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDoctorToReject(row)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic font-medium">
            {row.status === 'APPROVED' ? 'Approved' : 'Rejected'}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Credential Approvals</h1>
          <p className="text-xs text-slate-500 font-medium">Review clinical practitioner licenses and authorize hospital access</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search doctor by name, email or specialty..." />
      </div>

      <DataTable columns={columns} data={filteredDoctors} emptyMessage="No medical doctors found matching filter." />

      {/* Confirmation Modal prior to Approval */}
      <Modal
        isOpen={Boolean(doctorToApprove)}
        onClose={() => setDoctorToApprove(null)}
        title="Confirm Doctor Approval"
      >
        <div className="space-y-5">
          <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
            <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Authorize Practitioner Credentials</p>
              <p className="text-xs text-blue-700 font-medium">
                Confirming will activate the doctor's account and generate login access.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-bold text-slate-500">Doctor Name:</span>
              <span className="font-black text-slate-900">{doctorToApprove?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-bold text-slate-500">Email Address:</span>
              <span className="font-bold text-blue-600">{doctorToApprove?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-bold text-slate-500">Specialization & Degree:</span>
              <span className="font-semibold text-slate-800">{doctorToApprove?.specialization} ({doctorToApprove?.degree})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-bold text-slate-500">Hospital Affiliation:</span>
              <span className="font-semibold text-slate-800">{doctorToApprove?.hospitalName || 'General Hospital'}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => setDoctorToApprove(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={approveMutation.isPending}
              onClick={() => approveMutation.mutate(doctorToApprove.id)}
            >
              Confirm & Generate Credentials
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal prior to Rejection */}
      <Modal
        isOpen={Boolean(doctorToReject)}
        onClose={() => setDoctorToReject(null)}
        title="Confirm Doctor Rejection"
      >
        <div className="space-y-5">
          <div className="flex items-center space-x-3 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900">
            <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Reject Doctor Credential Request</p>
              <p className="text-xs text-rose-700 font-medium">
                Are you sure you want to reject registration for {doctorToReject?.name}?
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => setDoctorToReject(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate(doctorToReject.id)}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Generated Credentials Popup Modal */}
      <Modal
        isOpen={Boolean(approvalResult)}
        onClose={() => setApprovalResult(null)}
        title="Doctor Approval & Access Credentials"
      >
        <div className="space-y-5">
          <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Doctor Account Approved & Activated!</p>
              <p className="text-xs text-emerald-700 font-medium">
                Access credentials have been generated and printed to the backend console.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px]">Doctor Username / Email</span>
              <p className="text-sm font-bold text-slate-900">{approvalResult?.email}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px]">Initial Plain Password</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-black text-blue-600 tracking-wider">{approvalResult?.password}</span>
                <Button
                  size="sm"
                  variant="outline"
                  icon={Copy}
                  onClick={() => copyToClipboard(`Username: ${approvalResult?.email}\nPassword: ${approvalResult?.password}`)}
                >
                  Copy Credentials
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="md" onClick={() => setApprovalResult(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorManagement;
