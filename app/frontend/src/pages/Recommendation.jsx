import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function Recommendation() {
  const [mandis, setMandis] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [mandi, setMandi] = useState("rajkot");
  const [variety, setVariety] = useState("shankar6");
  const [data, setData] = useState(null);
  const [insight, setInsight] = useState("");
  const [loadingReco, setLoadingReco] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    api.get("/mandis").then((r) => setMandis(r.data));
    api.get("/varieties").then((r) => setVarieties(r.data));
    run("rajkot", "shankar6");
  }, []);

  const run = async (mid = mandi, vid = variety) => {
    setLoadingReco(true); setInsight("");
    try {
      const r = await api.post("/predict", { mandi_id: mid, variety_id: vid, horizon_days: 30 });
      setData(r.data);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    } finally { setLoadingReco(false); }
  };

  const askAi = async () => {
    if (!data) return;
    setLoadingAi(true);
    try {
      const r = await api.post("/insights", {
        mandi_id: mandi, variety_id: variety, forecast_summary: data,
      });
      setInsight(r.data.insight);
    } catch (e) {
      toast.error(e.response?.data?.detail || "AI insight failed");
    } finally { setLoadingAi(false); }
  };

  return (
    <div className="px-10 py-10 max-w-[1500px]" data-testid="reco-page">
      <div className="text-xs uppercase tracking-widest text-stone-500">Smart pricing</div>
      <h1 className="font-display font-black text-4xl mt-1 mb-8">Selling recommendation</h1>

      <div className="card-earth p-5 mb-8 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Mandi</label>
          <select data-testid="reco-mandi" value={mandi} onChange={(e)=>setMandi(e.target.value)}
            className="px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
            {mandis.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Variety</label>
          <select data-testid="reco-variety" value={variety} onChange={(e)=>setVariety(e.target.value)}
            className="px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
            {varieties.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <button data-testid="reco-recompute" onClick={()=>run()} disabled={loadingReco}
          className="pill-btn bg-[#1E3F2A] text-white hover:bg-[#2B5A3B] disabled:opacity-60">
          {loadingReco ? "Working…" : "Recompute"}
        </button>
      </div>

      {data && (
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 tracing-beam bg-white rounded-lg p-8 border border-stone-200" data-testid="reco-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-stone-500">AI Recommendation</div>
                <div className={`mt-3 font-display font-black text-6xl status-${data.trend.toLowerCase()}`}>{data.recommendation}</div>
                <div className={`mt-2 text-sm font-semibold status-${data.trend.toLowerCase()}`}>{data.trend} market · {data.confidence}% confidence</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest text-stone-500">Suggested selling</div>
                <div className="font-display font-black text-3xl mt-1 font-mono-num">
                  {inr(data.suggested_price_range.low)}<span className="text-stone-400"> – </span>{inr(data.suggested_price_range.high)}
                </div>
                <div className="text-xs text-stone-500 mt-1">per quintal</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Metric label="Current" value={inr(data.current_price)} />
              <Metric label={`Predicted (${data.horizon_days}d)`} value={inr(data.predicted_price)}
                trend={data.change_pct} />
              <Metric label="Rise probability" value={`${data.probability_rise}%`} accent="green" />
              <Metric label="Fall probability" value={`${data.probability_fall}%`} accent="red" />
            </div>
          </motion.div>

          <div className="card-earth bg-[#F5F3EA] border-[#E1D7B3] p-6" data-testid="ai-insights">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-[#1E3F2A] text-[#E1B158] grid place-items-center"><Sparkles size={16}/></div>
              <div className="font-display font-bold">AI market insight</div>
            </div>
            {!insight && (
              <>
                <p className="text-sm text-stone-600 mb-4">Get a plain-English explanation of what's driving this recommendation, powered by Claude Sonnet.</p>
                <button data-testid="ai-generate" onClick={askAi} disabled={loadingAi}
                  className="pill-btn w-full bg-[#1E3F2A] text-white hover:bg-[#2B5A3B] disabled:opacity-60">
                  {loadingAi ? "Analysing…" : "Generate insight"}
                </button>
              </>
            )}
            {insight && (
              <div className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap font-[IBM_Plex_Sans]" data-testid="ai-text">
                {insight}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, trend, accent }) {
  const cls = accent === "green" ? "text-[#2B7A4B]" : accent === "red" ? "text-[#C25E3B]" : "text-stone-900";
  const Icon = trend === undefined ? null : trend >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-stone-500">{label}</div>
      <div className={`mt-1.5 font-display font-black text-2xl font-mono-num ${cls} flex items-center gap-1`}>
        {value}{Icon && <Icon size={16} className={trend>=0 ? "text-[#2B7A4B]" : "text-[#C25E3B]"}/>}
      </div>
    </div>
  );
}
