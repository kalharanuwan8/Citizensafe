import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAllDisasters, updateDisasterStatus, deleteDisaster } from '../../services/disasterService';
import { getViewingUrl } from '../../services/uploadService';

const TYPE_LABEL = { flood: 'Flash Flood', Landslide: 'Landslide', Accident: 'Accident', Fire: 'Wildfire', other: 'Other' };

const formatTime = (isoString) => {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const STATUS_BADGE = {
  Active: 'danger',
  Solved: 'success',
  False:  'warning',
  Unverified: 'info',
};

const AdminDisastersPage = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null); // tracks which row is loading
  const [viewImageUrl, setViewImageUrl] = useState(null);
  const [isViewingImage, setIsViewingImage] = useState(false);

  const fetchDisasters = useCallback(() => {
    setLoading(true);
    getAllDisasters()
      .then(data => setDisasters(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(err => console.error('Failed to load disasters:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDisasters(); }, [fetchDisasters]);

  const handleStatusUpdate = async (id, status) => {
    setActionId(id);
    try {
      await updateDisasterStatus(id, status);
      fetchDisasters();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this disaster report?')) return;
    setActionId(id);
    try {
      await deleteDisaster(id);
      setDisasters(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleViewImage = async (key) => {
    if (!key) return;
    try {
      const url = await getViewingUrl(key);
      setViewImageUrl(url);
      setIsViewingImage(true);
    } catch (err) {
      console.error('Failed to get view URL:', err);
      alert('Could not retrieve image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Disasters</h1>
          <p className="text-sm text-gray-500 mt-1">Review and update reported incidents.</p>
        </div>
        <Button variant="primary" className="shrink-0" onClick={fetchDisasters}>
          ↻ Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Description</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Verify Count</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Image</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Verification</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map(j => (
                      <td key={j} className="px-6 py-4">
                        <div className="animate-pulse h-4 bg-gray-100 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : disasters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No disasters found.</td>
                </tr>
              ) : (
                disasters.map((disaster) => {
                  const isActing = actionId === disaster._id;
                  return (
                    <tr key={disaster._id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 text-[13.5px]">
                          {TYPE_LABEL[disaster.disasterType] ?? disaster.disasterType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate text-[13px]">
                        {disaster.description}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 font-bold text-[13px]">
                        {disaster.confirmationCount ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={STATUS_BADGE[disaster.status] ?? 'warning'}>
                          {disaster.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {disaster.image?.key ? (
                          <button
                            onClick={() => handleViewImage(disaster.image.key)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-[12px] uppercase tracking-wide underline decoration-indigo-200 underline-offset-4"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-300 text-[12px]">None</span>
                        )}
                      </td>
                      {/* ── Verification Column ────────────────────────────────── */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            disabled={isActing || disaster.status === 'Active'}
                            onClick={() => handleStatusUpdate(disaster._id, 'Active')}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all
                                       bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95
                                       disabled:opacity-30 disabled:cursor-not-allowed border border-emerald-100"
                          >
                             Verify
                          </button>
                          <button
                            disabled={isActing || disaster.status === 'False'}
                            onClick={() => handleStatusUpdate(disaster._id, 'False')}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all
                                       bg-orange-50 text-orange-700 hover:bg-orange-100 active:scale-95
                                       disabled:opacity-30 disabled:cursor-not-allowed border border-orange-100"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                      {/* ── Actions Column ─────────────────────────────────────── */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isActing || disaster.status === 'Solved'}
                            onClick={() => handleStatusUpdate(disaster._id, 'Solved')}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all
                                       bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95
                                       disabled:opacity-30 disabled:cursor-not-allowed border border-indigo-100"
                          >
                            Resolve
                          </button>
                          <button
                            disabled={isActing}
                            onClick={() => handleDelete(disaster._id)}
                            className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all
                                       bg-red-50 text-red-600 hover:bg-red-100 active:scale-95
                                       disabled:opacity-30 disabled:cursor-not-allowed border border-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isViewingImage && viewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-3xl max-h-screen overflow-auto relative">
            <button
              onClick={() => setIsViewingImage(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Disaster Image</h2>
            <img src={viewImageUrl} alt="Disaster" className="max-w-full h-auto object-contain max-h-[75vh] rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisastersPage;
