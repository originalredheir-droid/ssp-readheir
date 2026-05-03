type MetricCardProps = {
  label: string;
  value: string | number;
  accent?: string;
};

const MetricCard = ({ label, value, accent }: MetricCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 shadow-sm shadow-black/10">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className={`mt-4 text-4xl font-semibold ${accent ?? "text-white"}`}>{value}</p>
    </div>
  );
};

export default MetricCard;
