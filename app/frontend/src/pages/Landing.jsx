import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { ArrowRight, Leaf, TrendingUp, Brain } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1731699317142-2333ff275326?crop=entropy&cs=srgb&fm=jpg&w=2000&q=80";

export default function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user) nav("/dashboard"); }, [user, nav]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1C1917]">
      <header className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-[#1E3F2A] text-[#E1B158] grid place-items-center">
            <Leaf size={18} />
          </div>
          <div className="font-display font-black text-xl">Cotton<span className="text-[#C25E3B]"> AI</span></div>
        </div>
        <div className="flex gap-3">
          <Link to="/login" data-testid="landing-login-btn" className="pill-btn text-sm border border-stone-300 hover:border-stone-500">Sign in</Link>
          <Link to="/register" data-testid="landing-register-btn" className="pill-btn text-sm bg-[#1E3F2A] text-white hover:bg-[#2B5A3B]">Create account</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 pt-10 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="badge bg-[#E5E2DC] text-[#1E3F2A] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2B7A4B]" /> Random Forest + ARIMA + Claude
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            Sell your cotton <br />at the <span className="text-[#C25E3B]">right price.</span>
          </h1>
          <p className="mt-6 text-base text-stone-700 max-w-lg">
            AI-powered price forecasts, market trend probabilities, and plain-English selling advice —
            built for Indian mandis, farmers, and traders.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/register" data-testid="landing-cta" className="pill-btn bg-[#1E3F2A] text-white hover:bg-[#2B5A3B] flex items-center gap-2">
              Get started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="pill-btn border border-stone-400 hover:bg-stone-100">I have an account</Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, k: "Forecast", v: "30-day price outlook with confidence bands" },
              { icon: Brain, k: "Advisor", v: "Claude-powered market insights in plain English" },
              { icon: Leaf, k: "Mandis", v: "8 major cotton mandis · 5 varieties" },
            ].map((f, i) => (
              <div key={i} className="card-earth p-4">
                <f.icon size={18} className="text-[#1E3F2A]" />
                <div className="mt-3 font-display font-bold text-sm">{f.k}</div>
                <div className="text-xs text-stone-600 mt-1">{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <img src={HERO_IMG} alt="Cotton field" className="w-full h-full object-cover opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3F2A]/80 via-[#1E3F2A]/20 to-transparent" />
          </div>
          <div className="relative aspect-[4/5] p-8 flex flex-col justify-end">
            <div className="card-earth p-5 max-w-xs backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-stone-500">Predicted price · Rajkot</div>
              <div className="font-display font-black text-3xl mt-1 font-mono-num">₹7,312<span className="text-sm text-stone-500">/qtl</span></div>
              <div className="flex items-center gap-2 mt-1 text-[#2B7A4B] text-sm font-semibold"><TrendingUp size={14}/> +2.8% in 30 days</div>
              <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-600">Recommendation: <span className="text-[#B8892F] font-bold">HOLD</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
