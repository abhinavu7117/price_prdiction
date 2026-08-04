import { useEffect, useState } from "react";
import api from "../lib/api";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function HistoricalTrends() {
  const [mandis, setMandis] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [mandi, setMandi] = useState("rajkot");
  const [variety, setVariety] = useState("shankar6");
  const [days, setDays] = useState(365);
  const [series, setSeries] = useState([]);
  const [showRain, setShowRain] = useState(false);
  const [showYield, setShowYield] = useState(false);

  useEffect(() => {
    api.get("/mandis").then((r)=>setMandis(r.data));
    api.get("/varieties").then((r)=>setVarieties(r.data));
  }, []);

  useEffect(() => {
    api.get("/prices/historical", { params: { mandi_id: mandi, variety_id: variety, days } })
      .then((r) => setSeries(r.data.series));
  }, [mandi, variety, days]);

  const stats = series.length ? {
    min: Math.min(...series.map(s=>s.price)),
    max: Math.max(...series.map(s=>s.price)),
    avg: series.reduce((a,b)=>a+b.price,0)/series.length,
  } : null;

  return (
    <div className="px-10 py-10 max-w-[1500px]" data-testid="trends-page">
      <div className="text-xs uppercase tracking-widest text-stone-500">Historical</div>
      <h1 className="font-display font-black text-4xl mt-1 mb-8">Price trends</h1>

      <div className="card-earth p-5 mb-8 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Mandi</label>
          <select data-testid="trend-mandi" value={mandi} onChange={(e)=>setMandi(e.target.value)}
            className="px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
            {mandis.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Variety</label>
          <select data-testid="trend-variety" value={variety} onChange={(e)=>setVariety(e.target.value)}
            className="px-3 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-[#1E3F2A] bg-white">
            {varieties.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Range</label>
          <div className="flex gap-2">
            {[90, 180, 365, 730].map(d => (
              <button key={d} data-testid={`range-${d}`} onClick={()=>setDays(d)}
                className={`pill-btn text-sm border ${days===d ? "bg-[#1E3F2A] border-[#1E3F2A] text-white" : "border-stone-300"}`}>
                {d===730 ? "2y" : d===365 ? "1y" : `${d}d`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input data-testid="toggle-rain" type="checkbox" checked={showRain} onChange={(e)=>setShowRain(e.target.checked)} /> Rainfall
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input data-testid="toggle-yield" type="checkbox" checked={showYield} onChange={(e)=>setShowYield(e.target.checked)} /> Yield
          </label>
        </div>
      </div>

      {stats && (
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <Stat label="Minimum" value={inr(stats.min)} />
          <Stat label="Average" value={inr(stats.avg)} />
          <Stat label="Maximum" value={inr(stats.max)} />
        </div>
      )}

      <div className="card-earth p-6" data-testid="history-chart">
        <div style={{ width: "100%", height: 440 }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={45} />
              <YAxis yAxisId="left" domain={["auto","auto"]} tickFormatter={(v)=>`₹${Math.round(v/100)*100}`} />
              {(showRain || showYield) && <YAxis yAxisId="right" orientation="right" />}
              <Tooltip />
              <Legend />
              <Line yAxisId="left" name="Price" type="monotone" dataKey="price" stroke="#1E3F2A" strokeWidth={2} dot={false} />
              {showRain && <Line yAxisId="right" name="Rainfall (mm)" type="monotone" dataKey="rainfall_mm" stroke="#4A83B4" strokeWidth={1.6} dot={false} />}
              {showYield && <Line yAxisId="right" name="Yield (q/ha)" type="monotone" dataKey="yield_q_per_ha" stroke="#C25E3B" strokeWidth={1.6} dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
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
