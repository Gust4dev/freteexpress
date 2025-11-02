export default function MiniChart() {
  return (
    <div className="h-28 rounded-lg p-3 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700">
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <polyline
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="0,28 12,24 24,10 36,18 48,8 60,12 72,6 84,10 96,4"
        />
      </svg>
    </div>
  );
}
