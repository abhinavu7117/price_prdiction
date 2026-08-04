import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1731699317142-2333ff275326?w=1200&q=80" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E3F2A]/80" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="font-display font-black text-3xl">Grown with data.<br/>Sold with confidence.</div>
        </div>
      </div>
      <div className="flex items-center justify-center px-8 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-sm" data-testid="login-form">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-full bg-[#1E3F2A] text-[#E1B158] grid place-items-center"><Leaf size={17}/></div>
            <div className="font-display font-black text-xl">Cotton AI</div>
          </Link>
          <h1 className="font-display font-black text-3xl mb-2">Welcome back</h1>
          <p className="text-stone-600 text-sm mb-8">Sign in to your farmer or trader account.</p>

          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Email</label>
          <input data-testid="login-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
            className="w-full mb-5 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A]" />

          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Password</label>
          <input data-testid="login-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
            className="w-full mb-8 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A]" />

          <button data-testid="login-submit" disabled={loading}
            className="pill-btn w-full bg-[#1E3F2A] text-white hover:bg-[#2B5A3B] disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="mt-6 text-sm text-stone-600 text-center">
            New here? <Link to="/register" className="text-[#C25E3B] font-semibold">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
