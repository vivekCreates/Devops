import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Pencil, Trash2, Flame, Trophy, Snowflake, Check, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock activity data for last 31 days
const generateActivityData = () => {
  const today = new Date()
  const data: { date: Date; status: 'completed' | 'missed' | 'upcoming' }[] = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    let status: 'completed' | 'missed' | 'upcoming'
    if (i === 0) {
      status = 'upcoming'
    } else if (i <= 5) {
      status = 'completed'
    } else if (i <= 8) {
      status = Math.random() > 0.3 ? 'completed' : 'missed'
    } else {
      status = Math.random() > 0.25 ? 'completed' : 'missed'
    }
    data.push({ date: d, status })
  }
  // Mark today as upcoming
  data[data.length - 1].status = 'upcoming'
  return data
}

const HabitDetailPage = () => {
  const navigate = useNavigate()
  const [markedToday, setMarkedToday] = useState(false)
  const [freezesLeft, setFreezesLeft] = useState(2)
  const [activityData] = useState(generateActivityData)

  const habitName = 'Morning Run'
  const habitIcon = '🏃'
  const habitSchedule = 'Daily · 07:00 AM'
  const currentStreak = 12
  const bestStreak = 18

  const handleMarkComplete = () => {
    setMarkedToday(true)
  }

  const handleUseFreeze = () => {
    if (freezesLeft > 0) {
      setFreezesLeft((prev) => prev - 1)
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background:
          'linear-gradient(180deg, #e8faf6 0%, #f0fdf9 30%, #f7fdfb 60%, #ffffff 100%)',
      }}
    >
      {/* ====== Gradient Header ====== */}
      <div
        className="relative rounded-b-[2rem] overflow-hidden pb-8 pt-8 sm:pt-10 px-5 sm:px-6"
        style={{
          background: 'linear-gradient(160deg, #2cb5a0 0%, #4dc9b4 40%, #7dd8c8 100%)',
        }}
      >
        {/* Top Nav */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
              <Pencil size={16} />
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </motion.div>

        {/* Habit Info */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl sm:text-[2rem] mb-3">
            {habitIcon}
          </div>
          <h1 className="text-xl sm:text-[1.4rem] font-extrabold text-white tracking-tight">
            {habitName}
          </h1>
          <p className="text-[0.82rem] sm:text-sm text-white/75 mt-1 font-medium">
            {habitSchedule}
          </p>
        </motion.div>
      </div>

      {/* ====== Current Streak Card ====== */}
      <motion.div
        className="mx-5 sm:mx-6 -mt-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative z-10"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="text-[0.68rem] sm:text-[0.72rem] font-bold tracking-[0.15em] text-text-dark-secondary uppercase mb-2">
          Current Streak
        </span>

        <div className="flex items-center gap-1.5 mb-0.5">
          <Flame size={22} className="text-orange-400" />
          <span className="text-[2rem] sm:text-[2.2rem] font-extrabold text-text-dark leading-none">
            {currentStreak}
          </span>
        </div>
        <span className="text-[0.8rem] sm:text-[0.85rem] text-text-dark-secondary font-semibold mb-2">
          Day Streak
        </span>

        <div className="flex items-center gap-1.5 bg-[#fef9e7] px-3 py-1 rounded-full">
          <Trophy size={12} className="text-amber-500" />
          <span className="text-[0.75rem] sm:text-[0.78rem] font-bold text-amber-600">
            Best: {bestStreak} days
          </span>
        </div>
      </motion.div>

      {/* ====== Activity Grid ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-6 sm:mt-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[1.05rem] sm:text-[1.1rem] font-bold text-text-dark">
              Activity
            </h3>
            <p className="text-[0.75rem] text-text-dark-secondary mt-0.5">
              Last 31 days
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Calendar size={16} className="text-text-dark-secondary" />
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-7 gap-[5px] sm:gap-[6px] justify-items-center max-w-[280px] mx-auto">
            {activityData.map((day, i) => {
              const isToday = i === activityData.length - 1
              let bg = ''
              let border = ''
              if (markedToday && isToday) {
                bg = 'bg-sf-teal'
              } else if (day.status === 'completed') {
                bg = 'bg-sf-teal'
              } else if (day.status === 'missed') {
                bg = 'bg-red-200'
              } else {
                bg = 'bg-[#e0f5f0]'
                border = 'border-[1.5px] border-dashed border-sf-teal/40'
              }

              return (
                <motion.div
                  key={i}
                  className={`w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-md sm:rounded-lg ${bg} ${border} transition-all duration-200`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.35 + i * 0.012 }}
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 sm:gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-sf-teal" />
              <span className="text-[0.7rem] text-text-dark-secondary font-medium">
                Completed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-200" />
              <span className="text-[0.7rem] text-text-dark-secondary font-medium">
                Missed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#e0f5f0] border border-dashed border-sf-teal/40" />
              <span className="text-[0.7rem] text-text-dark-secondary font-medium">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ====== Streak Freeze ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-4 sm:mt-5 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex items-center gap-3.5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
          <Snowflake size={22} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[0.9rem] sm:text-[0.95rem] font-bold text-text-dark">
            Streak Freeze
          </h4>
          <p className="text-[0.75rem] sm:text-[0.78rem] text-text-dark-secondary mt-0.5">
            {freezesLeft} freezes left this month
          </p>
        </div>
        <button
          className={`px-4 py-2 rounded-xl text-[0.82rem] sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            freezesLeft > 0
              ? 'text-sf-teal bg-[#e6f9f4] hover:bg-[#d4f3ec] active:scale-95'
              : 'text-gray-300 bg-gray-100 cursor-not-allowed'
          }`}
          onClick={handleUseFreeze}
          disabled={freezesLeft === 0}
        >
          Use
        </button>
      </motion.div>

      {/* ====== Spacer ====== */}
      <div className="flex-1 min-h-6" />

      {/* ====== Mark Today Complete Button ====== */}
      <motion.div
        className="px-5 sm:px-6 pb-8 sm:pb-10 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <motion.button
          className={`w-full h-[52px] sm:h-14 rounded-2xl text-[0.95rem] sm:text-base font-bold flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 ${
            markedToday
              ? 'bg-sf-teal text-white shadow-[0_4px_20px_rgba(44,181,160,0.35)]'
              : 'bg-surface-dark text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:translate-y-0'
          }`}
          onClick={handleMarkComplete}
          whileTap={{ scale: 0.97 }}
          id="mark-complete-btn"
          disabled={markedToday}
        >
          <Check size={20} strokeWidth={2.5} />
          {markedToday ? 'Completed Today! 🎉' : 'Mark Today Complete'}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default HabitDetailPage
