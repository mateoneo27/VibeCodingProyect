interface BottomNavBarProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showProgress?: boolean;
  progressPercent?: number;
  isSubmit?: boolean;
}

export function BottomNavBar({
  onBack,
  onNext,
  nextLabel = 'Next Step',
  backLabel = 'Go Back',
  nextDisabled = false,
  showProgress = false,
  progressPercent = 0,
  isSubmit = false,
}: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#f2f3fb]/80 backdrop-blur-lg flex justify-between items-center px-10 py-6 rounded-t-[1.5rem] shadow-[0_-8px_24px_rgba(25,28,33,0.04)]">
      <button
        onClick={onBack}
        className="text-[#191c21] bg-[#e2e4f0] rounded-[1.5rem] px-8 py-3 font-headline font-semibold uppercase tracking-widest text-xs hover:opacity-90 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {backLabel}
      </button>

      {showProgress && (
        <div className="hidden sm:flex items-center gap-4 px-6 flex-1 max-w-md justify-center">
          <div className="w-full h-2.5 bg-[#e1e2ea] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#40dccb] to-[#005149] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#424752] whitespace-nowrap">
            {progressPercent}% COMPLETADO
          </span>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={nextDisabled}
        type={isSubmit ? 'submit' : 'button'}
        className="bg-gradient-to-b from-[#00478d] to-[#005eb8] text-white rounded-[1.5rem] px-8 py-3 shadow-lg font-headline font-semibold uppercase tracking-widest text-xs hover:opacity-90 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {nextLabel}
        {!isSubmit && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
        {isSubmit && <span className="material-symbols-outlined text-sm">send</span>}
      </button>
    </nav>
  );
}
