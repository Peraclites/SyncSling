
import React, { useState } from 'react';
import { Play, Code, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { AirtablePayload, SlingConfig, SyncLog } from '../types';
import { createSlingShift } from '../services/slingService';

interface Props {
  config: SlingConfig;
  addLog: (log: Omit<SyncLog, 'id' | 'timestamp'>) => void;
}

const PayloadTester: React.FC<Props> = ({ config, addLog }) => {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify({
      recordId: "recX123456789",
      date: "2023-12-25",
      start: "09:00",
      end: "17:00",
      locationId: ["LOC_123"],
      positionId: ["POS_456"],
      employeeId: ["EMP_789"],
      notes: "Auto-generated from Tester",
      summary: "Sample Shift"
    }, null, 2)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleRunTest = async () => {
    if (!config.apiKey || !config.orgId) {
      setTestResult({ success: false, msg: "Please configure Sling API key and Org ID first." });
      return;
    }

    setIsProcessing(true);
    setTestResult(null);

    try {
      const payload: AirtablePayload = JSON.parse(jsonInput);
      
      const response = await createSlingShift(config, payload);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setTestResult({ success: true, msg: `Successfully created Sling Shift ID: ${response.id || 'N/A'}` });
      addLog({
        recordId: payload.recordId,
        status: 'success',
        message: 'Manual sync successful',
        payload,
        response
      });
    } catch (err: any) {
      setTestResult({ success: false, msg: err.message || "Failed to parse JSON or connect to Sling." });
      try {
        const payload = JSON.parse(jsonInput);
        addLog({
          recordId: payload.recordId || 'Unknown',
          status: 'error',
          message: err.message,
          payload
        });
      } catch {
        // Just log the error if JSON is invalid
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sync Tester</h1>
          <p className="text-slate-500">Paste the payload from your Airtable Automation script to test the connection.</p>
        </div>
        <button
          onClick={handleRunTest}
          disabled={isProcessing}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200/50 ${
            isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>{isProcessing ? 'Processing...' : 'Run Sync Test'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payload Editor (JSON)</span>
              </div>
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
              className="w-full h-[400px] bg-transparent text-indigo-300 font-mono text-sm p-6 outline-none focus:ring-0 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Play className="w-4 h-4 mr-2 text-indigo-600" />
              Live Execution
            </h3>
            
            {testResult ? (
              <div className={`p-4 rounded-xl border ${testResult.success ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                <div className="flex items-start space-x-3">
                  {testResult.success ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                  <div>
                    <p className="font-bold text-sm">{testResult.success ? 'Success!' : 'Execution Failed'}</p>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{testResult.msg}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-sm text-slate-400">Click the button above to run the payload against Sling API.</p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions</h4>
              <ol className="text-xs text-slate-500 space-y-3 list-decimal list-inside leading-relaxed">
                <li>Copy the payload from your Airtable Automation console logs.</li>
                <li>Paste it into the editor on the left.</li>
                <li>Ensure your API Key is set in Settings.</li>
                <li>Verify your <code>locationId</code> and <code>employeeId</code> exist in Sling.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadTester;
