import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, RefreshCw, Server, Database, BarChart3, Sliders, Cpu, User, CreditCard } from 'lucide-react';

export default function App() {
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
    { name: 'Logistic Regression', accuracy: '81.2%', auc: '0.865', status: 'Baseline' },
    { name: 'Random Forest', accuracy: '88.7%', auc: '0.949', status: 'Candidate' },
    { name: 'Gradient Boosting', accuracy: '90.4%', auc: '0.957', status: 'Champion' },
  ];

  const globalFeatureImportance = [
    { feature: 'Support Tickets', weight: 45, color: 'bg-rose-500' },
    { feature: 'Contract Type / Tenure Months', weight: 30, color: 'bg-amber-500' },
    { feature: 'Monthly Financial Charges', weight: 25, color: 'bg-cyan-500' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['tenure_months', 'support_tickets'].includes(name) ? value : value
    }));
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
        body: JSON.stringify({ customer_id: formData.customer_id }), // Only passing ID to lookup in DB
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Inference error.');
      }
      
      const data = await response.json();
      
      // Update form inputs to show what was stored in the Database dynamically!
      setFormData(data.customer_profile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not connect to database pipeline.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Cpu className="text-cyan-400 w-8 h-8 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider uppercase text-slate-200">
            Customer Intelligence & <span className="text-cyan-400">Churn Prediction</span> System
          </h1>
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-emerald-400"/> PostgreSQL Cluster</span>
          <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-cyan-400"/> FastAPI Live</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Core Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-300">Pipeline Configuration</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Customer ID</label>
                  <input type="text" name="customer_id" value={formData.customer_id} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-300 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Model Driver</label>
                  <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-cyan-400 font-mono text-xs focus:outline-none">
                    <option value="Logistic Regression">Logistic Regression (Linear)</option>
                    <option value="Random Forest">Random Forest (Ensemble)</option>
                    <option value="Gradient Boosting">Gradient Boosting (Champion)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Demographics Profile
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Senior Citizen?</label>
                  <select name="senior_citizen" value={formData.senior_citizen} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Has Partner?</label>
                  <select name="partner" value={formData.partner} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Has Dependents?</label>
                  <select name="dependents" value={formData.dependents} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account & Billing */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Account & Billing Status
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Internet Service Pipeline</label>
                  <select name="internet_service" value={formData.internet_service} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="Fiber Optic">Fiber Optic Infrastructure</option>
                    <option value="DSL">DSL Infrastructure</option>
                    <option value="No">No Active Subscribed Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Payment Method</label>
                  <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="Mailed check">Mailed check</option>
                    <option value="Electronic check">Electronic check</option>
                    <option value="Bank transfer">Bank transfer (automated)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Paperless Billing?</label>
                  <select name="paperless_billing" value={formData.paperless_billing} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tenure (Months)</label>
                  <input type="number" name="tenure_months" value={formData.tenure_months} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Active Open Support Tickets</label>
                  <input type="number" name="support_tickets" value={formData.support_tickets} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Monthly Charges ($)</label>
                  <input type="number" name="monthly_charges" value={formData.monthly_charges} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Total Charges ($)</label>
                  <input type="number" name="total_charges" value={formData.total_charges} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 transition font-bold text-xs text-slate-950 py-3 rounded-md shadow-lg flex items-center justify-center gap-2 mt-2">
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Predictive Pipeline Engine'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Output Analytics */}
        <div className="lg:col-span-6 space-y-6">
          {error && <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-rose-300 text-xs font-mono">{error}</div>}

          {/* Core Response Metric Cards */}
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800 pb-2">Prediction Engine Telemetry</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Risk Assessment Status</span>
                  <span className={`text-sm font-black ${result.customer_analytics.risk_status === 'HIGH RISK' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {result.customer_analytics.risk_status}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Churn Probability</span>
                  <span className="text-sm font-black text-slate-100">{result.customer_analytics.churn_probability}%</span>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800/50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-cyan-400 mb-1">Prescriptive Engagement Assignment:</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-mono">{result.prescriptive_action.execution_details}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
              Submit left attributes to fire core model inference arrays.
            </div>
          )}

          {/* Explainable AI Graph Layer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Explainable AI (XAI) Feature Importance Matrix</h2>
            </div>
            <div className="space-y-3">
              {globalFeatureImportance.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-0.5">
                    <span>{item.feature}</span>
                    <span className="text-cyan-400 font-semibold">{item.weight}% weight</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.weight}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Comparisons Pipelines */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <table className="w-full text-left text-[11px] font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Model Variant</th>
                  <th className="pb-2">Accuracy</th>
                  <th className="pb-2 text-right">Deployment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {modelBenchmarks.map((model, idx) => (
                  <tr key={idx} className={selectedModel === model.name ? "text-cyan-400 font-bold" : ""}>
                    <td className="py-2">{model.name}</td>
                    <td className="py-2">{model.accuracy}</td>
                    <td className="py-2 text-right">
                      <span className="text-[10px] opacity-80">{model.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}