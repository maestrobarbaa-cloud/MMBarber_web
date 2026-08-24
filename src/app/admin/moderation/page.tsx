'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Search, Filter, Ban, MoreVertical, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for DSA Reports
const MOCK_REPORTS = [
  {
    id: 'rep-001',
    reportedProfileId: 'user-789',
    reportedProfileName: 'Karel',
    reporterId: 'user-123',
    category: 'harassment',
    description: 'Byl velmi agresivní a posílal mi nevhodné návrhy i po odmítnutí.',
    status: 'pending', // pending, reviewing, resolved, dismissed
    date: '2026-08-24T10:30:00Z',
    severity: 'high'
  },
  {
    id: 'rep-002',
    reportedProfileId: 'user-456',
    reportedProfileName: 'Petra_New',
    reporterId: 'user-321',
    category: 'scam',
    description: 'Profil vypadá falešně, posílá odkazy na krypto podvody.',
    status: 'reviewing',
    date: '2026-08-23T15:45:00Z',
    severity: 'medium'
  },
  {
    id: 'rep-003',
    reportedProfileId: 'mock-s3', // Sabina
    reportedProfileName: 'Sabina',
    reporterId: 'system',
    category: 'critical_rating',
    description: 'Automatické nahlášení: Tento profil obdržel vysoký počet "Kritických" hodnocení od komunity.',
    status: 'pending',
    date: '2026-08-24T11:15:00Z',
    severity: 'critical'
  }
];

export default function ModerationDashboard() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [actionModal, setActionModal] = useState<'block' | 'dismiss' | null>(null);
  const [statementOfReasons, setStatementOfReasons] = useState('');
  
  const activeReports = reports.filter(r => r.status === 'pending' || r.status === 'reviewing');
  const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'dismissed');

  const handleAction = (reportId: string, newStatus: string, reason?: string) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    setActionModal(null);
    setSelectedReport(null);
    setStatementOfReasons('');
    // TODO: Zde by proběhlo odeslání DSA "Statement of Reasons" uživateli a logování do DB
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <ShieldAlert size={32} />
              <h1 className="text-3xl font-heading font-black uppercase tracking-widest">DSA Moderation</h1>
            </div>
            <p className="text-white/50 font-mono text-sm">Digital Services Act Compliance & Safety Dashboard</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-red-900/20 border border-red-500/30 px-4 py-3 rounded-xl flex flex-col">
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Pending Reports</span>
              <span className="text-2xl font-black text-red-500">{activeReports.length}</span>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 px-4 py-3 rounded-xl flex flex-col">
              <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Resolved Today</span>
              <span className="text-2xl font-black text-green-500">12</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search reports by Profile ID or Name..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
            />
          </div>
          <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter size={18} className="text-white/60" />
            <span className="text-sm font-bold uppercase tracking-wider">Filter</span>
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-mafia-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs font-mono text-white/50 uppercase tracking-widest">Severity</th>
                <th className="p-4 text-xs font-mono text-white/50 uppercase tracking-widest">Reported Profile</th>
                <th className="p-4 text-xs font-mono text-white/50 uppercase tracking-widest">Category (DSA)</th>
                <th className="p-4 text-xs font-mono text-white/50 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-mono text-white/50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeReports.map(report => (
                <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedReport(report)}>
                  <td className="p-4">
                    {report.severity === 'critical' ? (
                      <span className="px-2 py-1 bg-red-900/50 border border-red-500 text-red-400 rounded text-xs font-bold uppercase tracking-widest animate-pulse">Critical</span>
                    ) : report.severity === 'high' ? (
                      <span className="px-2 py-1 bg-orange-900/50 border border-orange-500 text-orange-400 rounded text-xs font-bold uppercase tracking-widest">High</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-900/50 border border-yellow-500 text-yellow-400 rounded text-xs font-bold uppercase tracking-widest">Medium</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{report.reportedProfileName}</div>
                    <div className="text-xs font-mono text-white/40">{report.reportedProfileId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{report.category}</div>
                    <div className="text-xs font-mono text-white/40 truncate max-w-xs">{report.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-900/30 border border-blue-500/50 text-blue-400 rounded text-[10px] font-bold uppercase tracking-widest">
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}>
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {activeReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest">
                    No active reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && !actionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-mafia-dark border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-heading font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText size={20} className="text-mafia-gold" /> Report Details
                </h2>
                <button onClick={() => setSelectedReport(null)} className="text-white/40 hover:text-white"><XCircle size={24} /></button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Reported Profile</div>
                    <div className="font-bold text-lg">{selectedReport.reportedProfileName}</div>
                    <div className="text-xs font-mono text-white/50">{selectedReport.reportedProfileId}</div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Reporter</div>
                    <div className="font-bold text-lg">{selectedReport.reporterId === 'system' ? 'System (Auto)' : selectedReport.reporterId}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Category & Description</div>
                  <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl text-red-100">
                    <div className="font-bold mb-2 uppercase tracking-wider text-sm text-red-400">{selectedReport.category}</div>
                    <p className="font-serif leading-relaxed">{selectedReport.description}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setActionModal('block')}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Ban size={18} /> Block Profile
                  </button>
                  <button 
                    onClick={() => setActionModal('dismiss')}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-white/10"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Action Modal (DSA Statement of Reasons) */}
        {actionModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="bg-mafia-dark border border-red-500/50 w-full max-w-xl rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <h2 className="text-2xl font-heading font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-3">
                {actionModal === 'block' ? <Ban /> : <CheckCircle2 />}
                {actionModal === 'block' ? 'Block & Statement of Reasons' : 'Dismiss Report'}
              </h2>
              
              {actionModal === 'block' ? (
                <>
                  <p className="text-white/70 font-mono text-sm mb-6 leading-relaxed">
                    Under the Digital Services Act (DSA), you must provide a clear and specific <strong>Statement of Reasons</strong> to the user explaining why their content/profile was removed.
                  </p>
                  <textarea 
                    value={statementOfReasons}
                    onChange={(e) => setStatementOfReasons(e.target.value)}
                    placeholder="E.g. Your profile has been suspended due to multiple reports of sexual harassment, violating our Terms of Service (Section 4.2). You have the right to appeal this decision..."
                    className="w-full h-32 bg-black/50 border border-white/20 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-red-500 mb-6"
                  />
                </>
              ) : (
                <p className="text-white/70 font-mono text-sm mb-6 leading-relaxed">
                  Are you sure you want to dismiss this report? The reporter will be notified that no action was taken.
                </p>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(selectedReport.id, actionModal === 'block' ? 'resolved' : 'dismissed', statementOfReasons)}
                  disabled={actionModal === 'block' && statementOfReasons.length < 10}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-widest transition-colors"
                >
                  Confirm Action
                </button>
                <button 
                  onClick={() => setActionModal(null)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest transition-colors border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
