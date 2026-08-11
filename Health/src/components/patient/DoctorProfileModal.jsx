import React from 'react';
import { X, Award, Stethoscope, Building2, MapPin, Clock, CalendarCheck, ShieldCheck } from 'lucide-react';

export function DoctorProfileModal({ doctor, isOpen, onClose, onBookClick }) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transition-all">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-extrabold shadow-inner border border-white/30">
              Dr.
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white">{doctor.name}</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-300 fill-emerald-300/30" />
              </div>
              <p className="text-blue-100 font-medium text-sm mt-0.5">{doctor.specialization}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-xs text-blue-50 font-semibold border border-white/20">
                <Award className="w-3.5 h-3.5 mr-1.5" />
                {doctor.degree}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Hospital & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>Hospital / Clinic</span>
              </div>
              <p className="text-slate-800 font-bold text-sm">{doctor.hospitalName || 'Health Center'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <p className="text-slate-800 font-bold text-sm">{doctor.hospitalLocation || 'Main Branch'}</p>
            </div>
          </div>

          {/* Schedule & Slots */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-3">
              <Clock className="w-4 h-4" />
              <span>Available Consultation Hours</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                <span className="text-slate-400 font-medium block mb-0.5">Morning Slot</span>
                <span className="text-indigo-900 font-bold text-sm">{doctor.morningSlot || '09:30 - 12:30'}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                <span className="text-slate-400 font-medium block mb-0.5">Afternoon Slot</span>
                <span className="text-indigo-900 font-bold text-sm">{doctor.afternoonSlot || '13:30 - 16:30'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Consultation Status</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Accepting Appointments
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookClick(doctor);
            }}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
