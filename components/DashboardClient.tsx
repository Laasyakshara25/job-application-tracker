"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { format } from "date-fns";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  LogOut, 
  Briefcase,
  X,
  Trash2,
  ChevronDown
} from "lucide-react";
import { addApplication, deleteApplication, updateApplicationStatus } from "../app/actions";

const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700 border-blue-200",
  Interview: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Offer: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function DashboardClient({ applications, user }: { applications: any[]; user: any }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.company.toLowerCase().includes(search.toLowerCase()) || 
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleAdd(formData: FormData) {
    setIsSubmitting(true);
    await addApplication(formData);
    setIsSubmitting(false);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user.image && <img src={user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
          </div>
          <button onClick={() => signOut()} className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row shadow-sm bg-white rounded-2xl border border-gray-200 p-4 gap-4 mb-8 justify-between items-center sm:items-stretch">
          
          <div className="flex flex-1 w-full gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search company or role..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm transition-shadow outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative w-40">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                title="Filter by status"
                className="w-full pl-9 pr-8 py-3 bg-gray-50 border-none rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>

        {filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications found</h3>
            <p className="text-gray-500 text-sm">Get out there and apply to your dream job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold text-gray-400 uppercase">
                      {app.company.slice(0, 2)}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusColors[app.status]} appearance-none pr-8 cursor-pointer outline-none relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:calc(100%-8px)_center]`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={app.role}>{app.role}</h3>
                  <p className="text-gray-500 font-medium text-sm flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4" /> {app.company}
                  </p>
                  
                  {app.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 line-clamp-2 border border-gray-100">
                      {app.notes}
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                  </div>
                  <button 
                    onClick={() => deleteApplication(app.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 bg-white p-1.5 rounded-md shadow-sm border border-gray-200"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Add Application</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input required name="company" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Google" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Role / Title</label>
                  <input required name="role" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Frontend Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
                  <select name="status" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Date Applied</label>
                  <input name="dateApplied" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                  <textarea name="notes" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Salary range, tech stack, referral name..."></textarea>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
