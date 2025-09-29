import React, { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user or agent
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { name, email, password, role };
      const res = await api.post("/auth/signup", payload);
      // If your backend returns token & user:
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || { email }));
        // try to use context login to populate user state if available
        if (auth && auth.login) {
          try {
            await auth.login(email, password);
          } catch (_) {}
        }
        navigate("/");
      } else {
        // fallback: attempt to login
        if (auth && auth.login) {
          await auth.login(email, password);
          navigate("/");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Create an account</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

        <label className="block mb-2 text-sm">Full name</label>
        <input required value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 mb-3 border rounded" />

        <label className="block mb-2 text-sm">Email</label>
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 mb-3 border rounded" />

        <label className="block mb-2 text-sm">Password</label>
        <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 mb-3 border rounded" />

        <label className="block mb-2 text-sm">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full p-2 mb-4 border rounded">
          <option value="user">User / Buyer</option>
          <option value="agent">Agent / Owner</option>
        </select>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
