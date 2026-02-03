
import React from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { SyncLog } from '../types';

interface Props {
  logs: SyncLog[];
}

const SyncDashboard: React.FC<Props> = ({ logs }) => {
  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Overview</h1>
          <p className="text-slate-500">Real-time status of your Airtable to Sling synchronization.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Syncs</p>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Successful</p>
          <p className="text-3xl font-bold text-green-600">{stats.success}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Failed</p>
          <p className="text-3xl font-bold text-red-600">{stats.error}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Recent Activity</h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium">Last 50 events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Airtable ID</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No activity recorded yet. Use the Sync Tester to initiate a sync.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Success
                        </span>
                      ) : log.status === 'error' ? (
                        <span className="flex items-center text-red-600 text-sm font-medium">
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Error
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600 text-sm font-medium">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{log.recordId}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{log.message}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SyncDashboard;
