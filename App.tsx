
import React, { useState, useEffect } from 'react';
import { Settings, Activity, Database, Zap, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import ConfigPanel from './components/ConfigPanel';
import SyncDashboard from './components/SyncDashboard';
import PayloadTester from './components/PayloadTester';
import { SlingConfig, SyncLog, AirtablePayload } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'tester'>('dashboard');
  const [config, setConfig] = useState<SlingConfig>(() => {
    const saved = localStorage.getItem('sling_config');
    return saved ? JSON.parse(saved) : { apiKey: '', orgId: '' };
  });
  const [logs, setLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('sync_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sling_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('sync_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: Omit<SyncLog, 'id' | 'timestamp'>) => {
    const newLog: SyncLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-auto md:h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg">Sling Bridge</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tester')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'tester' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Sync Tester</span>
          </button>
          
          <button
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'config' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Status</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${config.apiKey ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
              <span className="text-sm font-medium">{config.apiKey ? 'Connected to Sling' : 'Missing API Key'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <SyncDashboard logs={logs} />}
          {activeTab === 'config' && <ConfigPanel config={config} setConfig={setConfig} />}
          {activeTab === 'tester' && <PayloadTester config={config} addLog={addLog} />}
        </div>
      </main>
    </div>
  );
};

export default App;
