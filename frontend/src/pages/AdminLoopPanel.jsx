import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { serverUrl } from "../App"; // ✅ Import from App.js or wherever it's defined

const AdminLoopPanel = () => {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user.userData); // ✅ Redux userData

  const fetchLoops = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/admin/loops`, {
        withCredentials: true,
      });
      setLoops(res.data);
    } catch (error) {
      console.error("Failed to fetch loops:", error);
      alert("Failed to fetch loops: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (loopId) => {
    if (!window.confirm("Are you sure you want to delete this loop? This action is permanent.")) return;

    try {
      await axios.delete(`${serverUrl}/api/admin/loops/${loopId}`, {
        withCredentials: true,
      });
      setLoops((prevLoops) => prevLoops.filter((l) => l._id !== loopId));
      alert("Loop deleted successfully!");
    } catch (error) {
      console.error("Failed to delete loop:", error);
      alert("Delete failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLike = async (loopId) => {
    try {
      const res = await axios.get(`${serverUrl}/api/loop/like/${loopId}`, {
        withCredentials: true,
      });
      setLoops((prevLoops) =>
        prevLoops.map((l) => (l._id === loopId ? res.data : l))
      );
    } catch (error) {
      console.error("Failed to like loop:", error);
      alert("Failed to like loop: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (userData?.isAdmin) {
      fetchLoops();
    }
  }, [userData]);

  if (!userData || !userData.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="text-center bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-red-500">Access Denied 🚫</h2>
          <p className="mt-3 text-gray-400">
            You must be logged in as an administrator to view this panel.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition duration-300 shadow-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-indigo-400 text-xl animate-pulse">
          Loading loops... 🔄
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-700/50">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-4 sm:mb-0">
          Admin Loop Control 🎬
        </h2>
        <nav className="flex flex-wrap gap-3">
          <Link to="/admin" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md">
            🏠 Admin Home
          </Link>
          <Link to="/admin/posts" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md">
            📸 Post Control
          </Link>
          <Link to="/admin/loops" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-lg ring-2 ring-indigo-500/50">
            🔁 Loop Control
          </Link>
        </nav>
      </header>

      <main>
        {loops.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-gray-700 rounded-xl bg-gray-800/50">
            <p className="text-lg">No video loops found on the platform.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {loops.map((loop) => (
              <div key={loop._id} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700/70 hover:shadow-2xl transition duration-300">
                <div className="flex items-center mb-4 pb-2 border-b border-gray-700/50">
                  <span className="text-lg text-indigo-300 font-bold">
                    {loop.author?.name || "Unknown User"}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    (@{loop.author?.userName || "unknown"})
                  </span>
                </div>

                <div className="mb-4 text-gray-300">
                  <strong className="text-gray-200">Caption:</strong>{" "}
                  {loop.caption || "(No caption provided)"}
                </div>

                <div className="mb-6 max-w-xl mx-auto">
                  <video controls className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-700">
                    <source src={loop.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-700/50">
                  <p className="text-base text-gray-400 font-medium">
                    ❤️ Likes: <span className="text-white font-semibold">{loop.likes.length}</span>
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(loop._id)}
                      className={`px-5 py-2 rounded-full text-white text-sm font-semibold transition duration-300 shadow-md 
                        ${
                          loop.likes.includes(userData._id)
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                      {loop.likes.includes(userData._id) ? "💔 Unlike" : "👍 Like"}
                    </button>

                    <button
                      onClick={() => handleDelete(loop._id)}
                      className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition duration-300 shadow-md"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLoopPanel;
