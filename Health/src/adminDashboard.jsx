import { useEffect, useState } from "react";
import api from "../src/lib/api";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("ALL"); // Options: "ALL", "PENDING", "APPROVED"
  const [loading, setLoading] = useState(true);

  // Fetches the entire list of doctors
  const fetchDoctors = async () => {
    try {
      // Changed endpoint from specific 'pending-doctors' to a broader one to fetch all
      const response = await api.get("/api/auth/doctors/all-doctors");
      setDoctors(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load doctor list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const approveDoctor = async (id) => {
    try {
      await api.put(`/api/admin/doctors/approve/${id}`);
      alert("Doctor approved successfully.");
      fetchDoctors(); // Refresh list after change
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);
      console.log(error);
      alert(`Approval failed: ${error.response?.data || error.message}`);
    }
  };

  // Handles logging the admin out of the session
  const handleLogout = () => {
    // 1. Clear tokens or session storage items used for auth
    localStorage.removeItem("token"); 
    sessionStorage.removeItem("token");
    
    // 2. Clear out any custom API headers if set globally
    if (api.defaults?.headers?.common) {
      delete api.defaults.headers.common["Authorization"];
    }

    // 3. Redirect back to the login view
    window.location.href = "/login";
  };

  // Client-side filtering logic based on the active radio button selection
  const filteredDoctors = doctors.filter((doctor) => {
    if (filter === "ALL") return true;
    return doctor.status?.toUpperCase() === filter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Loading verifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      {/* Dashboard Header */}
      <header className="mb-8 pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage system configurations and medical credential verifications
          </p>
        </div>
        
        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded-lg transition-colors shadow-sm self-start sm:self-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Dynamic Filter Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Filter Requests By Status
          </h4>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="radio"
                name="statusFilter"
                value="ALL"
                checked={filter === "ALL"}
                onChange={(e) => setFilter(e.target.value)}
                className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">All Doctors ({doctors.length})</span>
            </label>

            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="radio"
                name="statusFilter"
                value="PENDING"
                checked={filter === "PENDING"}
                onChange={(e) => setFilter(e.target.value)}
                className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">
                Pending ({doctors.filter(d => d.status?.toUpperCase() === "PENDING").length})
              </span>
            </label>

            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="radio"
                name="statusFilter"
                value="APPROVED"
                checked={filter === "APPROVED"}
                onChange={(e) => setFilter(e.target.value)}
                className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">
                Approved ({doctors.filter(d => d.status?.toUpperCase() === "APPROVED").length})
              </span>
            </label>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Title Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200 gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Medical Practitioner Roster
            </h3>
            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full w-fit">
              Showing {filteredDoctors.length} profiles
            </span>
          </div>

          {/* Table / Empty State Logic */}
          {filteredDoctors.length === 0 ? (
            <div className="py-16 text-center px-4">
              <p className="text-slate-500 text-sm">
                No profiles match the chosen dynamic filter criteria.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                      Doctor Details
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                      Credentials
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                      Hospital Information
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-[11px] tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email Stack */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{doctor.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{doctor.email}</div>
                      </td>
                      
                      {/* Specialization & Degree Stack */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{doctor.specialization}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{doctor.degree}</div>
                      </td>
                      
                      {/* Hospital & Location Stack */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {doctor.hospitalName || <span className="text-xs text-slate-400 italic">Not Specified</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {doctor.hospitalLocation || <span className="text-xs text-slate-400 italic">No Location</span>}
                        </div>
                      </td>

                      {/* Verification Document File Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.verificationProofPath ? (() => {
                          const normalized = doctor.verificationProofPath.replace(/\\/g, '/');
                          const filename = normalized.substring(normalized.lastIndexOf('/') + 1);
                          const documentWebUrl = `http://localhost:3000/api/proofs/${filename}`;

                          return (
                            <a
                              href={documentWebUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                              View Document
                            </a>
                          );
                        })() : (
                          <span className="text-xs text-slate-400 italic">No file uploaded</span>
                        )}
                      </td>
                      
                      {/* Contextual status pill badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize border ${
                          doctor.status?.toUpperCase() === 'APPROVED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {doctor.status?.toLowerCase() || 'unknown'}
                        </span>
                      </td>
                      
                      {/* Conditional Actions trigger layout */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {doctor.status?.toUpperCase() === "PENDING" ? (
                          <button
                            className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 active:translate-y-px text-white text-xs font-medium rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                            onClick={() => approveDoctor(doctor.id)}
                          >
                            Approve Credentials
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic pr-2 select-none">
                            No actions required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;