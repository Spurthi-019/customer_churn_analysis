import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle, RefreshCw, Server, Database, 
  BarChart3, Sliders, Cpu, LayoutDashboard, DatabaseZap, 
  UserCheck, TrendingUp, Search, Layers
} from 'lucide-react';

export default function App() {
  // Current Navigation Tab State
  const [activeTab, setActiveTab] = useState('overview');
  
  const [formData, setFormData] = useState({
    customer_id: '1087',
    gender: 'Female',
    senior_citizen: 'No',
    partner: 'Yes',
    dependents: 'No',
    tenure_months: 60,
    internet_service: 'Fiber Optic',
    payment_method: 'Mailed check',
    paperless_billing: 'No',
    monthly_charges: 150.00,
    total_charges: 1500.00,
    support_tickets: 3
  });

  const [selectedModel, setSelectedModel] = useState('Gradient Boosting');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const modelBenchmarks = [
    { name: 'Logistic Regression', type: 'Linear Estimator', accuracy: '81.2%', auc: '0.865', status: 'Baseline' },
    { name: 'Random Forest', type: 'Ensemble Bagging', accuracy: '88.7%', auc: '0.949', status: 'Candidate' },
    { name: 'Gradient Boosting', type: 'Ensemble Boosting', accuracy: '90.4%', auc: '0.957', status: 'Production Active' },
  ];

  const globalFeatureImportance = [
    { feature: 'Support Tickets Count', weight: 45, color: 'bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.3)]' },
    { feature: 'Contract Structure & Tenure', weight: 30, color: 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]' },
    { feature: 'Monthly Accumulative Charges', weight: 25, color: 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: formData.customer_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Inference engine pipeline error.');
      }
      
      const data = await response.json();
      setFormData(data.customer_profile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Database pipeline connection fault.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* 1. PROFESSIONAL ENTERPRISE SIDEBAR */}
      <aside className="w-64 bg-[#090d16] border-r border-slate-900 flex flex-col shrink-0 justify-between">
        <div>
          {/* Brand Core Header */}
          <div className="p-6 border-b border-slate-950 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg shadow-lg">
              <Cpu className="text-slate-950 w-5 h-5 font-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide uppercase text-slate-200">Churn<span className="text-cyan-400">Insight</span></h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Enterprise v1.0.4</p>
            </div>
          </div>

          {/* Navigation Matrix links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-600 tracking-widest mb-2">Operational Hub</p>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${activeTab === 'overview' ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border-l-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Account Risk Assessment
            </button>
            <button 
              onClick={() => setActiveTab('models')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${activeTab === 'models' ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border-l-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`}
            >
              <Layers className="w-4 h-4" /> Pipeline Architecture Matrix
            </button>
          </nav>
        </div>

        {/* System Node Telemetry Bottom Status Check */}
        <div className="p-4 border-t border-slate-950 bg-[#060910] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><DatabaseZap className="w-3.5 h-3.5 text-emerald-400"/> PostgreSQL Node</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-cyan-400"/> FastAPI Worker</span>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          </div>
        </div>
      </aside>

      {/* 2. DYNAMIC MAIN VIEWPORT WINDOW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Global Control Bar */}
        <header className="h-16 border-b border-slate-900 bg-[#040812]/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 w-96">
            <Search className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium">PostgreSQL Indexed Global Real-Time Search Active</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">Model Active: {selectedModel}</span>
          </div>
        </header>

        {/* Viewport Content Node */}
        <main className="p-8 max-w-6xl w-full mx-auto space-y-8 flex-1">
          
          {/* TAB 1: OPERATIONAL ACCOUNT OVERVIEW ROUTE */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Segment Controls (ID Selection & Dropdown Block) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#090d16] border border-slate-900 rounded-xl p-5 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Inference Router</h2>
                  </div>
                  
                  <form onSubmit={handlePredict} className="space-y-4">
                    {/* Active Pipeline Dropdown */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Active Pipeline Model Framework</label>
                      <select 
                        value={selectedModel} 
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all cursor-pointer"
                      >
                        <option value="Logistic Regression">Logistic Regression (Linear)</option>
                        <option value="Random Forest">Random Forest (Ensemble)</option>
                        <option value="Gradient Boosting">Gradient Boosting (Champion)</option>
                      </select>
                    </div>

                    {/* Customer ID DB Search Input */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Target Customer ID (DB Index Key)</label>
                      <input 
                        type="text" 
                        name="customer_id" 
                        value={formData.customer_id} 
                        onChange={handleInputChange} 
                        className="w-full bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all" 
                      />
                      <span className="block text-[10px] text-slate-500 font-medium mt-1">Available query seed identifiers: <strong className="text-slate-400">1087</strong>, <strong className="text-slate-400">2441</strong>, <strong className="text-slate-400">9932</strong></span>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 transition font-bold text-xs text-slate-950 py-2.5 rounded-lg shadow-xl shadow-cyan-500/5 flex items-center justify-center gap-2">
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Query Database & Run Pipeline'}
                    </button>
                  </form>
                </div>

                {/* Account Context Attribute Visual Grid */}
                <div className="bg-[#090d16] border border-slate-900 rounded-xl p-5 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">SQL Row Attributes Cache</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Gender</span><span className="font-semibold text-slate-300">{formData.gender}</span></div>
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Senior Citizen</span><span className="font-semibold text-slate-300">{formData.senior_citizen}</span></div>
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Has Partner</span><span className="font-semibold text-slate-300">{formData.partner}</span></div>
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Dependents</span><span className="font-semibold text-slate-300">{formData.dependents}</span></div>
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg col-span-2"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Internet Architecture</span><span className="font-semibold text-slate-300">{formData.internet_service}</span></div>
                    <div className="bg-[#040812] border border-slate-950 p-2.5 rounded-lg col-span-2"><span className="block text-[9px] text-slate-500 uppercase font-bold mb-0.5">Billing Mechanics</span><span className="font-semibold text-slate-300">{formData.payment_method} (Paperless: {formData.paperless_billing})</span></div>
                  </div>
                </div>
              </div>

              {/* Right Segment Controls (Model Telemetry Core Outputs) */}
              <div className="lg:col-span-8 space-y-6">
                {error && <div className="bg-rose-950/20 border border-rose-900/60 p-4 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">⚠️ {error}</div>}

                {/* Core Live Telemetry Dashboard Output Panel */}
                {result ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* KPI Container 1 */}
                      <div className="bg-[#090d16] border border-slate-900 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Risk Profile Status</span>
                        <div className={`text-xl font-black ${result.customer_analytics.risk_status === 'HIGH RISK' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {result.customer_analytics.risk_status}
                        </div>
                        <span className={`absolute top-4 right-4 p-1 rounded-full ${result.customer_analytics.risk_status === 'HIGH RISK' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {result.customer_analytics.risk_status === 'HIGH RISK' ? <ShieldAlert className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                        </span>
                      </div>
                      {/* KPI Container 2 */}
                      <div className="bg-[#090d16] border border-slate-900 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Calculated Probability</span>
                        <div className="text-xl font-black text-slate-100 font-mono">{result.customer_analytics.churn_probability}%</div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-900/60">
                          <div className={`h-full ${result.customer_analytics.risk_status === 'HIGH RISK' ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`} style={{ width: `${result.customer_analytics.churn_probability}%` }}></div>
                        </div>
                      </div>
                      {/* KPI Container 3 */}
                      <div className="bg-[#090d16] border border-slate-900 rounded-xl p-5 shadow-2xl">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Account Active Complaints</span>
                        <div className="text-xl font-black text-slate-100 font-mono">{formData.support_tickets} <span className="text-xs text-slate-500 font-medium font-sans">Open Tickets</span></div>
                      </div>
                    </div>

                    {/* Prescriptive Strategic Action Card */}
                    <div className="bg-gradient-to-r from-[#0d1527] to-[#090d16] border border-cyan-500/20 rounded-xl p-6 shadow-2xl space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Prescriptive Retention Mandate</h4>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-200 underline decoration-cyan-500/40 underline-offset-4 mb-1">{result.prescriptive_action.recommended_strategy}</h5>
                        <p className="text-slate-400 text-xs font-mono leading-relaxed">{result.prescriptive_action.execution_details}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#090d16]/40 border border-dashed border-slate-900 rounded-xl p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                    <DatabaseZap className="w-6 h-6 text-slate-700 animate-bounce" />
                    <span>Awaiting data stream instruction. Submit a valid Customer ID database index key.</span>
                  </div>
                )}

                {/* Feature Importance Graphs Container Layer */}
                <div className="bg-[#090d16] border border-slate-900 rounded-xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Explainable AI (XAI) Model Feature Vector Weighting</h2>
                  </div>
                  <div className="space-y-4">
                    {globalFeatureImportance.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-300">
                          <span className="font-mono">{item.feature}</span>
                          <span className="text-cyan-400 font-bold font-mono">{item.weight}%</span>
                        </div>
                        <div className="w-full bg-[#020617] h-2.5 rounded-full overflow-hidden border border-slate-900/60">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.weight}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PIPELINE ARCHITECTURE COMPARISONS MAP */}
          {activeTab === 'models' && (
            <div className="bg-[#090d16] border border-slate-900 rounded-xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-4">
                <Layers className="w-4 h-4 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Cross-Model Deployment Benchmarks</h2>
                  <p className="text-xs text-slate-500 font-medium">Evaluation metrics pulled across historical cross-validation splits.</p>
                </div>
              </div>

              <div className="overflow-hidden border border-slate-950 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#040812] text-slate-400 border-b border-slate-950">
                      <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Model Variant Architecture</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Framework Classification Type</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Validation Accuracy</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[10px]">ROC AUC Statistic Target</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Deployment Phase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-950 text-slate-300">
                    {modelBenchmarks.map((model, idx) => (
                      <tr key={idx} className={`transition-all ${selectedModel === model.name ? 'bg-cyan-950/10 text-cyan-400' : 'hover:bg-slate-900/30'}`}>
                        <td className="p-4 font-bold">{model.name}</td>
                        <td className="p-4 text-slate-400">{model.type}</td>
                        <td className="p-4">{model.accuracy}</td>
                        <td className="p-4 font-bold text-slate-200">{model.auc}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${idx === 2 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>
                            {model.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}