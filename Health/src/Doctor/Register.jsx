import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    specialization: "",
    hospitalName: "",
    hospitalLocation: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!proofFile) {
      setError("Please upload a valid document as proof of license.");
      setLoading(false);
      return;
    }

    try {
      // Use standard Multi-part FormData for files handling
      const data = new FormData();
      data.append("role", "doctor");
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("degree", formData.degree.trim());
      data.append("specialization", formData.specialization.trim());
      data.append("proof", proofFile);

      if (formData.hospitalName.trim()) {
        data.append("hospitalName", formData.hospitalName.trim());
      }

      if (formData.hospitalLocation.trim()) {
        data.append("hospitalLocation", formData.hospitalLocation.trim());
      }
      const res = await api.post("/api/auth/doctors/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success || res.status === 201) {
        alert(
          "Doctor registration submitted! Access pending credential verification.",
        );
        navigate("/");
      }
    } catch (apiError) {
      console.error("Registration Failure:", apiError);
      setError(
        apiError.response?.data?.error ||
          "Registration failed. Please check field requirements.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white border border-slate-100 shadow-xl rounded-2xl p-8 md:p-10 my-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Provider Onboarding
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Register your clinical medical license workspace portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 text-sm"
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 text-sm"
                placeholder="jane.smith@clinic.org"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Degree
              </label>
              <input
                type="text"
                name="degree"
                required
                value={formData.degree}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 text-sm"
                placeholder="e.g. MD, MBBS"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 px-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 text-sm"
                placeholder="e.g. Cardiology"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Hospital Affiliation{" "}
              <span className="lowercase italic font-normal text-slate-400">
                (optional)
              </span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none"
                  placeholder="General Medical Center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Hospital Location
                </label>
                <input
                  type="text"
                  name="hospitalLocation"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none"
                  placeholder="Boston, MA"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Proof of License Verification{" "}
              <span className="lowercase font-normal text-slate-400">
                (PDF or Image)
              </span>
            </label>
            <input
              type="file"
              required
              accept=".pdf, image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

         

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 shadow-md hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading
              ? "Submitting Credentials..."
              : "Register as Medical Doctor"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
