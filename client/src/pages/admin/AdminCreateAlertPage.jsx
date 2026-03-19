import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { createAdminAlert } from '../../services/adminService';

const AdminCreateAlertPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async () => {
    if (!title || !message) {
      alert("Please fill in title and message.");
      return;
    }
    setLoading(true);
    try {
      await createAdminAlert({ title, message, severity });
      alert("Alert broadcast successfully!");
      setTitle('');
      setMessage('');
      setSeverity('medium');
    } catch (e) {
      alert("Failed to broadcast alert: " + (e.error || e.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Alert</h1>
        <p className="text-sm text-gray-500 mt-1">Broadcast an emergency notification to users.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-900">Alert Title</label>
          <input 
            type="text" 
            placeholder="e.g. Flash Flood Warning" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-900">Message</label>
          <textarea 
            rows={4}
            placeholder="Detailed description of the alert and instructions..." 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Severity Level</label>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="severity" value="low" className="peer sr-only" checked={severity === 'low'} onChange={() => setSeverity('low')} />
              <div className="text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-600 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 transition-all font-medium">
                Low
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="severity" value="medium" className="peer sr-only" checked={severity === 'medium'} onChange={() => setSeverity('medium')} />
              <div className="text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-600 peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700 transition-all font-medium">
                Medium
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="severity" value="high" className="peer sr-only" checked={severity === 'high'} onChange={() => setSeverity('high')} />
              <div className="text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-600 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 transition-all font-medium">
                High
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-gray-100">
           <Button variant="danger" size="lg" fullWidth onClick={handleBroadcast} disabled={loading}>
             {loading ? 'Broadcasting...' : 'Broadcast Alert'}
           </Button>
        </div>

      </div>
    </div>
  );
};

export default AdminCreateAlertPage;
