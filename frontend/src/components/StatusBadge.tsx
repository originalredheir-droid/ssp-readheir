type StatusBadgeProps = {
  status: string;
};

const variants: Record<string, string> = {
  live: "bg-cyan-500 text-slate-950",
  scheduled: "bg-slate-700 text-slate-100",
  completed: "bg-slate-600 text-slate-200",
  draft: "bg-slate-500 text-slate-200",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const color = variants[status] ?? variants.draft;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
