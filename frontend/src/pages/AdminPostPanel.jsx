// frontend/src/pages/AdminPostPanel.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

const serverUrl = "https://campuslink-backend-rw6d.onrender.com/api/admin";

const AdminPostPanel = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [processingReportId, setProcessingReportId] = useState(null);

  // Search/Filter States
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [postFilter, setPostFilter] = useState("all"); // 'all' or 'popular'
  const [reportFilter, setReportFilter] = useState("pending"); // 'pending' or 'all'

  const { userData } = useSelector((state) => state.user);

  // --- Data Fetching Functions ---

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/posts`, { withCredentials: true });
      // Sort posts by creation date descending
      const sortedPosts = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert(
        "Failed to fetch posts: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${serverUrl}/reports`, { withCredentials: true });
      // Sort reports by status (pending first) and then by creation date descending
      const sortedReports = (res.data || []).sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAllReports(sortedReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      alert(
        "Failed to fetch reports: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (userData?.isAdmin) {
      fetchPosts();
      fetchReports();
    }
  }, [userData]);

  // --- Filtering Logic (UseMemo for Performance) ---

  const filteredPosts = useMemo(() => {
    let currentPosts = allPosts;
    const search = postSearchTerm.toLowerCase();

    if (postFilter === "popular") {
      // Example: show posts with more than 10 likes
      currentPosts = currentPosts.filter((post) => (post.likes || []).length > 10);
    }

    if (search) {
      currentPosts = currentPosts.filter(
        (post) =>
          (post.author?.name || "")
            .toLowerCase()
            .includes(search) ||
          (post.author?.userName || "")
            .toLowerCase()
            .includes(search) ||
          (post.caption || "")
            .toLowerCase()
            .includes(search)
      );
    }

    return currentPosts;
  }, [allPosts, postSearchTerm, postFilter]);

  const filteredReports = useMemo(() => {
    let currentReports = allReports;

    if (reportFilter === "PENDING") {
      currentReports = currentReports.filter((report) => report.status === "PENDING");
    }

    // Reports don't have a separate search input yet, but are ready for it.

    return currentReports;
  }, [allReports, reportFilter]);


  // --- Action Handlers (Kept from original code) ---

  const handleLike = async (postId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/post/like/${postId}`,
        { withCredentials: true }
      );
      setAllPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action is irreversible."))
      return;
    try {
      await axios.delete(`${serverUrl}/posts/${postId}`, { withCredentials: true });
      setAllPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted successfully!");
      fetchReports(); // Refresh reports to clear any linked to the deleted post
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Delete failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleResolveReport = async (reportId) => {
    setProcessingReportId(reportId);
    try {
      await axios.patch(
        `${serverUrl}/reports/${reportId}`,
        { status: "resolved" },
        { withCredentials: true }
      );
      setAllReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved" } : r))
      );
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Failed to resolve report: " + (error.response?.data?.message || error.message));
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report? This action is irreversible."))
      return;
    setProcessingReportId(reportId);
    try {
      await axios.delete(`${serverUrl}/reports/${reportId}`, { withCredentials: true });
      setAllReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Failed to delete report: " + (error.response?.data?.message || error.message));
    } finally {
      setProcessingReportId(null);
    }
  };

  // --- JSX Render ---

  if (!userData || !userData.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="text-center bg-gray-800 p-10 rounded-xl shadow-2xl border border-red-500/50">
          <h2 className="text-4xl font-extrabold text-red-500 mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="mr-3" /> Access Denied
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            You must be logged in as an **administrator** to view this panel.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-base tracking-wide transition duration-300 transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loadingPosts || loadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-indigo-400 text-2xl font-semibold flex items-center">
          <FaSpinner className="animate-spin mr-3" /> Loading Admin Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-indigo-500/30 pb-6">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-4 sm:mb-0 flex items-center">
          <RiAdminFill className="mr-3 text-5xl" /> Admin Post & Report Panel
        </h2>

        <nav className="flex gap-3 flex-wrap justify-center sm:justify-end">
          <Link
            to="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold shadow-md transition duration-200"
          >
            🏠 Admin Home
          </Link>
          <Link
            to="/admin/posts"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-bold shadow-lg ring-2 ring-indigo-500/50 transition duration-200 transform scale-105"
          >
            📸 Post Control
          </Link>
          <Link
            to="/admin/loops"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold shadow-md transition duration-200"
          >
            🔁 Loop Control
          </Link>
        </nav>
      </header>

      {/* Posts Section */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold text-indigo-300 mb-4 border-l-4 border-indigo-500 pl-3">
          All Posts ({filteredPosts.length} / {allPosts.length})
        </h3>

        {/* Post Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by Author Name, Username, or Caption..."
              value={postSearchTerm}
              onChange={(e) => setPostSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition duration-150"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <FaFilter className="text-indigo-400" />
            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white appearance-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition duration-150"
            >
              <option value="all">All Posts</option>
              <option value="popular">Popular (10+ Likes)</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="p-6 bg-gray-800 rounded-xl text-center text-gray-400 italic text-lg shadow-inner">
            <FaExclamationTriangle className="inline-block mr-2" /> No posts found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-10">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700/70 hover:border-indigo-500/50 transition duration-300"
              >
                {/* ... Post Content (kept the same) ... */}
                <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
                  <span className="text-xl text-indigo-300 font-bold">
                    {post.author?.name || "Unknown User"}
                  </span>
                  <span className="ml-3 text-base text-gray-400">
                    (@{post.author?.userName || "unknown"})
                  </span>
                  <span className="ml-auto text-sm text-gray-500">
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-6 text-gray-300 bg-gray-700/30 p-4 rounded-lg">
                  <strong className="text-gray-200 block mb-1">Caption:</strong>
                  <p className="whitespace-pre-wrap">
                    {post.caption || "(No caption provided)"}
                  </p>
                </div>

                {(post.media || post.mediaUrl) && (
                  <div className="mb-8 max-w-xl mx-auto border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg">
                    {post.mediaType === "image" ? (
                      <img
                        src={
                          typeof post.media === "string"
                            ? post.media
                            : post.media.media || post.mediaUrl || ""
                        }
                        alt="Post content"
                        className="w-full h-auto max-h-[500px] object-contain bg-black"
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-auto max-h-[500px] object-contain bg-black"
                        preload="metadata"
                      >
                        <source
                          src={
                            typeof post.media === "string"
                              ? post.media
                              : post.media.media || post.mediaUrl || ""
                          }
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-700">
                  <p className="text-lg text-gray-400 font-medium flex items-center">
                    <FaHeart className="text-red-500 mr-2" /> Likes:
                    <span className="text-white font-bold ml-2">
                      {(post.likes || []).length}
                    </span>
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`px-5 py-2 rounded-full text-white text-sm font-bold transition duration-300 flex items-center shadow-md ${
                        post.likes?.includes(userData._id)
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-indigo-500 hover:bg-indigo-600"
                      }`}
                    >
                      <FaHeart className="mr-2" />
                      {post.likes?.includes(userData._id) ? "Unlike" : "Like"}
                    </button>

                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="px-5 py-2 rounded-full text-white text-sm font-bold bg-red-600 hover:bg-red-700 transition duration-300 flex items-center shadow-md"
                    >
                      <FaTrashAlt className="mr-2" /> Delete Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}

      {/* Reports Section */}
      <section>
        <h3 className="text-3xl font-bold text-indigo-300 mb-4 border-l-4 border-red-500 pl-3">
          User Reports ({filteredReports.length} / {allReports.length})
        </h3>

        {/* Report Filter Controls */}
        <div className="flex justify-end gap-4 mb-8 bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700">
          <div className="flex items-center gap-2">
            <FaFilter className="text-red-400" />
            <select
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white appearance-none focus:ring-red-500 focus:border-red-500 cursor-pointer transition duration-150"
            >
              <option value="pending">Pending Reports</option>
              <option value="all">All Reports (Inc. Resolved)</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="p-6 bg-gray-800 rounded-xl text-center text-gray-400 italic text-lg shadow-inner">
            <FaCheckCircle className="inline-block mr-2 text-green-500" /> All clear! No {reportFilter} reports found.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className={`p-6 rounded-xl shadow-xl transition duration-300 ${
                  report.status === "resolved"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-700 border-2 border-yellow-500/50"
                }`}
              >
                {/* ... Report Content (kept the same) ... */}
                <div className="flex items-start mb-4 pb-4 border-b border-gray-600">
                  <img
                    src={
                      report.reportedBy?.profileImage ||
                      "https://via.placeholder.com/150/0000FF/808080?text=User"
                    }
                    alt={report.reportedBy?.name || "User"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 flex-shrink-0"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="text-lg text-indigo-400 font-bold">
                      {report.reportedBy?.name || "Unknown User"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      @{report.reportedBy?.userName || "unknown"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported: {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4 bg-gray-600/50 p-3 rounded-lg">
                  <strong className="text-gray-200 block mb-1 text-sm uppercase tracking-wider">
                    Reason:
                  </strong>
                  <p className="text-gray-300 whitespace-pre-wrap italic">
                    {report.reason || "(No reason provided)"}
                  </p>
                </div>

                {report.post ? (
                  <div className="mb-4">
                    <strong className="text-gray-200 block mb-2">
                      Reported Post Preview:
                    </strong>
                    <div className="max-w-xs max-h-48 overflow-hidden rounded-lg border-2 border-gray-600 mx-auto shadow-md">
                      {(() => {
                        const mediaUrl = report.post?.media;
                        const isImage =
                          typeof mediaUrl === "string" &&
                          /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(mediaUrl);

                        if (isImage) {
                          return (
                            <img
                              src={mediaUrl}
                              alt="Reported Post Media"
                              className="w-full h-full object-cover"
                            />
                          );
                        } else {
                          return (
                            <div className="text-sm text-red-400 text-center py-4 bg-gray-900">
                              No image preview available.
                            </div>
                          );
                        }
                      })()}
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-2">
                      Post ID: {report.post._id}
                    </p>
                  </div>
                ) : (
                  <p className="mb-4 text-sm text-gray-500 italic">
                    Linked post not found or was deleted.
                  </p>
                )}

                <div className="pt-4 border-t border-gray-600">
                  <p className="mb-4 text-base font-medium flex items-center">
                    Status:
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-bold shadow-inner ${
                        report.status === "resolved"
                          ? "bg-green-700 text-green-300"
                          : "bg-yellow-700 text-yellow-300 animate-pulse"
                      }`}
                    >
                      {report.status?.toUpperCase() || "PENDING"}
                    </span>
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleResolveReport(report._id)}
                      disabled={
                        processingReportId === report._id ||
                        report.status === "resolved"
                      }
                      className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition duration-300 flex items-center shadow-md ${
                        report.status === "resolved"
                          ? "bg-gray-600 cursor-not-allowed opacity-70"
                          : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
                      }`}
                    >
                      {processingReportId === report._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Processing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" /> Mark as Resolved
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      disabled={processingReportId === report._id}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition duration-300 flex items-center shadow-md transform hover:scale-105"
                    >
                      {processingReportId === report._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Deleting...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-2" /> Delete Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPostPanel;
