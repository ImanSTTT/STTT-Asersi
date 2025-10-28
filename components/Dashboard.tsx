
import React, { useMemo } from 'react';
import { Permintaan, Bukti, RequestStatus } from '../types';
import { calculateDaysRemaining } from '../utils/dateUtils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, ListTodo } from './icons';

type DashboardProps = {
  requests: Permintaan[];
  evidence: Bukti[];
  warningDays: number;
};

const COLORS = {
  pending: '#8884d8',
  fulfilled: '#e11d48',
};

const UNIT_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const Dashboard: React.FC<DashboardProps> = ({ requests, evidence, warningDays }) => {
  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const fulfilled = requests.filter(r => r.status === RequestStatus.Fulfilled).length;
    const approachingDeadline = requests.filter(
      r => r.status === RequestStatus.Pending && calculateDaysRemaining(r.tenggat, warningDays).status === 'warning'
    ).length;
    const overdue = requests.filter(
      r => r.status === RequestStatus.Pending && calculateDaysRemaining(r.tenggat, warningDays).status === 'overdue'
    ).length;
    const fulfillmentPercentage = totalRequests > 0 ? Math.round((fulfilled / totalRequests) * 100) : 0;

    return { totalRequests, fulfilled, approachingDeadline, overdue, fulfillmentPercentage };
  }, [requests, warningDays]);

  const statusDistributionData = useMemo(() => {
    const pending = requests.length - stats.fulfilled;
    return [
      { name: 'Belum', value: pending },
      { name: 'Terpenuhi', value: stats.fulfilled },
    ];
  }, [requests.length, stats.fulfilled]);
  
  const requestsPerUnitData = useMemo(() => {
    const unitCounts = requests.reduce((acc, req) => {
        acc[req.unit] = (acc[req.unit] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(unitCounts).map(([name, value]) => ({ name, 'Jumlah Permintaan': value }));
  }, [requests]);

  const evidencePerUnitData = useMemo(() => {
    const unitCounts = evidence.reduce((acc, ev) => {
        acc[ev.unit] = (acc[ev.unit] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(unitCounts).map(([name, value]) => ({ name, 'Jumlah Bukti': value }));
  }, [evidence]);


  const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: number, colorClass: string }) => (
    <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ListTodo className="h-6 w-6 text-white"/>} title="Total Permintaan" value={stats.totalRequests} colorClass="bg-blue-500" />
        <StatCard icon={<CheckCircle className="h-6 w-6 text-white"/>} title="Terpenuhi" value={stats.fulfilled} colorClass="bg-green-500" />
        <StatCard icon={<AlertTriangle className="h-6 w-6 text-white"/>} title="Mendekati Deadline" value={stats.approachingDeadline} colorClass="bg-yellow-500" />
        <StatCard icon={<Clock className="h-6 w-6 text-white"/>} title="Terlambat" value={stats.overdue} colorClass="bg-red-500" />
      </div>

      <div className="bg-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-white font-semibold">Persentase Terpenuhi</h3>
                  <p className="text-4xl font-bold text-white mt-2">{stats.fulfillmentPercentage}%</p>
              </div>
              <div className="text-slate-400 text-sm">
                  {stats.approachingDeadline > 0 ? `${stats.approachingDeadline} deadline mendekat` : 'Tidak ada deadline mendatang'}
              </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${stats.fulfillmentPercentage}%` }}></div>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="text-white font-semibold mb-4">Distribusi Status Permintaan</h3>
              <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                      <PieChart>
                          <Pie
                              data={statusDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              stroke="none"
                          >
                              {statusDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.pending : COLORS.fulfilled} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                          <Legend formatter={(value, entry) => <span className="text-slate-300">{value} ({entry.payload?.value})</span>} />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="text-white font-semibold mb-4">Jumlah Permintaan per Unit</h3>
              <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={requestsPerUnitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }}/>
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} allowDecimals={false}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}/>
                        <Bar dataKey="Jumlah Permintaan" fill="#8884d8" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>
        <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-white font-semibold mb-4">Jumlah Bukti per Unit</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                <BarChart data={evidencePerUnitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }}/>
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} allowDecimals={false}/>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
                    <Bar dataKey="Jumlah Bukti" fill="#4ade80" radius={[4, 4, 0, 0]}/>
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
