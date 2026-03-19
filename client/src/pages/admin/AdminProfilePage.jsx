import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  // Dummy Admin Data
  const adminUser = {
    name: "Admin User",
    email: "admin.user@example.com",
    role: "Super Admin",
    joinDate: "December 2023"
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your administrative account settings.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl shrink-0 shadow-md">
               {adminUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{adminUser.name}</h2>
              <p className="text-gray-500">{adminUser.email}</p>
              <div className="mt-2.5">
                  <Badge variant="default" className="bg-purple-100 text-purple-700 border-none">
                     🛡️ {adminUser.role}
                  </Badge>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
             <div className="flex justify-between items-center text-[13px]">
               <span className="text-gray-500">Access Granted</span>
               <span className="font-semibold text-gray-800">{adminUser.joinDate}</span>
             </div>
          </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
         <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-4">Actions</h3>
         <Button variant="secondary" size="lg" fullWidth>
            Edit Profile Details
          </Button>
          <Button variant="secondary" size="lg" fullWidth>
            Change Security Settings
          </Button>
          <Button 
            variant="danger" 
            size="lg" 
            fullWidth 
            onClick={() => navigate('/login')}
          >
            Log Out of Admin Console
          </Button>
      </div>

    </div>
  );
};

export default AdminProfilePage;
