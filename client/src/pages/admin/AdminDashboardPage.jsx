import React, { useState, useEffect } from 'react';
import { getAllDisasters } from '../../services/disasterService';

const AdminDashboardPage = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getAllDisasters()
      .then(data => setDisasters(data))
      .catch(err => console.error('Failed to fetch disasters:', err))
      .finally(() => setLoading(false));
  }, []);

  const total   = disasters.length;
  const active  = disasters.filter(d => d.status === 'Active').length;
  const solved  = disasters.filter(d => d.status === 'Solved').length;
  const falsed  = disasters.filter(d => d.status === 'False').length;
  const unverified = disasters.filter(d => d.status === 'Unverified').length;

  const summaryData = [
    { label: 'Total Reports',    value: loading ? '—' : String(total), icon: '🌍', color: 'bg-blue-50 text-blue-700' },
    { label: 'Unverified',       value: loading ? '—' : String(unverified), icon: '⏳', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Active Disasters', value: loading ? '—' : String(active), icon: '🚨', color: 'bg-red-50 text-red-700' },
    { label: 'Resolved',         value: loading ? '—' : String(solved), icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'False Reports',    value: loading ? '—' : String(falsed), icon: '⚠️', color: 'bg-amber-50 text-amber-700' },
  ];

  const TYPE_LABEL = { flood: 'Flash Flood', Landslide: 'Landslide', Accident: 'Accident', Fire: 'Wildfire', other: 'Other' };
  const recentActivity = [...disasters]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(d => ({
      id:   d._id,
      text: `New report: ${TYPE_LABEL[d.disasterType] ?? d.disasterType}`,
      time: (() => {
        const diff = Date.now() - new Date(d.createdAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins || 1} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
      })(),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">System status and key metrics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="animate-pulse h-8 bg-gray-100 rounded-lg" />)}
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity.</p>
          ) : (
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
