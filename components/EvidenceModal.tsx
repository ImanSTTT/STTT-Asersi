
import React, { useState, useEffect } from 'react';
import { Bukti, Permintaan, EvidenceValidity } from '../types';
import { X } from './icons';

type EvidenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Bukti) => void;
  evidence: Bukti | null;
  requests: Permintaan[];
};

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, onSave, evidence, requests }) => {
  const [formData, setFormData] = useState<Bukti>({
    id: '',
    kategori: '',
    deskripsi: '',
    link: '',
    unit: '',
    pic: '',
    tglDiterima: new Date().toISOString().split('T')[0],
    validitas: EvidenceValidity.Valid,
    catatan: '',
    prmTerkait: '',
  });

  useEffect(() => {
    if (evidence) {
      setFormData(evidence);
    } else {
      setFormData({
        id: '',
        kategori: '',
        deskripsi: '',
        link: '',
        unit: '',
        pic: '',
        tglDiterima: new Date().toISOString().split('T')[0],
        validitas: EvidenceValidity.Valid,
        catatan: '',
        prmTerkait: '',
      });
    }
  }, [evidence, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg w-full max-w-2xl text-white border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold">{evidence ? 'Ubah Bukti' : 'Tambah Bukti'} {evidence?.id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div className="col-span-1">
                <label htmlFor="id" className="block text-sm font-medium text-slate-300 mb-2">ID</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={!!evidence} placeholder={evidence ? "" : "BKT-XXX"}/>
            </div>
            <div className="col-span-1">
                <label htmlFor="kategori" className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
                <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="col-span-2">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="col-span-1">
                <label htmlFor="link" className="block text-sm font-medium text-slate-300 mb-2">Link/Lokasi File</label>
                <input type="text" name="link" value={formData.link} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
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
                <label htmlFor="tglDiterima" className="block text-sm font-medium text-slate-300 mb-2">Tanggal Diterima</label>
                <input type="date" name="tglDiterima" value={formData.tglDiterima} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div className="col-span-1">
                <label htmlFor="validitas" className="block text-sm font-medium text-slate-300 mb-2">Validitas</label>
                <select name="validitas" value={formData.validitas} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value={EvidenceValidity.Valid}>Valid</option>
                    <option value={EvidenceValidity.NeedsImprovement}>Perlu Perbaikan</option>
                </select>
            </div>
            <div className="col-span-1">
                <label htmlFor="prmTerkait" className="block text-sm font-medium text-slate-300 mb-2">ID Permintaan Terkait (opsional)</label>
                <select name="prmTerkait" value={formData.prmTerkait} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">-</option>
                    {requests.map(req => <option key={req.id} value={req.id}>{req.id} - {req.deskripsi}</option>)}
                </select>
            </div>
             <div className="col-span-2">
                <label htmlFor="catatan" className="block text-sm font-medium text-slate-300 mb-2">Catatan</label>
                <textarea name="catatan" value={formData.catatan} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
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

export default EvidenceModal;
