import React, { useState, useEffect } from 'react';
import { Permintaan, RequestStatus } from '../types';
import { X } from './icons';

type PermintaanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permintaan: Permintaan) => void;
  permintaan: Permintaan | null;
};

const PermintaanModal: React.FC<PermintaanModalProps> = ({ isOpen, onClose, onSave, permintaan }) => {
  const [formData, setFormData] = useState<Permintaan>({
    id: '',
    tanggal: new Date().toISOString().split('T')[0],
    unit: '',
    deskripsi: '',
    tenggat: '',
    pic: '',
    buktiTerkait: [],
    status: RequestStatus.Pending,
  });

  useEffect(() => {
    if (permintaan) {
      setFormData({
        ...permintaan,
        buktiTerkait: Array.isArray(permintaan.buktiTerkait) ? permintaan.buktiTerkait : [],
      });
    } else {
      setFormData({
        id: '',
        tanggal: new Date().toISOString().split('T')[0],
        unit: '',
        deskripsi: '',
        tenggat: '',
        pic: '',
        buktiTerkait: [],
        status: RequestStatus.Pending,
        pemenuhan: undefined,
      });
    }
  }, [permintaan, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuktiTerkaitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const buktiIds = value.split(',').map(id => id.trim()).filter(id => id);
      setFormData(prev => ({...prev, buktiTerkait: buktiIds}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (finalData.status === RequestStatus.Fulfilled && !finalData.pemenuhan) {
        finalData.pemenuhan = new Date().toISOString().split('T')[0];
    } else if (finalData.status === RequestStatus.Pending) {
        finalData.pemenuhan = undefined;
    }
    onSave(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg w-full max-w-2xl text-white border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold">{permintaan ? 'Ubah Permintaan' : 'Tambah Permintaan'} {permintaan?.id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div className="col-span-1">
                <label htmlFor="id" className="block text-sm font-medium text-slate-300 mb-2">ID</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={!!permintaan} placeholder={permintaan ? "" : "Otomatis"}/>
            </div>
             <div className="col-span-1">
                <label htmlFor="tanggal" className="block text-sm font-medium text-slate-300 mb-2">Tanggal</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="col-span-2">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="col-span-1">
                <label htmlFor="unit" className="block text-sm font-medium text-slate-300 mb-2">Unit</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div className="col-span-1">
                <label htmlFor="pic" className="block text-sm font-medium text-slate-300 mb-2">PIC</label>
                <input type="text" name="pic" value={formData.pic} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="col-span-1">
                <label htmlFor="tenggat" className="block text-sm font-medium text-slate-300 mb-2">Tenggat</label>
                <input type="date" name="tenggat" value={formData.tenggat} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div className="col-span-1">
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value={RequestStatus.Pending}>Belum</option>
                    <option value={RequestStatus.Fulfilled}>Terpenuhi</option>
                </select>
            </div>
            <div className="col-span-2">
                <label htmlFor="buktiTerkait" className="block text-sm font-medium text-slate-300 mb-2">Bukti Terkait (IDs, pisahkan koma)</label>
                <input type="text" name="buktiTerkait" value={formData.buktiTerkait.join(', ')} onChange={handleBuktiTerkaitChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
          </div>
          <div className="flex justify-end items-center p-6 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white hover:bg-slate-700 rounded-md mr-2">Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermintaanModal;