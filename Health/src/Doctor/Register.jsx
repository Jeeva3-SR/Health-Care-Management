import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { HeartPulse, ShieldAlert, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    degree: '',
    specialization: '',
    hospitalName: '',
    hospitalLocation: '',
  });
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!proofFile) {
      setError('Please upload your official medical license / proof document.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('degree', formData.degree.trim());
      data.append('specialization', formData.specialization.trim());
      data.append('hospitalName', formData.hospitalName.trim() || 'General Hospital');
      data.append('hospitalLocation', formData.hospitalLocation.trim() || 'Main Campus');
      data.append('proof', proofFile);

      // Backend endpoint is /api/doctor/register
      const res = await api.post('/api/doctor/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Doctor registration submitted! Pending administrator approval.');
      navigate('/');
    } catch (apiError) {
      console.error('Doctor Registration Error:', apiError);
      setError(
        apiError.response?.data?.message ||
          apiError.response?.data ||
          'Registration failed. Please check field requirements.'
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
        <div className="max-w-md w-full mx-auto pb-10">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 pt-8 lg:pt-0">
            <HeartPulse className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">HealthCare+</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Your Health, Our Priority</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Doctor Registration</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Onboard your medical license portfolio</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
              />
              <Input
                label="Official Email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane.smith@hospital.org"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Medical Degree"
                type="text"
                name="degree"
                required
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. MD, MBBS"
              />
              <Input
                label="Specialization"
                type="text"
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Hospital Affiliation Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hospital Name"
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="St. Jude Hospital"
                />
                <Input
                  label="Hospital Location"
                  type="text"
                  name="hospitalLocation"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Verification Proof (Medical License)
              </label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-center">
                <input
                  type="file"
                  required
                  accept=".pdf, image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center space-x-3 text-slate-600">
                  {proofFile ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{proofFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-blue-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-600">Click or drag license proof document</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start space-x-2 text-rose-700 text-xs font-semibold mt-4">
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
                'Submit Credentials for Approval'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already registered?{' '}
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Sign In here
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

export default DoctorRegister;
