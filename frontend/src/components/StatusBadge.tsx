type StatusBadgeProps = {
  status: string;
};

const variants: Record<string, string> = {
  live: "bg-secondary-container/20 text-secondary font-bold animate-pulse",
  scheduled: "bg-surface-container-high text-on-surface-variant",
  completed: "bg-surface-container text-on-surface",
  upcoming: "text-tertiary font-bold",
  draft: "bg-surface-container-high text-on-surface-variant",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const color = variants[status] ?? variants.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] ${color}`}>
      {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>}
      {status}
    </span>
  );
};

export default StatusBadge;
