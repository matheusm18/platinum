type FilterCapsuleProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function FilterCapsule({ label, active, onClick }: FilterCapsuleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide whitespace-nowrap select-none transition-all duration-200 ${
        active
          ? "bg-white/10 text-white border border-white/10 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
          : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}