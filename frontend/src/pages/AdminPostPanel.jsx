// frontend/src/pages/AdminPostPanel.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// your backend admin api base
const serverUrl = "https://campuslink-backend-rw6d.onrender.com/api/admin";
// The like URL should probably also be defined outside if it's constant, 
// but keeping it in handleLike for now as per your original code's structure.

const AdminPostPanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);

  /**
   * Fetches all posts from the admin API endpoint.
   */
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/posts`, {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert("Failed to fetch posts: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles liking/unliking a post and updates the local state.
   * @param {string} postId - The ID of the post to like/unlike.
   */
  const handleLike = async (postId) => {
    try {
      // NOTE: This uses the public post API, not the admin one, which is typical.
      const res = await axios.get(`http://localhost:8000/api/post/like/${postId}`, {
        withCredentials: true,
      });
      // Update the specific post with the new data from the response
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post: " + (error.response?.data?.message || error.message));
    }
  };

  /**
   * Handles deleting a post after confirmation and updates the local state.
   * @param {string} postId - The ID of the post to delete.
   */
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action is irreversible.")) return;

    try {
      await axios.delete(`${serverUrl}/posts/${postId}`, {
        withCredentials: true,
      });
      // Filter out the deleted post from the state
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Delete failed: " + (error.response?.data?.message || error.message));
    }
  };

  /**
   * Effect to fetch posts when the user data is available and they are an admin.
   */
  useEffect(() => {
    if (userData?.isAdmin) {
      fetchPosts();
    }
  }, [userData]);

  // --- Render Conditions ---

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
            className="mt-6 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition duration-300"
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
          Loading posts... 🔄
        </div>
      </div>
    );
  }

  // --- Main Admin Panel Content ---

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-700/50">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-4 sm:mb-0">
          Admin Post Control 🛠️
        </h2>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md"
          >
            🏠 Admin Home
          </Link>
          <Link
            to="/admin/posts"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-lg ring-2 ring-indigo-500/50"
          >
            📸 Post Control
          </Link>
          <Link
            to="/admin/loops"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md"
          >
            🔁 Loop Control
          </Link>
        </nav>
      </header>

      {/* Posts List */}
      <main>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-gray-700 rounded-xl bg-gray-800/50">
            <p className="text-lg">No posts found on the platform.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700/70 hover:shadow-2xl transition duration-300"
              >
                {/* Author Info */}
                <div className="flex items-center mb-4 pb-2 border-b border-gray-700/50">
                  <span className="text-lg text-indigo-300 font-bold">
                    {post.author?.name || "Unknown User"}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    (@{post.author?.userName || "unknown"})
                  </span>
                </div>

                {/* Caption */}
                <div className="mb-4 text-gray-300">
                  <strong className="text-gray-200">Caption:</strong>{" "}
                  {post.caption || "(No caption provided)"}
                </div>

                {/* Media */}
                <div className="mb-6 max-w-xl mx-auto">
                  {post.mediaType === "image" ? (
                    <img
                      src={post.media}
                      alt="Post content"
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-700"
                    />
                  ) : (
                    <video
                      controls
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-700"
                    >
                      <source src={post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* Controls and Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-700/50">
                  <p className="text-base text-gray-400 font-medium">
                    ❤️ Likes: <span className="text-white font-semibold">{post.likes.length}</span>
                  </p>

                  <div className="flex gap-4">
                    {/* Like/Unlike Button */}
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`px-5 py-2 rounded-full text-white text-sm font-semibold transition duration-300 shadow-md 
                        ${
                          post.likes.includes(userData._id)
                            ? "bg-pink-600 hover:bg-pink-700" // Unlike style
                            : "bg-indigo-600 hover:bg-indigo-700" // Like style
                        }`}
                    >
                      {post.likes.includes(userData._id) ? "💔 Unlike" : "👍 Like"}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(post._id)}
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

export default AdminPostPanel;
