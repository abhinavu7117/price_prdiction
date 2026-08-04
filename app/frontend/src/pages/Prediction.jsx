import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Legend
} from "recharts";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function Prediction() {
  const [mandis, setMandis] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [mandi, setMandi] = useState("rajkot");
  const [variety, setVariety] = useState("shankar6");
  const [horizon, setHorizon] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/mandis").then((r) => setMandis(r.data));
    api.get("/varieties").then((r) => setVarieties(r.data));
  }, []);

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const run = async () => {
    setLoading(true);
    try {
      const r = await api.post("/predict", { mandi_id: mandi, variety_id: variety, horizon_days: horizon });
      setData(r.data);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Prediction failed");
    } finally { setLoading(false); }
  };

  const chartData = data ? [
    ...data.history.map(h => ({ date: h.date, price: h.price, kind: "hist" })),
    ...data.forecast.map(f => ({ date: f.date, forecast: f.price, lower: f.lower, upper: f.upper, kind: "fut" }))
  ] : [];

  const forkDate = data?.history?.[data.history.length - 1]?.date;

  return (
    <div className="px-10 py-10 max-w-[1500px]" data-testid="predict-page">
      <div className="text-xs uppercase tracking-widest text-stone-500">Prediction</div>
      <h1 className="font-display font-black text-4xl mt-1 mb-8">Price forecast</h1>

      <div className="card-earth p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Mandi</label>
            <select data-testid="mandi-select" value={mandi} onChange={(e)=>setMandi(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
              {mandis.map(m => <option key={m.id} value={m.id}>{m.name} · {m.state}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Variety</label>
            <select data-testid="variety-select" value={variety} onChange={(e)=>setVariety(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
              {varieties.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Horizon</label>
            <div className="flex gap-2">
              {[7, 30, 90].map(h => (
                <button key={h} data-testid={`horizon-${h}`} onClick={()=>setHorizon(h)}
                  className={`pill-btn text-sm border ${horizon===h ? "bg-[#1E3F2A] border-[#1E3F2A] text-white" : "border-stone-300 hover:border-stone-500"}`}>{h}d</button>
              ))}
            </div>
          </div>
          <button data-testid="predict-btn" disabled={loading} onClick={run}
            className="pill-btn bg-[#C25E3B] text-white hover:bg-[#A94C2E] disabled:opacity-60">
            {loading ? "Predicting…" : "Run forecast"}
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid md:grid-cols-4 gap-5 mb-8" data-testid="predict-metrics">
            <Stat label="Current price" value={inr(data.current_price)} />
            <Stat label={`Predicted (${data.horizon_days}d)`} value={inr(data.predicted_price)} />
            <Stat label="Expected range" value={`${inr(data.expected_range.low)} – ${inr(data.expected_range.high)}`} />
            <Stat label="Confidence" value={`${data.confidence}%`} />
          </div>

          <div className="card-earth p-6 mb-8" data-testid="forecast-chart">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">Price forecast · with confidence band</h2>
              <div className="flex gap-4 text-xs text-stone-600">
                <span className="flex items-center gap-1.5"><span className="h-2 w-4 bg-[#1E3F2A] rounded-sm"/>Historical</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-4 bg-[#C25E3B] rounded-sm"/>Forecast</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-4 bg-[#C25E3B]/25 rounded-sm"/>Range</span>
              </div>
            </div>
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C25E3B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#C25E3B" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" minTickGap={40} />
                  <YAxis domain={["auto","auto"]} tickFormatter={(v)=>`₹${Math.round(v/100)*100}`} />
                  <Tooltip formatter={(v)=>inr(v)} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandFill)" activeDot={false}/>
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#F9F8F6" activeDot={false}/>
                  <Line type="monotone" dataKey="price" stroke="#1E3F2A" strokeWidth={2.4} dot={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#C25E3B" strokeWidth={2.4} strokeDasharray="5 4" dot={false} />
                  {forkDate && <ReferenceLine x={forkDate} stroke="#B8892F" strokeDasharray="4 4" label={{ value: "Today", position: "top", fill: "#B8892F", fontSize: 11 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-earth p-6">
            <h2 className="font-display font-bold text-xl mb-4">Model drivers · feature importance</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(data.feature_importance)
                .sort((a,b)=>b[1]-a[1])
                .map(([k,v])=>(
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-40 text-xs text-stone-600">{k}</div>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E3F2A]" style={{ width: `${Math.min(100, v*300)}%` }} />
                    </div>
                    <div className="w-14 text-right text-xs font-mono-num text-stone-700">{(v*100).toFixed(1)}%</div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card-earth p-5">
      <div className="text-xs uppercase tracking-widest text-stone-500">{label}</div>
      <div className="mt-2 font-display font-black text-2xl font-mono-num">{value}</div>
    </div>
  );
}
