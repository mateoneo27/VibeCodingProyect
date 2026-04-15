interface ProgressBarProps {
  step: string;
  title: string;
  percent: number;
}

export function ProgressBar({ step, title, percent }: ProgressBarProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-[#0A29CD] font-headline font-bold text-sm tracking-widest uppercase">{step}</span>
          <h1 className="text-4xl font-extrabold text-[#000033] tracking-tight mt-1">{title}</h1>
        </div>
        <div className="text-right">
          <span className="text-[#666685] font-medium text-sm">Progreso del perfil</span>
          <p className="text-xl font-bold text-[#0A29CD]">{percent}%</p>
        </div>
      </div>
      <div className="h-3 w-full bg-[#B3B3C2]/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#49C7FD] to-[#0A29CD] rounded-full relative transition-all duration-500"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
