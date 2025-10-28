import React, { useState } from 'react';
import { Bukti, Permintaan } from './types';
import { MOCK_BUKTI, MOCK_PERMINTAAN } from './data/mockData';
import Dashboard from './components/Dashboard';
import PermintaanView from './components/Permintaan';
import BankBukti from './components/BankBukti';
import PermintaanModal from './components/PermintaanModal';
import { LayoutDashboard, ListTodo, Database, Search, Settings, Upload, RefreshCw, Layers3 } from './components/icons';

type Tab = 'dashboard' | 'permintaan' | 'bankBukti';
type Density = 'normal' | 'compact';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [density, setDensity] = useState<Density>('normal');
  const [warningDays, setWarningDays] = useState(7);

  const [requests, setRequests] = useState<Permintaan[]>(MOCK_PERMINTAAN);
  const [evidence, setEvidence] = useState<Bukti[]>(MOCK_BUKTI);

  // Evidence handlers
  const handleAddEvidence = (item: Bukti) => {
    setEvidence(prev => [...prev, item]);
  };
  const handleUpdateEvidence = (item: Bukti) => {
    setEvidence(prev => prev.map(e => e.id === item.id ? item : e));
  };
  const handleDeleteEvidence = (id: string) => {
    if (window.confirm(`Yakin ingin menghapus bukti ${id}?`)) {
      setEvidence(prev => prev.filter(e => e.id !== id));
    }
  };

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Permintaan | null>(null);

  const handleOpenRequestModal = (item: Permintaan | null = null) => {
    setEditingRequest(item);
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
    setEditingRequest(null);
  };

  // Request handlers
  const handleSaveRequest = (item: Permintaan) => {
    if (editingRequest) { // Update
        setRequests(prev => prev.map(r => r.id === item.id ? item : r));
    } else { // Add
        const newId = `PRM-00${requests.length + 1}`;
        setRequests(prev => [...prev, { ...item, id: newId }]);
    }
    handleCloseRequestModal();
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm(`Yakin ingin menghapus permintaan ${id}?`)) {
        setRequests(prev => prev.filter(r => r.id !== id));
    }
  };


  const NavButton = ({ tabName, label, icon }: { tabName: Tab; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const DensityButton = ({ value, label }: { value: Density; label: string }) => (
      <button onClick={() => setDensity(value)}
          className={`px-3 py-1 text-sm rounded-md ${
              density === value ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
      >{label}</button>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard requests={requests} evidence={evidence} warningDays={warningDays} />;
      case 'permintaan':
        return <PermintaanView 
          requests={requests}
          evidence={evidence} 
          density={density} 
          warningDays={warningDays}
          onAdd={() => handleOpenRequestModal()}
          onEdit={handleOpenRequestModal}
          onDelete={handleDeleteRequest}
        />;
      case 'bankBukti':
        return <BankBukti 
          evidence={evidence} 
          requests={requests} 
          density={density} 
          onAdd={handleAddEvidence} 
          onUpdate={handleUpdateEvidence}
          onDelete={handleDeleteEvidence}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <Layers3 className="h-8 w-8 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Instrument Bank Bukti & Permintaan Audit</h1>
                <p className="text-slate-400">Kelola bank bukti, permintaan bukti, dan pantau persentase pemenuhan.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"><Upload className="h-4 w-4 text-slate-300" /> </button>
                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"><Database className="h-4 w-4 text-slate-300" /> </button>
                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"><RefreshCw className="h-4 w-4 text-slate-300" /> </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="text" placeholder="/ untuk cari cepat..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-400"/>
                <span className="text-sm text-slate-300">Batas Peringatan</span>
                <input type="number" value={warningDays} onChange={(e) => setWarningDays(parseInt(e.target.value, 10))} className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-center focus:ring-indigo-500 focus:border-indigo-500"/>
                <span className="text-sm text-slate-300">hari</span>
              </div>
          </div>
        </header>

        <main>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
              <NavButton tabName="dashboard" label="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
              <NavButton tabName="permintaan" label="Permintaan" icon={<ListTodo className="h-4 w-4" />} />
              <NavButton tabName="bankBukti" label="Bank Bukti" icon={<Database className="h-4 w-4" />} />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Kerapatan</span>
                <div className="flex items-center bg-slate-800 p-1 rounded-xl">
                    <DensityButton value="normal" label="Normal"/>
                    <DensityButton value="compact" label="Compact"/>
                </div>
            </div>
          </div>
          
          {renderContent()}

        </main>
        
        <PermintaanModal
          isOpen={isRequestModalOpen}
          onClose={handleCloseRequestModal}
          onSave={handleSaveRequest}
          permintaan={editingRequest}
        />
      </div>
    </div>
  );
}