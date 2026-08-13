const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
      
      <div className="glass-panel p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Profile Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input type="email" defaultValue="admin@novalib.com" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Library Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Library Name</label>
              <input type="text" defaultValue="NovaLib Central" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Default Borrowing Period (Days)</label>
              <input type="number" defaultValue="14" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
