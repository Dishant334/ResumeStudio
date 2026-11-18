import React, { useState, useEffect } from "react";
import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import pdfToText from "react-pdftotext";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
    <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()} className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
      <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><XIcon className="size-5" /></button>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </form>
  </div>
);

const PrimaryBtn = ({ busy, children }) => (
  <button disabled={busy} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors">
    {busy && <LoaderCircleIcon className="size-4 animate-spin" />}{children}
  </button>
);

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const accents = ["#4f46e5", "#e36414", "#0d9488", "#be185d", "#0369a1"];

  const [allResumes, setAllResumes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const err = (e) => toast.error(e?.response?.data?.message || e.message);
  const closeAll = () => { setShowCreateResume(false); setShowUploadResume(false); setEditResumeId(""); setTitle(""); setResume(null); };

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", authHeader);
      setAllResumes(data.resumes);
    } catch (e) { err(e); } finally { setFetching(false); }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/api/resumes/create", { title }, authHeader);
      closeAll();
      navigate(`/app/builder/${data.resume._id}`);
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Choose a PDF first");
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post("/api/ai/upload-resume", { title, resumeText }, authHeader);
      closeAll();
      navigate(`/app/builder/${data.resumeId}`);
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("resumeId", editResumeId);
      formData.append("resumeData", JSON.stringify({ title }));
      await api.put("/api/resumes/update", formData, authHeader);
      setAllResumes((prev) => prev.map((r) => (r._id === editResumeId ? { ...r, title } : r)));
      closeAll();
      toast.success("Renamed");
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await api.delete(`/api/resumes/delete/${resumeId}`, authHeader);
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted");
    } catch (e) { err(e); }
  };

  useEffect(() => { if (token) loadAllResumes(); }, [token]);

  const tile = "group h-52 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/50 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-brand-600";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">My resumes</h1>
      <p className="text-slate-500 text-sm mb-6">Create from scratch or import an existing PDF – AI fills in the details.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <button onClick={() => setShowCreateResume(true)} className={tile}><PlusIcon className="size-10" /><p className="font-medium">Create Resume</p></button>
        <button onClick={() => setShowUploadResume(true)} className={tile}><UploadCloudIcon className="size-10" /><p className="font-medium">Upload PDF</p></button>

        {fetching && [0, 1].map((i) => <div key={i} className="h-52 rounded-2xl bg-slate-200 animate-pulse" />)}

        {allResumes.map((r, index) => {
          const color = accents[index % accents.length];
          return (
            <div key={r._id} onClick={() => navigate(`/app/builder/${r._id}`)}
              className="relative cursor-pointer h-52 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col items-center justify-center text-center px-3">
              <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: color }} />
              <div className="size-14 rounded-xl grid place-items-center mb-3" style={{ background: `${color}18`, color }}><FilePenLineIcon className="size-7" /></div>
              <p className="font-medium line-clamp-2">{r.title}</p>
              <p className="text-xs text-slate-400 mt-1">Updated {new Date(r.updatedAt || r.createdAt || Date.now()).toLocaleDateString()}</p>
              <div onClick={(e) => e.stopPropagation()} className="absolute top-3 right-2 flex gap-1">
                <button aria-label="Rename" onClick={() => { setEditResumeId(r._id); setTitle(r.title); }} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"><PencilIcon className="size-4" /></button>
                <button aria-label="Delete" onClick={() => deleteResume(r._id)} className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"><TrashIcon className="size-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {!fetching && allResumes.length === 0 && <p className="text-center text-slate-400 mt-10">No resumes yet – create your first one above.</p>}

      {showCreateResume && (
        <Modal title="Create a resume" onClose={closeAll} onSubmit={handleSubmitCreate}>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., SDE Intern Resume" required className="w-full px-3 py-2.5 text-sm" />
          <PrimaryBtn busy={isLoading}>Create</PrimaryBtn>
        </Modal>
      )}

      {showUploadResume && (
        <Modal title="Import from PDF" onClose={closeAll} onSubmit={handleSubmitUpload}>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resume title" required className="w-full px-3 py-2.5 text-sm" />
          <label className="block border-2 border-dashed rounded-xl p-5 text-center text-sm text-slate-500 cursor-pointer hover:border-brand-400">
            <UploadCloudIcon className="size-8 mx-auto mb-1 text-slate-400" />
            {resume ? <span className="text-brand-600 font-medium">{resume.name}</span> : "Click to choose a PDF"}
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => setResume(e.target.files[0] || null)} />
          </label>
          <PrimaryBtn busy={isLoading}>{isLoading ? "Analysing with AI…" : "Import"}</PrimaryBtn>
        </Modal>
      )}

      {editResumeId && (
        <Modal title="Rename resume" onClose={closeAll} onSubmit={handleRename}>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2.5 text-sm" />
          <PrimaryBtn busy={isLoading}>Save</PrimaryBtn>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
