import { useEffect, useState } from "react";
import api from "../lib/api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    api.get("/market/overview").then((r) => setOverview(r.data));
    // Quick snapshot for Rajkot / Shankar-6
    api.post("/predict", { mandi_id: "rajkot", variety_id: "shankar6", horizon_days: 30 })
      .then((r) => setSnapshot(r.data));
  }, []);

  return (
    <div className="px-10 py-10 max-w-[1500px]" data-testid="dashboard">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500">Market intelligence</div>
          <h1 className="font-display font-black text-4xl mt-1">Dashboard</h1>
        </div>
        <div className="text-xs text-stone-500">As of {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
      </div>

      {/* Key metrics */}
      <div className="grid md:grid-cols-4 gap-5 mb-10" data-testid="key-metrics">
        <MetricCard label="Current Price · Rajkot (Shankar-6)" value={snapshot ? inr(snapshot.current_price) : "—"} sub="per quintal" />
        <MetricCard label="30-day Forecast" value={snapshot ? inr(snapshot.predicted_price) : "—"}
          sub={snapshot ? `${snapshot.change_pct >= 0 ? "+" : ""}${snapshot.change_pct}% expected` : ""}
          trend={snapshot?.change_pct} />
        <MetricCard label="Confidence" value={snapshot ? `${snapshot.confidence}%` : "—"} sub="model certainty" />
        <MetricCard label="Rise probability" value={snapshot ? `${snapshot.probability_rise}%` : "—"} sub={`fall ${snapshot?.probability_fall ?? "—"}%`} />
      </div>

      {/* Recommendation preview */}
      {snapshot && (
        <div className="card-earth p-8 mb-10" data-testid="reco-preview">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500">AI Recommendation</div>
              <div className="mt-3 flex items-center gap-4">
                <RecoBadge value={snapshot.recommendation} />
                <div className={`font-display font-bold status-${snapshot.trend.toLowerCase()}`}>{snapshot.trend}</div>
              </div>
              <div className="mt-4 text-stone-600 text-sm max-w-lg">
                Suggested selling range: <span className="font-mono-num font-semibold text-stone-900">{inr(snapshot.suggested_price_range.low)} – {inr(snapshot.suggested_price_range.high)}</span> /qtl
              </div>
            </div>
            <Link to="/recommendation" data-testid="open-reco"
              className="pill-btn bg-[#1E3F2A] text-white hover:bg-[#2B5A3B]">Open full recommendation →</Link>
          </div>
        </div>
      )}

      {/* Market table */}
      <div className="card-earth" data-testid="market-table">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl">Mandi comparison</h2>
            <div className="text-xs text-stone-500 mt-1">Latest Shankar-6 price · 7-day change</div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-stone-500">
              <th className="text-left px-6 py-3 font-semibold">Mandi</th>
              <th className="text-left px-6 py-3 font-semibold">State</th>
              <th className="text-right px-6 py-3 font-semibold">Price (₹/qtl)</th>
              <th className="text-right px-6 py-3 font-semibold">7d change</th>
            </tr>
          </thead>
          <tbody>
            {overview?.mandis.map((m) => (
              <tr key={m.mandi_id} className="border-t border-stone-100 hover:bg-stone-50/70">
                <td className="px-6 py-3.5 font-semibold">{m.mandi}</td>
                <td className="px-6 py-3.5 text-stone-600">{m.state}</td>
                <td className="px-6 py-3.5 text-right font-mono-num">{inr(m.price)}</td>
                <td className={`px-6 py-3.5 text-right font-mono-num font-semibold ${m.change_pct_7d>=0 ? "text-[#2B7A4B]" : "text-[#C25E3B]"}`}>
                  {m.change_pct_7d>=0 ? "+" : ""}{m.change_pct_7d}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, trend }) {
  const Icon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  return (
    <div className="card-earth p-5">
      <div className="text-xs uppercase tracking-widest text-stone-500">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display font-black text-3xl font-mono-num">{value}</div>
      </div>
      <div className={`mt-2 text-xs flex items-center gap-1 ${trend > 0 ? "text-[#2B7A4B]" : trend < 0 ? "text-[#C25E3B]" : "text-stone-500"}`}>
        {Icon && <Icon size={13} />} {sub}
      </div>
    </div>
  );
}

function RecoBadge({ value }) {
  const map = {
    HOLD: "bg-[#FCF3D9] text-[#8A6416] border-[#E1B158]",
    SELL: "bg-[#FBEBE3] text-[#8A3B1F] border-[#C25E3B]",
    WAIT: "bg-[#FCF3D9] text-[#8A6416] border-[#E1B158]",
    BUY:  "bg-[#DBEEDF] text-[#1E3F2A] border-[#2B7A4B]",
  };
  return (
    <span className={`badge border ${map[value] || map.HOLD}`} data-testid={`reco-badge-${value}`}>
      {value}
    </span>
  );
}
