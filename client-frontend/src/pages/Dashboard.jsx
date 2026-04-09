import React, { useState, useEffect } from "react";
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import pdfToText from "react-pdftotext";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const colors = ["#1F3C88", "#E36414", "#2EC4B6", "#F6F7EB"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", authHeader);
      setAllResumes(data.resumes);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        authHeader
      );
      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        authHeader
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm("Delete this resume?");
    if (!confirm) return;

    try {
      await api.delete(
        `/api/resumes/delete/${resumeId}`,
        authHeader
      );
      setAllResumes((prev) =>
        prev.filter((resume) => resume._id !== resumeId)
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (token) loadAllResumes();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-36 h-48 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <PlusIcon className="size-10" />
          <p>Create Resume</p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-36 h-48 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <UploadCloudIcon className="size-10" />
          <p>Upload Resume</p>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const color = colors[index % colors.length];
          return (
            <button
              key={resume._id}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="relative w-full sm:max-w-36 h-48 rounded-lg flex flex-col items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <FilePenLineIcon className="size-7" />
              <p>{resume.title}</p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 flex gap-1"
              >
                <TrashIcon
                  onClick={() => deleteResume(resume._id)}
                  className="size-6"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="size-6"
                />
              </div>
            </button>
          );
        })}
      </div>

      {showCreateResume && (
        <form
          onSubmit={handleSubmitCreate}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title"
              required
            />
            <button>Create</button>
            <XIcon onClick={() => setShowCreateResume(false)} />
          </div>
        </form>
      )}

      {showUploadResume && (
        <form
          onSubmit={handleSubmitUpload}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title"
              required
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <button>
              {isLoading ? <LoaderCircleIcon className="animate-spin" /> : "Upload"}
            </button>
            <XIcon onClick={() => setShowUploadResume(false)} />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;