/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  FileText, 
  User, 
  HelpCircle 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isDraft?: boolean;
}

export const AIAssistant: React.FC = () => {
  const { citizens, letters, budget, taxpayers, complaints, assets } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Halo! Saya **Desi**, Asisten AI Desa Bongas Kulon. Saya siap membantu Anda mengelola data kependudukan, keuangan APBDes, menyusun draf surat resmi, atau memantau aduan warga. Silakan ajukan pertanyaan atau pilih menu cepat di bawah ini!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Handle Preset Prompts
  const handlePresetClick = (promptText: string) => {
    setInput(promptText);
    handleSubmitPrompt(promptText);
  };

  // Copy text to clipboard
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Speech simulation (Text-To-Speech mockup)
  const speakText = (text: string) => {
    if (isAudioMuted) return;
    // Strip markdown before speaking
    const cleanText = text.replace(/[*#`_\-]/g, '');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mic Activation Simulation
  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      // Simulate speech recognition trigger
      const voicePrompts = [
        'Berapa persentase serapan APBDes saat ini?',
        'Tulis draf Surat Keterangan Usaha atas nama Mei Saemurni NIK 3210175105890121',
        'Berapa total warga prasejahtera di desa kita?',
        'Tampilkan ringkasan aduan warga yang belum selesai'
      ];
      setTimeout(() => {
        const randomVoice = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
        setInput(randomVoice);
        setIsVoiceActive(false);
      }, 3500);
    } else {
      setIsVoiceActive(false);
    }
  };

  const handleSubmitPrompt = async (forcedInput?: string) => {
    const promptToSend = forcedInput || input;
    if (!promptToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: promptToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Context preparation to enrich the prompt on the backend
    const contextData = {
      citizensCount: citizens.length,
      poorCount: citizens.filter(c => c.poorStatus).length,
      lettersCount: letters.length,
      complaintsCount: complaints.length,
      assetsCount: assets.length,
      taxRate: taxpayers.length > 0 ? Math.round((taxpayers.filter(t => t.status === 'Paid').length / taxpayers.length) * 100) : 0,
      taxPaidAmount: taxpayers.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0),
      taxTotalAmount: taxpayers.reduce((sum, t) => sum + t.amount, 0),
      budget: budget
    };

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          contextData,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi backend AI Assistant');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date(),
        isDraft: data.reply.includes('SURAT') || data.reply.includes('Nomor:')
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(data.reply);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        text: 'Maaf, terjadi kesalahan koneksi saat memproses perintah Anda. Pastikan server berjalan dan cobalah beberapa saat lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetSuggestions = [
    { text: '📊 Laporan Ringkas APBDes 2026', desc: 'Analisis serapan anggaran' },
    { text: '📝 Draf Surat Keterangan Usaha (SKU)', desc: 'Format otomatis surat resmi' },
    { text: '📈 Demografi Warga & Kemiskinan', desc: 'Rasio kemiskinan desa' },
    { text: '⚠️ Solusi Aduan Jembatan Krajan', desc: 'Tanggapan otomatis laporan aduan' }
  ];

  return (
    <>
      {/* FLOATING ACTION LAUNCHER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="ai-floating-fab"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center text-white font-bold cursor-pointer select-none transition-all ${
            isOpen 
              ? 'bg-rose-500 hover:bg-rose-600 rotate-90' 
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 hover:scale-105 active:scale-95'
          }`}
          style={{ width: '60px', height: '60px' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
              {/* Pulsing glow boundary */}
              <span className="absolute inset-0 rounded-full bg-indigo-500/30 scale-125 animate-ping -z-10" />
            </>
          )}
        </motion.button>
      </div>

      {/* CHATBOT MAIN CONTAINER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl bg-zinc-900/90 dark:bg-zinc-950/95 border border-zinc-700/50 shadow-2xl overflow-hidden flex flex-col z-50 backdrop-blur-xl"
          >
            {/* PANEL HEADER WITH GLASSMORPHIC OVERLAY */}
            <div className="p-4 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 font-sans">
                    Desi Asisten AI
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Sistem Aktif" />
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-semibold font-mono">Bongas Kulon Smart Agent</p>
                </div>
              </div>

              {/* Top Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${!isAudioMuted && 'text-indigo-400 bg-indigo-500/10'}`}
                  title={isAudioMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: 'welcome',
                        role: 'assistant',
                        text: 'Konsol dibersihkan. Halo! Saya Desi, silakan tanyakan apa saja seputar data kependudukan, draf surat, anggaran, atau peta pajak.',
                        timestamp: new Date()
                      }
                    ]);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Reset Obrolan"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGE CHAT CANVAS */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-900/30"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 text-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className="max-w-[80%] space-y-1.5">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 border-indigo-500/40 text-white rounded-tr-none'
                          : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-100 rounded-tl-none font-sans'
                      }`}
                    >
                      {/* Rich Markdown Support Rendering */}
                      <div className="whitespace-pre-wrap space-y-2">
                        {msg.text.split('\n').map((line, lIdx) => {
                          // Handle markdown headers
                          if (line.startsWith('### ')) {
                            return <h4 key={lIdx} className="font-extrabold text-sm text-indigo-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
                          }
                          if (line.startsWith('## ')) {
                            return <h3 key={lIdx} className="font-black text-sm text-white mt-3 mb-1.5 border-b border-zinc-700 pb-1">{line.replace('## ', '')}</h3>;
                          }
                          
                          // Handle bold tags manually for clean simple text rendering
                          let parts = line.split('**');
                          let formattedLine = parts.map((part, pIdx) => {
                            if (pIdx % 2 === 1) {
                              return <strong key={pIdx} className="text-white font-bold">{part}</strong>;
                            }
                            return part;
                          });

                          return <p key={lIdx} className="leading-relaxed">{formattedLine}</p>;
                        })}
                      </div>

                      {/* Display Action Triggers */}
                      {msg.role === 'assistant' && msg.id !== 'welcome' && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-700/40 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="font-mono">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="p-1 hover:text-white hover:bg-zinc-700 rounded transition-colors flex items-center gap-1 font-semibold"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 text-xs font-bold font-mono">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING SKELETON LOADER */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-zinc-800/80 border border-zinc-700/60 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2 font-semibold">Desi sedang merumuskan jawaban...</p>
                  </div>
                </div>
              )}

              {/* MIC WAVEFORM PULSE SIMULATION */}
              {isVoiceActive && (
                <div className="flex flex-col items-center justify-center p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [12, 36, 12] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1 bg-indigo-400 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-indigo-300 tracking-wide animate-pulse">Mendengarkan Perintah Suara...</p>
                  <button
                    onClick={() => setIsVoiceActive(false)}
                    className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg hover:bg-rose-500 hover:text-white"
                  >
                    Batal
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* PRESET PROMPT SUGGESTION BAR */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-zinc-800 bg-zinc-950/40 space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Menu Cepat & Pertanyaan Umum
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {presetSuggestions.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetClick(p.text)}
                      className="p-2 text-left bg-zinc-850 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-zinc-800 rounded-xl transition-all group cursor-pointer"
                    >
                      <h4 className="text-[10.5px] font-bold text-zinc-200 group-hover:text-indigo-300 leading-tight">{p.text}</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5 font-medium">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER CHAT CONSOLE INPUT BOX */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
              {/* Voice recognition launcher */}
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-xl border transition-all ${
                  isVoiceActive 
                    ? 'bg-rose-600/20 border-rose-500 text-rose-500 animate-pulse' 
                    : 'bg-zinc-850 hover:bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Input Perintah Suara"
              >
                {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Chat Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitPrompt();
                }}
                disabled={isLoading}
                placeholder="Tulis pesan atau draf surat..."
                className="flex-1 bg-zinc-850 hover:bg-zinc-850/80 focus:bg-zinc-850 border border-zinc-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none placeholder-zinc-500 transition-all font-sans"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSubmitPrompt()}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-indigo-600 flex items-center justify-center transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
