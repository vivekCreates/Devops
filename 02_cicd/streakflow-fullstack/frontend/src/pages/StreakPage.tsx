import { motion } from 'framer-motion'
import { Flame, TrendingUp } from 'lucide-react'

const weekData = [
  { day: 'Mon', completed: 3, total: 5 },
  { day: 'Tue', completed: 4, total: 5 },
  { day: 'Wed', completed: 2, total: 5 },
  { day: 'Thu', completed: 5, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 5, total: 5 },
  { day: 'Sun', completed: 3, total: 5 },
]

const leaderboard = [
  { name: 'Morning Run', icon: '🏃', streak: 18 },
  { name: 'Drink Water', icon: '💧', streak: 14 },
  { name: 'Read 30 min', icon: '📖', streak: 9 },
]

const maxBar = 5

const StreakPage = () => {
  const todayIndex = new Date().getDay()
  // Convert JS day (0=Sun) to Mon-based index (0=Mon)
  const todayMon = todayIndex === 0 ? 6 : todayIndex - 1

  const totalCompleted = weekData.reduce((sum, d) => sum + d.completed, 0)
  const bestStreak = Math.max(...leaderboard.map((h) => h.streak))

  // Calculate percentage change (mock: compare last 2 days)
  const percentChange = '+12%'

  return (
    <div
      className="min-h-[100dvh] flex flex-col pb-10"
      style={{
        background:
          'linear-gradient(180deg, #e8faf6 0%, #f0fdf9 30%, #f7fdfb 60%, #ffffff 100%)',
      }}
    >
      {/* ====== Header ====== */}
      <motion.div
        className="px-5 sm:px-6 pt-10 sm:pt-12 pb-1"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[1.55rem] sm:text-[1.7rem] font-extrabold text-text-dark tracking-tight leading-tight">
          Your Progress{' '}
          <span className="inline-block text-xl">📊</span>
        </h1>
        <p className="mt-1 text-[0.85rem] text-text-dark-secondary font-normal">
          Keep the momentum going, Vivek 🔥
        </p>
      </motion.div>

      {/* ====== Weekly Chart Card ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-6 sm:mt-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[1.02rem] sm:text-[1.08rem] font-bold text-text-dark">
              This Week
            </h2>
            <p className="text-[0.78rem] text-text-dark-secondary mt-0.5">
              Habits completed per day
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#e6f9f4] text-sf-teal px-3 py-1.5 rounded-full text-[0.78rem] font-bold">
            <TrendingUp size={13} />
            <span>{percentChange}</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-[130px] sm:h-[140px] mb-4">
          {weekData.map((d, i) => {
            const heightPercent = (d.completed / maxBar) * 100
            const isToday = i === todayMon
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-full max-w-[38px] rounded-lg relative"
                  style={{
                    background: isToday
                      ? 'linear-gradient(180deg, #2cb5a0 0%, #4dc9b4 100%)'
                      : '#d1f0ea',
                    minHeight: '8px',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                />
                <span
                  className={`text-[0.7rem] font-semibold ${
                    isToday ? 'text-sf-teal' : 'text-text-dark-secondary'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d1f0ea]" />
            <span className="text-[0.72rem] text-text-dark-secondary font-medium">
              Completed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sf-teal" />
            <span className="text-[0.72rem] text-text-dark-secondary font-medium">
              Today
            </span>
          </div>
        </div>
      </motion.div>

      {/* ====== Stats Row ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {/* Habits Completed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#e6f9f4] flex items-center justify-center mb-2.5">
            <span className="text-lg">✅</span>
          </div>
          <span className="text-[1.65rem] sm:text-[1.8rem] font-extrabold text-text-dark leading-none">
            {totalCompleted}
          </span>
          <span className="text-[0.75rem] text-text-dark-secondary font-medium mt-1">
            Habits Completed
          </span>
        </div>

        {/* Best Streak */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#e6f9f4] flex items-center justify-center mb-2.5">
            <Flame size={20} className="text-orange-400" />
          </div>
          <span className="text-[1.65rem] sm:text-[1.8rem] font-extrabold text-text-dark leading-none">
            {bestStreak}
          </span>
          <span className="text-[0.75rem] text-text-dark-secondary font-medium mt-1">
            Best Streak
          </span>
        </div>
      </motion.div>

      {/* ====== Streak Leaderboard ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-4 sm:mt-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⭐</span>
          <h3 className="text-[1.02rem] sm:text-[1.08rem] font-bold text-text-dark">
            Streak Leaderboard
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {leaderboard.map((habit, index) => (
            <motion.div
              key={habit.name}
              className="flex items-center gap-3.5 sm:gap-4 p-3 sm:p-3.5 rounded-xl bg-[#f7fdfb] border border-[#e8f5f3]"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
            >
              {/* Rank Medal */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shrink-0 shadow-sm">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                {habit.icon}
              </div>

              {/* Name */}
              <span className="flex-1 text-[0.9rem] sm:text-[0.93rem] font-semibold text-text-dark">
                {habit.name}
              </span>

              {/* Streak */}
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-orange-400" />
                <span className="text-[0.88rem] sm:text-[0.92rem] font-bold text-text-dark">
                  {habit.streak}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default StreakPage
