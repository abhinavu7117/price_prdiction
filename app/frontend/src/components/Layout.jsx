import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, LineChart, Sparkles, History, LogOut, Leaf } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/predict", label: "Prediction", icon: LineChart, testid: "nav-predict" },
  { to: "/recommendation", label: "Recommendation", icon: Sparkles, testid: "nav-recommend" },
  { to: "/trends", label: "Historical Trends", icon: History, testid: "nav-trends" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#F9F8F6]">
      <aside className="w-64 shrink-0 bg-[#1E3F2A] text-white flex flex-col" data-testid="sidebar">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#E1B158] text-[#1E3F2A] grid place-items-center">
              <Leaf size={18} />
            </div>
            <div>
              <div className="font-display font-black text-lg leading-tight">Cotton AI</div>
              <div className="text-[10px] uppercase tracking-widest text-[#E1B158]">Market Intelligence</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} data-testid={n.testid}
              className={({ isActive }) => `sidebar-item flex items-center gap-3 px-6 py-3 text-sm ${isActive ? "active" : ""}`}>
              <n.icon size={17} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10">
          <div className="text-xs text-[#E5E2DC]/70 mb-2">Signed in as</div>
          <div className="text-sm font-semibold">{user?.name}</div>
          <div className="text-xs text-[#E1B158] capitalize mb-3">{user?.role}</div>
          <button data-testid="logout-btn" onClick={() => { logout(); nav("/"); }}
            className="pill-btn w-full text-sm border border-white/25 hover:bg-white/10 flex items-center justify-center gap-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
