import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  ShieldCheck,
  Building,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Sparkles,
  Clock,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approvals');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) setStats(statsRes.data.data);

      const propsRes = await API.get('/properties?status=pending');
      if (propsRes.data.success) setPendingProperties(propsRes.data.data);

      const usersRes = await API.get('/admin/users');
      if (usersRes.data.success) setAllUsers(usersRes.data.data);

      const inqRes = await API.get('/admin/inquiries');
      if (inqRes.data.success) setAllInquiries(inqRes.data.data);
    } catch (err) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await API.put(`/admin/properties/${id}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Listing ${newStatus}!`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (data.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Role update failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and their listings?')) return;
    try {
      const { data } = await API.delete(`/admin/users/${userId}`);
      if (data.success) {
        toast.success('User deleted successfully');
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 text-sm">You must be logged in as an Administrator to view this panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-gradient-to-r from-navy-900 via-slate-900 to-brand-900 p-8 rounded-3xl text-white shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
          <p className="text-xs text-slate-300">System oversight, property approvals, and user permissions</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Listings</span>
            <Building className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalProperties || 0}</p>
          <span className="text-xs font-semibold text-emerald-600">{stats?.approvedProperties || 0} Approved</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{stats?.pendingProperties || 0}</p>
          <span className="text-xs text-slate-500 font-medium">Requires admin review</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
          <span className="text-xs font-semibold text-slate-500">{stats?.totalOwners || 0} Owners</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Inquiries</span>
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.totalInquiries || 0}</p>
          <span className="text-xs font-semibold text-purple-600">Platform-wide messages</span>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase ${
            activeTab === 'approvals' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Approvals ({pendingProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase ${
            activeTab === 'users' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Management ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase ${
            activeTab === 'inquiries' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Inquiries ({allInquiries.length})
        </button>
      </div>

      {/* Tab 1: Pending Property Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Listings Awaiting Approval</h3>
          {pendingProperties.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">🎉 All property submissions have been reviewed!</p>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'}
                      alt={prop.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{prop.title}</h4>
                      <p className="text-xs text-slate-500">
                        {prop.bedrooms} BHK • ${prop.price.toLocaleString()} • {prop.location?.city}
                      </p>
                      <p className="text-[11px] text-slate-400">Owner: {prop.owner?.name || 'Owner'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(prop._id, 'approved')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(prop._id, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1 shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">User Role Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                        className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold capitalize bg-white"
                      >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Platform Global Inquiries</h3>
          <div className="space-y-3">
            {allInquiries.map((inq) => (
              <div key={inq._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Property: {inq.property?.title}</span>
                  <span className="text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 italic">"{inq.message}"</p>
                <div className="flex space-x-4 text-slate-500 pt-1">
                  <span>Sender: {inq.name} ({inq.email})</span>
                  <span>Owner: {inq.owner?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
