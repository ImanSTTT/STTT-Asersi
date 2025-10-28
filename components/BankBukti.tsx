
import React, { useState } from 'react';
import { Bukti, Permintaan, EvidenceValidity } from '../types';
import EvidenceModal from './EvidenceModal';
import { Plus, Pencil, Trash2, ExternalLink } from './icons';

type BankBuktiProps = {
  evidence: Bukti[];
  requests: Permintaan[];
  density: 'normal' | 'compact';
  onAdd: (item: Bukti) => void;
  onUpdate: (item: Bukti) => void;
  onDelete: (id: string) => void;
};

const BankBukti: React.FC<BankBuktiProps> = ({ evidence, requests, density, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Bukti | null>(null);

  const handleOpenModal = (item: Bukti | null = null) => {
    setEditingEvidence(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvidence(null);
  };

  const handleSave = (item: Bukti) => {
    if (editingEvidence) {
      onUpdate(item);
    } else {
      onAdd({ ...item, id: `BKT-00${evidence.length + 1}` });
    }
    handleCloseModal();
  };
  
  const rowPadding = density === 'normal' ? 'py-4' : 'py-2';

  const ValidityBadge: React.FC<{ validity: EvidenceValidity }> = ({ validity }) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    if (validity === EvidenceValidity.Valid) {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Valid</span>;
    }
    return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Perlu Perbaikan</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Bank Bukti</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Bukti
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Kategori</th>
                <th scope="col" className="px-6 py-3">Deskripsi</th>
                <th scope="col" className="px-6 py-3">Link</th>
                <th scope="col" className="px-6 py-3">Unit</th>
                <th scope="col" className="px-6 py-3">PIC</th>
                <th scope="col" className="px-6 py-3">Tgl Diterima</th>
                <th scope="col" className="px-6 py-3">Validitas</th>
                <th scope="col" className="px-6 py-3">PRM Terkait</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {evidence.map((item) => (
                <tr key={item.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                    <td className={`px-6 ${rowPadding} font-medium text-white`}>{item.id}</td>
                    <td className={`px-6 ${rowPadding}`}>{item.kategori}</td>
                    <td className={`px-6 ${rowPadding}`}>{item.deskripsi}</td>
                    <td className={`px-6 ${rowPadding}`}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                            Buka <ExternalLink className="h-4 w-4"/>
                        </a>
                    </td>
                    <td className={`px-6 ${rowPadding}`}>{item.unit}</td>
                    <td className={`px-6 ${rowPadding}`}>{item.pic}</td>
                    <td className={`px-6 ${rowPadding}`}>{item.tglDiterima}</td>
                    <td className={`px-6 ${rowPadding}`}>
                        <ValidityBadge validity={item.validitas} />
                    </td>
                    <td className={`px-6 ${rowPadding}`}>{item.prmTerkait}</td>
                    <td className={`px-6 ${rowPadding}`}>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/20 rounded-md">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <EvidenceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        evidence={editingEvidence}
        requests={requests}
      />
    </div>
  );
};

export default BankBukti;
