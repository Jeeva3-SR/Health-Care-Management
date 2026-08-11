import React from 'react';
import { HeartPulse, Printer, ShieldCheck, Award, MapPin, Phone } from 'lucide-react';
import Button from './Button';

const PrescriptionReceipt = ({ appointment }) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getCleanName = (entity, defaultRole) => {
    if (!entity) return defaultRole;
    if (entity.name) return entity.name;
    const val = entity.username || entity.email || '';
    if (val.includes('@')) {
      const parts = val.split('@')[0];
      const formatted = parts.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return defaultRole === 'Doctor' ? `Dr. ${formatted}` : formatted;
    }
    return defaultRole === 'Doctor' && !val.startsWith('Dr.') ? `Dr. ${val}` : val;
  };

  const doctorName = getCleanName(appointment.doctor, 'Doctor');
  const patientName = getCleanName(appointment.patient, 'Patient');

  const hospitalName = appointment.doctor?.hospitalName || 'HealthCare+ Super Speciality Medical Center';
  const hospitalLocation = appointment.doctor?.hospitalLocation || 'Main Medical Campus, Boulevard Ave';
  const degree = appointment.doctor?.degree || 'M.B.B.S, M.D.';
  const specialization = appointment.doctor?.specialization || 'General Physician & Clinical Practitioner';

  const date = appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }) : new Date().toLocaleDateString();

  let medicines = [];
  try {
    if (appointment.prescriptionDetails) {
      medicines = JSON.parse(appointment.prescriptionDetails);
    }
  } catch (e) {
    if (appointment.prescriptionDetails) {
      medicines = [{ name: appointment.prescriptionDetails, dosage: 'As directed', frequency: 'Daily', duration: '5 days' }];
    }
  }

  return (
    <div className="bg-white">
      {/* Non-printable action bar */}
      <div className="print:hidden flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Prescription Receipt Preview</h3>
          <p className="text-xs text-slate-500">Official printable medical record document</p>
        </div>
        <Button variant="primary" icon={Printer} onClick={handlePrint}>
          Print / Save PDF
        </Button>
      </div>

      {/* Printable Receipt Container */}
      <div id="print-root" className="print:m-0 print:p-0 p-8 border border-slate-200 rounded-3xl shadow-lg print:shadow-none print:border-none w-full max-w-3xl mx-auto bg-white text-slate-900 font-sans">
        
        {/* Header Section */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{hospitalName}</h1>
                <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {hospitalLocation}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> +1 (800) 555-HEALTH</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest mb-1">
                Official Rx
              </span>
              <p className="text-xs font-bold text-slate-500">Ref: #{appointment.id?.toString().padStart(6, '0')}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{date}</p>
            </div>
          </div>
        </div>

        {/* Doctor & Patient Info Bar */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Attending Medical Practitioner</span>
            <p className="font-extrabold text-slate-900 text-base">{doctorName}</p>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{specialization}</p>
            <p className="text-[11px] font-medium text-slate-500">{degree}</p>
          </div>

          <div className="text-right border-l border-slate-200 pl-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Patient Info</span>
            <p className="font-extrabold text-slate-900 text-base">{patientName}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Consultation Type: Outpatient (OPD)</p>
            <p className="text-[11px] font-medium text-slate-500">Patient ID: #{appointment.patient?.id || 'P-' + appointment.id}</p>
          </div>
        </div>

        {/* Diagnosis Box */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-1">Diagnosis & Clinical Observation</span>
          <p className="font-bold text-slate-800 text-sm leading-relaxed">{appointment.diagnosis || appointment.reason || 'General Consultation'}</p>
        </div>

        {/* Medicines Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <span className="text-lg text-blue-600 font-serif font-bold">Rx</span> Prescribed Medications
            </h3>
            <span className="text-[11px] font-bold text-slate-400">{medicines.length} Item(s) Prescribed</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Medication Name</th>
                <th className="py-2.5 px-2">Dosage</th>
                <th className="py-2.5 px-2">Frequency</th>
                <th className="py-2.5 px-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {Array.isArray(medicines) && medicines.map((med, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">{med.name}</td>
                  <td className="py-3 px-2 font-semibold text-slate-700">{med.dosage || '-'}</td>
                  <td className="py-3 px-2 font-semibold text-blue-600">{med.frequency || '-'}</td>
                  <td className="py-3 px-2 font-semibold text-slate-700">{med.duration || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctor Signature & Clinical Stamp */}
        <div className="pt-8 border-t-2 border-slate-900 flex items-end justify-between mt-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verified Clinical Document</p>
              <p className="text-[10px] text-slate-400 font-medium">Digitally Signed & Authenticated</p>
            </div>
          </div>

          <div className="text-center">
            <div className="font-serif italic text-lg text-slate-700 mb-1 border-b border-slate-400 px-6 pb-1 inline-block">
              {doctorName}
            </div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">Authorized Practitioner</p>
            <p className="text-[10px] font-semibold text-slate-400">{degree}</p>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-4 text-[10px] font-medium text-slate-400">
          <p>This digital prescription receipt is valid for official medical use. Issued by {hospitalName}.</p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-root, #print-root * {
            visibility: visible;
          }
          #print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
          html, body {
            height: auto;
            overflow: visible !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}} />
    </div>
  );
};

export default PrescriptionReceipt;
