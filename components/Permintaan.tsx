import React from 'react';
import { Permintaan, RequestStatus, Bukti } from '../types';
import { calculateDaysRemaining } from '../utils/dateUtils';
import { Download, Plus, Pencil, Trash2, ChevronsUpDown, ExternalLink } from './icons';

type PermintaanProps = {
  requests: Permintaan[];
  evidence: Bukti[];
  density: 'normal' | 'compact';
  warningDays: number;
  onAdd: () => void;
  onEdit: (item: Permintaan) => void;
  onDelete: (id: string) => void;
};

const PermintaanView: React.FC<PermintaanProps> = ({ requests, evidence, density, warningDays, onAdd, onEdit, onDelete }) => {

    const rowPadding = density === 'normal' ? 'py-4' : 'py-2';

    const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
        const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
        if (status === RequestStatus.Fulfilled) {
            return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Terpenuhi</span>;
        }
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Belum</span>;
    };
    
    const DeadlineTag: React.FC<{ dueDate: string }> = ({ dueDate }) => {
        const { label, status } = calculateDaysRemaining(dueDate, warningDays);
        let colorClasses = '';
        switch(status) {
            case 'overdue': colorClasses = 'bg-red-500/20 text-red-400'; break;
            case 'deadline': colorClasses = 'bg-orange-500/20 text-orange-400'; break;
            case 'warning': colorClasses = 'bg-yellow-500/20 text-yellow-400'; break;
            default: return null;
        }
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}>{label}</span>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Daftar Permintaan</h2>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        <Download className="h-5 w-5" />
                        Download Terpenuhi
                    </button>
                    <button onClick={onAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        <Plus className="h-5 w-5" />
                        Tambah Permintaan
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                            <tr>
                                {['ID', 'Tanggal', 'Unit', 'Deskripsi', 'Tenggat', 'Sisa Hari', 'PIC', 'Bukti Terkait', 'Status', 'Pemenuhan', 'Aksi'].map(header => (
                                    <th key={header} scope="col" className="px-6 py-3">
                                        <div className="flex items-center gap-1">
                                            {header}
                                            {header !== 'Aksi' && <ChevronsUpDown className="h-3 w-3" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((item) => (
                                <tr key={item.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className={`px-6 ${rowPadding} font-medium text-white`}>{item.id}</td>
                                    <td className={`px-6 ${rowPadding}`}>{item.tanggal}</td>
                                    <td className={`px-6 ${rowPadding}`}>{item.unit}</td>
                                    <td className={`px-6 ${rowPadding} max-w-xs truncate`}>{item.deskripsi}</td>
                                    <td className={`px-6 ${rowPadding}`}>{item.tenggat}</td>
                                    <td className={`px-6 ${rowPadding}`}>
                                        {item.status === RequestStatus.Pending && item.tenggat && <DeadlineTag dueDate={item.tenggat} />}
                                    </td>
                                    <td className={`px-6 ${rowPadding}`}>{item.pic}</td>
                                    <td className={`px-6 ${rowPadding}`}>
                                        <div className="flex flex-col items-start gap-1">
                                            {item.buktiTerkait && item.buktiTerkait.length > 0 ? (
                                                item.buktiTerkait.map(buktiId => {
                                                    const buktiItem = evidence.find(b => b.id === buktiId);
                                                    return buktiItem ? (
                                                        <a
                                                            key={buktiId}
                                                            href={buktiItem.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-indigo-400 hover:underline text-xs whitespace-nowrap"
                                                            title={buktiItem.deskripsi}
                                                        >
                                                            {buktiId} <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    ) : (
                                                        <span key={buktiId} className="text-xs text-slate-500" title="Bukti tidak ditemukan">{buktiId}</span>
                                                    );
                                                })
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 ${rowPadding}`}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className={`px-6 ${rowPadding}`}>{item.pemenuhan || '-'}</td>
                                    <td className={`px-6 ${rowPadding}`}>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md" title="Ubah">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/20 rounded-md" title="Hapus">
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
        </div>
    );
};

export default PermintaanView;