
import { Permintaan, Bukti, RequestStatus, EvidenceValidity } from '../types';

export const MOCK_PERMINTAAN: Permintaan[] = [
  {
    id: 'PRM-001',
    tanggal: '2025-10-02',
    unit: 'Kepatuhan',
    deskripsi: 'Minta kebijakan keamanan informasi',
    tenggat: '2025-10-04',
    pic: 'Rina',
    buktiTerkait: ['BKT-001'],
    status: RequestStatus.Fulfilled,
    pemenuhan: '2025-10-02',
  },
  {
    id: 'PRM-002',
    tanggal: '2025-10-03',
    unit: 'TI',
    deskripsi: 'Minta SOP dan log backup',
    tenggat: '2025-10-06',
    pic: 'Andi',
    buktiTerkait: ['BKT-002', 'BKT-003'],
    status: RequestStatus.Fulfilled,
    pemenuhan: '2025-10-05',
  },
  {
    id: 'PRM-003',
    tanggal: '2025-10-07',
    unit: 'Operasional',
    deskripsi: 'Checklist harian DC',
    tenggat: '2025-10-10',
    waktu: '15-10-25',
    pic: 'Budi',
    buktiTerkait: [],
    status: RequestStatus.Pending,
  },
];

export const MOCK_BUKTI: Bukti[] = [
  {
    id: 'BKT-001',
    kategori: 'Kebijakan',
    deskripsi: 'Kebijakan Keamanan Informasi',
    link: 'https://example.com/kebijakan.pdf',
    unit: 'TI',
    pic: 'Andi',
    tglDiterima: '2025-10-01',
    validitas: EvidenceValidity.Valid,
    catatan: 'Dokumen final',
    prmTerkait: 'PRM-001',
  },
  {
    id: 'BKT-002',
    kategori: 'Prosedur',
    deskripsi: 'SOP Backup Rutin',
    link: 'https://example.com/sop-backup.pdf',
    unit: 'TI',
    pic: 'Sari',
    tglDiterima: '2025-10-03',
    validitas: EvidenceValidity.NeedsImprovement,
    catatan: 'Perlu tanda tangan terbaru',
    prmTerkait: 'PRM-002',
  },
  {
    id: 'BKT-003',
    kategori: 'Catatan',
    deskripsi: 'Log Backup Sept 2025',
    link: 'https://example.com/log-sept25.xlsx',
    unit: 'TI',
    pic: 'Budi',
    tglDiterima: '2025-10-05',
    validitas: EvidenceValidity.Valid,
    catatan: '',
    prmTerkait: 'PRM-002',
  },
];

// Extend data to make dashboard more interesting
const today = new Date();
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(today.getDate() + days);
  return date.toISOString().split('T')[0];
};

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(today.getDate() - days);
    return date.toISOString().split('T')[0];
}

MOCK_PERMINTAAN.push({
    id: 'PRM-004',
    tanggal: getPastDate(10),
    unit: 'TI',
    deskripsi: 'Laporan penetrasi testing Q3',
    tenggat: getPastDate(2), // Overdue
    pic: 'Terlambat',
    buktiTerkait: [],
    status: RequestStatus.Pending
});
