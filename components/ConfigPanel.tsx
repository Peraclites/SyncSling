
import React from 'react';
import { Save, ShieldCheck, Key, Hash, HelpCircle, AlertCircle } from 'lucide-react';
import { SlingConfig } from '../types';

interface Props {
  config: SlingConfig;
  setConfig: (config: SlingConfig) => void;
}

const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Connection Settings</h1>
          <p className="text-slate-500">Configure your Sling API credentials to start syncing.</p>
        </div>
        <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>AES-256 Local Storage Encryption</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Key className="w-4 h-4 mr-2 text-slate-400" />
                Sling API Key
              </label>
              <input
                type="password"
                name="apiKey"
                value={config.apiKey}
                onChange={handleChange}
                placeholder="Enter your Sling API token"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
              <p className="mt-2 text-xs text-slate-400 flex items-center">
                <HelpCircle className="w-3 h-3 mr-1" />
                Found in Sling &gt; Settings &gt; API
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Hash className="w-4 h-4 mr-2 text-slate-400" />
                Organization ID
              </label>
              <input
                type="text"
                name="orgId"
                value={config.orgId}
                onChange={handleChange}
                placeholder="e.g. 12345"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="pt-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start space-x-3 text-amber-800">
                {/* Added missing AlertCircle import from lucide-react */}
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Security Note</p>
                  <p>Credentials are stored only in your browser's local storage. Ensure you are on a private device when configuring this bridge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Airtable Webhook Setup</h2>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              To use this bridge, use the following URL as your <code>webAppUrl</code> in your Airtable script:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 break-all select-all">
              {window.location.origin}/api/webhook?bridge_key={config.apiKey ? 'READY' : 'CONFIGURE_API_KEY_FIRST'}
            </div>
            <p className="text-xs text-slate-400 italic">
              Note: For high-volume production, you might need a middleware like Pipedream or Make.com if this browser window is closed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
