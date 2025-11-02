export default function SmallStat({ title, value, delta }: { title: string; value: string; delta?: string }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        {delta && <div className="text-sm text-green-500 font-medium">+{delta}</div>}
      </div>
    </div>
  );
}
