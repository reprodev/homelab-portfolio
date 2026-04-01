import React from 'react';
import { Cpu, Database, Activity } from 'lucide-react';
import Badge from './Badge';

const ComputeCard = ({ name, sub, status = "active", managedBy, glowColor = "emerald", icon }) => {
  const accentColor = glowColor === 'emerald' ? 'text-emerald-400' : glowColor === 'azure' ? 'text-azure' : 'text-amber-400';
  const borderColor = glowColor === 'emerald' ? 'border-emerald-500/10' : glowColor === 'azure' ? 'border-azure/10' : 'border-amber-500/10';

  return (
    <div className={`group relative p-5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-white/10 overflow-hidden`}>
      {/* Accent Strip */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${glowColor === 'emerald' ? 'bg-emerald-500' : glowColor === 'azure' ? 'bg-azure' : 'bg-amber-500'} opacity-30 group-hover:opacity-100 transition-opacity`} />
      
      {/* Background Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-5 group-hover:opacity-20 transition-opacity rounded-full ${glowColor === 'emerald' ? 'bg-emerald-500' : glowColor === 'azure' ? 'bg-azure' : 'bg-amber-500'}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-black/40 rounded-lg border border-white/5 group-hover:border-white/20 transition-all ${accentColor}`}>
            {icon ? icon : <Cpu size={18} strokeWidth={1.5} />}
          </div>
          <div>
            <h5 className="text-[15px] font-bold text-white tracking-tight leading-none mb-1 group-hover:text-emerald-400 transition-colors uppercase italic">{name}</h5>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`} />
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{status}</p>
            </div>
          </div>
        </div>
        {managedBy && (
          <Badge color={managedBy === 'Terraform' ? 'azure' : 'muted'}>{managedBy}</Badge>
        )}
      </div>

      <div className="space-y-3 relative z-10">
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 inline-block w-full italic">
          {sub}
        </p>
      </div>

      <div className="absolute bottom-0 right-0 p-3 opacity-10 group-hover:opacity-40 transition-opacity pointer-events-none">
        <Activity size={32} strokeWidth={1} />
      </div>
    </div>
  );
};

export default ComputeCard;
