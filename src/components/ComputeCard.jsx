import { motion } from 'framer-motion';
import { Cpu, Database, Activity } from 'lucide-react';
import Badge from './Badge';

const ComputeCard = ({ name, sub, status = "active", managedBy, glowColor = "emerald", icon, isScanning }) => {
  const accentColor = glowColor === 'emerald' ? 'text-emerald-400' : glowColor === 'azure' ? 'text-azure' : 'text-amber-400';
  const borderColor = glowColor === 'emerald' ? 'border-emerald-500/10' : glowColor === 'azure' ? 'border-azure/10' : 'border-amber-500/10';

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-5 bg-slate-900/40 backdrop-blur-md border rounded-2xl transition-all duration-500 hover:bg-slate-800/60 overflow-hidden cursor-pointer ${
        isScanning 
          ? 'border-emerald-400/80 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]' 
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      {/* Sonar Ping Ring */}
      {isScanning && (
        <div className="absolute inset-0 border border-emerald-400/60 rounded-2xl animate-ping opacity-70 pointer-events-none" />
      )}
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
            <div className="flex items-center gap-2">
              {/* Skeuomorphic tactile physical LED indicator */}
              <div className="relative w-3.5 h-3.5 flex items-center justify-center rounded-full bg-slate-950/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-white/5 p-[1.5px]">
                <div className={`w-2 h-2 rounded-full transition-all duration-700
                  ${status === 'active' 
                    ? glowColor === 'emerald' 
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8),inset_0_-1px_1.5px_rgba(0,0,0,0.3)] animate-pulse' 
                      : glowColor === 'azure'
                        ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8),inset_0_-1px_1.5px_rgba(0,0,0,0.3)] animate-pulse'
                        : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8),inset_0_-1px_1.5px_rgba(0,0,0,0.3)] animate-pulse'
                    : 'bg-slate-800 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]'
                  }`} 
                />
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none pt-0.5">{status}</p>
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
    </motion.div>
  );
};

export default ComputeCard;
