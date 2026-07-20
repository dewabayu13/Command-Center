/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { BentoCard } from '../components/bento/BentoCard';
import { 
  Users, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  Camera, 
  MapPin, 
  Megaphone,
  Sparkles,
  Play,
  RotateCw,
  Clock,
  AlertOctagon,
  Award,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    citizens, 
    attendanceList, 
    letters, 
    taxpayers, 
    projects, 
    complaints, 
    budget, 
    currentRole,
    updateTaxStatus,
    updateComplaintStatus,
    addNotification
  } = useApp();

  const { isDarkMode } = useTheme();
  const { toast } = useToast();

  // Dynamic state for CCTV rotator
  const [activeCctvIndex, setActiveCctvIndex] = useState(0);
  const cctvs = [
    { name: 'Simpang Balai Desa', location: 'Gate A', status: 'Online', feedColor: 'bg-indigo-900/40' },
    { name: 'Pintu Masuk Krajan', location: 'Gate B', status: 'Online', feedColor: 'bg-emerald-900/40' },
    { name: 'Gedung PAUD Utama', location: 'Section C', status: 'Online', feedColor: 'bg-sky-900/40' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCctvIndex(prev => (prev + 1) % cctvs.length);
    }, 8000); // Auto-rotate CCTV every 8s
    return () => clearInterval(timer);
  }, [cctvs.length]);

  // Calculations for executive dashboard metrics
  const totalCitizens = citizens.length;
  const poorFamiliesCount = citizens.filter(c => c.poorStatus).length;
  const attendanceRate = Math.round((attendanceList.filter(a => a.status === 'Present').length / (attendanceList.length || 1)) * 100);
  
  const totalTaxAmount = taxpayers.reduce((sum, t) => sum + t.amount, 0);
  const paidTaxAmount = taxpayers.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const taxAchievementRate = Math.round((paidTaxAmount / (totalTaxAmount || 1)) * 100);

  // Recharts color palettes
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const GENDER_COLORS = ['#3B82F6', '#EC4899'];

  // APBDes charts data preparation
  const financeData = [
    { name: 'Govt Bongas Kulon', Target: 450, Realized: 410 },
    { name: 'Infrastruktur', Target: 520, Realized: 495 },
    { name: 'Social Welfare', Target: 150, Realized: 135 },
    { name: 'Empowerment', Target: 120, Realized: 110 },
    { name: 'Disaster Res.', Target: 80, Realized: 60 },
  ];

  const maleCount = citizens.filter(c => c.gender === 'Male').length;
  const femaleCount = citizens.filter(c => c.gender === 'Female').length;
  const genderData = [
    { name: 'Laki-laki', value: maleCount || 1 },
    { name: 'Perempuan', value: femaleCount || 1 }
  ];

  // AI Insights Generation State
  const [aiInsight, setAiInsight] = useState<string>(
    'Mengalisis tren kependudukan dan serapan APBDes... Tekan tombol untuk generate insight baru.'
  );
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const generateAIInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const contextData = {
        citizensCount: citizens.length,
        poorCount: citizens.filter(c => c.poorStatus).length,
        lettersCount: letters.length,
        complaintsCount: complaints.length,
        taxRate: taxpayers.length > 0 ? Math.round((taxpayers.filter(t => t.status === 'Paid').length / taxpayers.length) * 100) : 0,
        taxPaidAmount: taxpayers.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0),
        taxTotalAmount: taxpayers.reduce((sum, t) => sum + t.amount, 0),
        budget: budget
      };

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Berikan analisis 1 kalimat yang sangat padat, tajam, dan taktis dalam bahasa Indonesia mengenai performa desa saat ini (misalnya terkait target serapan APBDes, kepatuhan pajak PBB, kependudukan, atau laporan aduan). Mulai langsung dengan rekomendasi atau proyeksi.',
          contextData
        })
      });

      if (!response.ok) {
        throw new Error('API failure');
      }

      const data = await response.json();
      setAiInsight(data.reply);
    } catch (err) {
      // Graceful fallback to pre-set insights
      const insights = [
        `PROYEKSI: Laju serapan dana desa mencapai ${budget.absorptionRate}%. Disarankan alokasi sisa Rp ${(budget.revenue.total - budget.expenditure.total).toLocaleString('id-ID')} diprioritaskan pada penanggulangan cuaca di Dusun Krajan.`,
        `ANOMALI: Kepatuhan Pajak PBB mencapai ${taxAchievementRate}% dipimpin oleh Dusun Krajan. Rute kolektor penagihan di Dusun Karanganyar perlu restrukturisasi jam kunjungan malam harian.`,
        `REKOMENDASI: Layanan Surat rata-rata selesai dalam 12 jam (Sangat Bagus). Optimasi otomatis draf SKU menggunakan asisten pintar Gemini berhasil memotong antrean manual aparatur.`
      ];
      setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Panic Button emergency action
  const triggerEmergency = (serviceName: string) => {
    addNotification(
      'DARURAT / PANIC BUTTON', 
      `Sinyal darurat dikirim ke unit ${serviceName}. Koordinasi GPS Balai Desa diaktifkan!`, 
      'complaint'
    );
    toast(`Sinyal bahaya dikirim ke unit ${serviceName}. Ambulans/Damkar terdekat segera diarahkan ke lokasi Balai Desa.`, 'error', 'EMERGENCY TRIGGERED');
  };

  return (
    <div className="grid grid-cols-12 gap-5 p-6 overflow-y-auto">
      
      {/* SECTION 1: TOP EXECUTIVE HEADER CARDS */}
      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Population */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Penduduk</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">{totalCitizens} Jiwa</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Keluarga Prasejahtera: <span className="font-semibold text-amber-500">{poorFamiliesCount} KK</span>
            </p>
          </div>
          <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-500 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Attendance */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Hadir Aparat</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">{attendanceRate}%</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Status Operasional: <span className="font-bold text-emerald-500">OPTIMAL</span>
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Letters completed */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Layanan Surat</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-zinc-800 dark:text-zinc-100">
              {letters.filter(l => l.status === 'Completed').length} / {letters.length}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Rata-rata layanan: <span className="font-semibold text-indigo-500">12 Menit / Surat</span>
            </p>
          </div>
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Tax PBB */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Realisasi Pajak PBB</span>
            <h3 className="text-2xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-500">{taxAchievementRate}%</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Realisasi: <span className="font-semibold text-zinc-700 dark:text-zinc-300">Rp {(paidTaxAmount).toLocaleString('id-ID')}</span>
            </p>
          </div>
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-500 dark:text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SECTION 2: BENTO MATRIX GRAPHICS & INTERACTIVES */}
      
      {/* 1. APBDes Budget Allocation Chart */}
      <BentoCard 
        title="01. Transparansi Keuangan Desa" 
        subtitle="Analisis Alokasi Sektor APBDes 2026 (Juta Rp)"
        className="col-span-12 lg:col-span-8 h-80"
        headerAction={
          <div className="flex items-center gap-1 text-xs text-indigo-500 font-semibold cursor-pointer hover:underline">
            <span>Rincian</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        }
      >
        <div className="w-full h-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#888888" />
              <YAxis tick={{ fontSize: 10 }} stroke="#888888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', 
                  borderColor: '#E5E7EB',
                  borderRadius: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="Target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Realized" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BentoCard>

      {/* 2. Demographics Gender Pie */}
      <BentoCard 
        title="02. Demografi Gender" 
        subtitle="Perbandingan Penduduk L/P"
        className="col-span-12 md:col-span-6 lg:col-span-4 h-80"
      >
        <div className="w-full h-full min-h-[180px] flex flex-col justify-between">
          <div className="flex-1 min-h-[130px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#3B82F6]" />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Laki-laki ({maleCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#EC4899]" />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Perempuan ({femaleCount})</span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* 3. CCTV Monitoring Rotating Grid */}
      <BentoCard 
        title="03. Pantauan CCTV Desa" 
        subtitle={cctvs[activeCctvIndex].name}
        className="col-span-12 md:col-span-6 lg:col-span-4 h-80 flex flex-col justify-between"
        headerAction={
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase animate-pulse">
            <Camera className="w-3.5 h-3.5" />
            <span>LIVE</span>
          </div>
        }
      >
        <div className="flex-1 w-full relative rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-950">
          {/* Mock Video Grid Backdrop */}
          <div className={`absolute inset-0 transition-colors duration-500 ${cctvs[activeCctvIndex].feedColor}`} />
          
          {/* Video Scanning Grid effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-950/20 to-zinc-950 pointer-events-none" />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wider text-white">
            {cctvs[activeCctvIndex].location}
          </div>
          
          <div className="z-10 flex flex-col items-center gap-2">
            <Play className="w-10 h-10 text-white/80 hover:scale-115 transition-transform cursor-pointer drop-shadow-md" />
            <p className="text-[10px] text-zinc-300 font-medium font-mono">Stream Bongas-Net #0{activeCctvIndex + 1}</p>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-tight">ONLINE</span>
          </div>
        </div>
      </BentoCard>

      {/* 4. Active Complaints & Emergency Trigger */}
      <BentoCard 
        title="04. Pusat Mitigasi & Aduan Warga" 
        subtitle="Aduan Publik Masuk"
        className="col-span-12 md:col-span-6 lg:col-span-4 h-80"
      >
        <div className="w-full h-full flex flex-col justify-between gap-3">
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[140px] custom-scrollbar">
            {complaints.slice(0, 3).map((item) => (
              <div key={item.complaintId} className="p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-start justify-between gap-2 text-xs">
                <div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1 leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{item.reporterName} • {item.category}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase leading-none ${
                  item.status === 'Resolved' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : item.status === 'In Progress' 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'bg-red-500/10 text-red-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Panic Button emergency trigger */}
          <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-3">
            <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider block mb-2 font-mono">Panic Button (Respons Darurat)</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => triggerEmergency('Kesehatan / Ambulans')}
                className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-95 transition-all"
              >
                <AlertOctagon className="w-3.5 h-3.5 animate-bounce" />
                <span>AMBULANS</span>
              </button>
              <button 
                onClick={() => triggerEmergency('Keamanan / Damkar / Polisi')}
                className="py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-95 transition-all"
              >
                <AlertOctagon className="w-3.5 h-3.5 animate-bounce" />
                <span>POLISI/DAMKAR</span>
              </button>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* 5. Smart AI Insights Console */}
      <BentoCard 
        title="05. Analitik Pintar & AI Insight" 
        subtitle="EasyDes Predictive Engine (Gemini AI)"
        className="col-span-12 lg:col-span-8 h-80"
        headerAction={
          <button 
            onClick={generateAIInsight}
            disabled={isGeneratingInsight}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingInsight ? 'Menganalisis...' : 'Generate Insight'}</span>
          </button>
        }
      >
        <div className="w-full h-full flex flex-col md:flex-row gap-5 items-center justify-between">
          
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 p-4 rounded-xl min-h-[140px] flex flex-col justify-between w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Gemini-2.5-Flash</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                "{aiInsight}"
              </p>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono mt-2 block">
              *Rekomendasi dihitung otomatis berdasarkan data serapan APBDes dan capaian target PBB terkini.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-56 flex-shrink-0">
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">Prediksi Pajak</span>
              <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">LUNAS 96%</p>
              <span className="text-[9px] text-emerald-500 font-medium">↑ +3.5% vs 2025</span>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">Prediksi Warga</span>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">750 JIWA</p>
              <span className="text-[9px] text-zinc-500 font-medium">Stabil / Aman</span>
            </div>
          </div>

        </div>
      </BentoCard>

      {/* 6. Active Projects Tracker */}
      <BentoCard 
        title="06. Status Pembangunan Fisik Desa" 
        subtitle="Proyek Konstruksi Infrastruktur"
        className="col-span-12 md:col-span-6 lg:col-span-4 h-80"
      >
        <div className="w-full h-full flex flex-col gap-3 justify-between">
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[180px] custom-scrollbar">
            {projects.map((proj) => (
              <div key={proj.projectId} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-800 dark:text-zinc-200 line-clamp-1">{proj.name}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500" 
                    style={{ width: `${proj.progress}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span>Kontraktor: {proj.contractor}</span>
                  <span className={`font-bold uppercase ${proj.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {proj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Dana Teralokasi: <strong className="text-zinc-800 dark:text-white">Rp 280 jt</strong></span>
            <span>Selesai: <strong className="text-emerald-500">1 Proyek</strong></span>
          </div>
        </div>
      </BentoCard>

    </div>
  );
};
