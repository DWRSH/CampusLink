// frontend/src/pages/Admin.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";

function Admin() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parsePayload = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.users && Array.isArray(payload.users)) return payload.users;
    return [];
  };

  const fetchUsers = async (useAuth = true) => {
    setError(null);
    try {
      setLoading(true);
      const url = useAuth
        ? `${serverUrl}/api/admin/all`
        : `${serverUrl}/api/admin/debug-all`;
      const config = useAuth ? { withCredentials: true } : {};

      const res = await axios.get(url, config);
      const list = parsePayload(res.data);
      setUsers(list);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthUsers = () => fetchUsers(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${serverUrl}/api/admin/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("delete error", err?.response?.status, err?.response?.data);
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    if (userData && userData.isAdmin) fetchAuthUsers();
  }, [userData]);

  if (!userData || !userData.isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-8">
        <div className="text-center text-red-400 p-6 border border-red-500 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">🚫 Access Denied</h2>
          <p className="text-lg">You must be an <strong>Admin</strong> to view this page.</p>
          <p className="mt-2 text-sm text-gray-400">
            If you are an admin but still see this, ensure your user record has
            <code className="bg-gray-700 p-1 rounded mx-1">
              isAdmin: true
            </code>
            in the DB.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white font-sans">
      {/* Header with navigation buttons */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-extrabold text-indigo-400">Admin Panel 🛠️</h1>

        <div className="flex gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium"
          >
            🏠 Admin Home
          </Link>
          <Link
            to="/admin/posts"
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-white text-sm font-medium"
          >
            📸 Post Control
          </Link>
          <Link
            to="/admin/loops"
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-white text-sm font-medium"
          >
            🔁 Loop Control
          </Link>
        </div>
      </header>

      {/* Control Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          onClick={fetchAuthUsers}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition duration-300 ease-in-out shadow-md"
        >
          Refresh Users (Auth)
        </button>

        {error && (
          <div className="text-red-400 p-2 bg-gray-800 rounded-md border border-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* User List */}
      {loading ? (
        <div className="text-xl text-indigo-400 mt-8">Loading users...</div>
      ) : (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-gray-400 p-4 border border-gray-700 rounded-lg">
              No users found. Try refreshing.
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                className="p-4 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-4 border-indigo-500"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-400 flex-shrink-0">
                    <img
                      src={u.profileImage || dp}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-white">
                      {u.name}
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        ({u.userName})
                      </span>
                      {u.isAdmin && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-green-500 rounded-full text-black">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-xs text-gray-400">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                  {u._id !== userData._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
