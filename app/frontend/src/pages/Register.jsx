import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      nav("/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-[#F9F8F6] grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src="https://images.unsplash.com/photo-1731699317142-2333ff275326?w=1200&q=80" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#C25E3B]/70" />
      </div>
      <div className="flex items-center justify-center px-8 py-14">
        <form onSubmit={onSubmit} className="w-full max-w-sm" data-testid="register-form">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-full bg-[#1E3F2A] text-[#E1B158] grid place-items-center"><Leaf size={17}/></div>
            <div className="font-display font-black text-xl">Cotton AI</div>
          </Link>
          <h1 className="font-display font-black text-3xl mb-2">Create account</h1>
          <p className="text-stone-600 text-sm mb-6">Start pricing your cotton smarter.</p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {["farmer","trader"].map(r=>(
              <button type="button" key={r} data-testid={`role-${r}`}
                onClick={()=>setForm({...form, role: r})}
                className={`pill-btn text-sm border capitalize ${form.role===r ? "border-[#1E3F2A] bg-[#1E3F2A] text-white" : "border-stone-300 hover:border-stone-500"}`}>{r}</button>
            ))}
          </div>

          <input data-testid="register-name" placeholder="Full name" required value={form.name} onChange={set("name")}
            className="w-full mb-3 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A]" />
          <input data-testid="register-email" placeholder="Email" type="email" required value={form.email} onChange={set("email")}
            className="w-full mb-3 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A]" />
          <input data-testid="register-password" placeholder="Password (min 6 chars)" type="password" required minLength={6} value={form.password} onChange={set("password")}
            className="w-full mb-6 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A]" />

          <button data-testid="register-submit" disabled={loading}
            className="pill-btn w-full bg-[#C25E3B] text-white hover:bg-[#A94C2E] disabled:opacity-60">
            {loading ? "Creating…" : "Create account"}
          </button>
          <div className="mt-5 text-sm text-stone-600 text-center">
            Already have an account? <Link to="/login" className="text-[#1E3F2A] font-semibold">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
