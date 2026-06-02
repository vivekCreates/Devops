import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Plus, Check, X } from 'lucide-react'
import { useAuthStore } from '../states/auth'

interface Habit {
  id: number
  name: string
  icon: string
  streak: number
  done: boolean
}

const defaultHabits: Habit[] = [
  { id: 1, name: 'Morning Run', icon: '🏃', streak: 5, done: false },
  { id: 2, name: 'Read 20 Pages', icon: '📖', streak: 8, done: true },
  { id: 3, name: 'Meditate', icon: '🧘', streak: 3, done: false },
  { id: 4, name: 'Drink Water', icon: '💧', streak: 11, done: false },
]

const HomePage = () => {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitIcon, setNewHabitIcon] = useState('✨')

  const completedCount = habits.filter((h) => h.done).length
  const totalCount = habits.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const {user,logout} = useAuthStore();
  // Determine greeting based on time of day
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Streak (longest current streak)
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0)

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    )
  }

  const addHabit = () => {
    if (!newHabitName.trim()) return
    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName.trim(),
      icon: newHabitIcon,
      streak: 0,
      done: false,
    }
    setHabits((prev) => [...prev, newHabit])
    setNewHabitName('')
    setNewHabitIcon('✨')
    setShowAddModal(false)
  }

  // Progress ring calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percentage / 100)

  const emojiOptions = ['🏃', '📖', '🧘', '💧', '💪', '🎯', '🎨', '🎵', '✍️', '🧹', '🥗', '😴']

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'linear-gradient(180deg, #e8faf6 0%, #f0fdf9 30%, #f7fdfb 60%, #ffffff 100%)' }}>
      {/* ====== Header ====== */}
      <motion.header
        className="px-5 sm:px-6 pt-10 sm:pt-12 pb-2 flex items-center justify-between"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-[1.55rem] sm:text-[1.7rem] font-extrabold text-text-dark tracking-tight leading-tight">
            {greeting}, {user?.fullName} <span className="inline-block text-xl">👋</span>
          </h1>
          <p className="mt-1 text-[0.85rem] text-text-dark-secondary font-normal">
            You're on a roll! Keep it up 🔥
          </p>
        </div>
        <div onClick={()=>{
          logout()
        }
        } className="w-11 h-11 sm:w-xl sm:h-12 py-4 px-4 rounded-e-3xl bg-gradient-to-br from-sf-teal-light to-sf-teal flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
          Logout
        </div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sf-teal-light to-sf-teal flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
          {user?.fullName.charAt(0).toUpperCase()}
        </div>
      </motion.header>

      {/* ====== Daily Goal Card ====== */}
      <motion.div
        className="mx-5 sm:mx-6 mt-5 sm:mt-6 bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Progress Ring */}
        <div className="relative w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="#e8f5f3"
              strokeWidth="10"
            />
            <motion.circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="#2cb5a0"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[1.65rem] sm:text-[1.85rem] font-extrabold text-text-dark leading-none">
              {percentage}%
            </span>
            <span className="text-[0.7rem] text-text-dark-secondary mt-0.5">complete</span>
          </div>
        </div>

        {/* Goal Info */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[1.05rem] sm:text-lg font-bold text-text-dark">Daily Goal</h2>
          <p className="text-[0.82rem] sm:text-sm text-text-dark-secondary">
            {completedCount} of {totalCount} habits done today
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame size={15} className="text-orange-400" />
            <span className="text-[0.82rem] sm:text-sm font-semibold text-text-dark">
              {longestStreak} day streak
            </span>
          </div>
        </div>
      </motion.div>

      {/* ====== Today's Habits Section ====== */}
      <motion.div
        className="px-5 sm:px-6 mt-7 sm:mt-8 mb-3 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-[1.1rem] sm:text-lg font-bold text-text-dark">Today's Habits</h3>
        <span className="text-[0.82rem] sm:text-sm text-text-dark-secondary font-medium">
          {completedCount}/{totalCount} done
        </span>
      </motion.div>

      {/* Habit List */}
      <div className="flex-1 px-5 sm:px-6 pb-24 flex flex-col gap-3">
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              className={`flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                habit.done
                  ? 'bg-[#e6f9f4] shadow-[0_1px_8px_rgba(44,181,160,0.12)]'
                  : 'bg-white shadow-[0_1px_8px_rgba(0,0,0,0.05)]'
              }`}
              onClick={() => toggleHabit(habit.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, delay: 0.1 * index + 0.4 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Icon */}
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                habit.done ? 'bg-[#d0f0e8]' : 'bg-[#f0f7f5]'
              }`}>
                {habit.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-[0.92rem] sm:text-[0.95rem] font-semibold leading-tight ${
                  habit.done ? 'text-text-dark/60 line-through' : 'text-text-dark'
                }`}>
                  {habit.name}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <Flame size={12} className="text-orange-400" />
                  <span className="text-[0.75rem] sm:text-[0.78rem] text-sf-teal font-semibold">
                    {habit.streak} days
                  </span>
                </div>
              </div>

              {/* Check Circle */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                habit.done
                  ? 'bg-sf-teal border-sf-teal'
                  : 'border-gray-200 bg-white hover:border-sf-teal/40'
              }`}>
                {habit.done && <Check size={16} className="text-white" strokeWidth={3} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ====== Floating Add Button ====== */}
      <motion.button
        className="fixed bottom-6 right-5 sm:right-6 h-12 px-5 bg-surface-dark text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.25)] cursor-pointer z-50 hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)] active:scale-95 transition-shadow duration-300"
        id="add-habit-btn"
        onClick={() => setShowAddModal(true)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.93 }}
      >
        <Plus size={18} strokeWidth={2.5} />
        Add Habit
      </motion.button>

      {/* ====== Add Habit Modal ====== */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-8 pointer-events-none"
            >
              <motion.div
                className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-[0_16px_60px_rgba(0,0,0,0.18)] relative pointer-events-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer"
                onClick={() => setShowAddModal(false)}
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-bold text-text-dark mb-5">New Habit</h3>

              {/* Habit Name */}
              <label className="text-[0.82rem] font-medium text-text-dark-secondary mb-1.5 block">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g. Morning Yoga"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-text-dark text-[0.92rem] font-medium outline-none transition-all duration-200 focus:border-sf-teal focus:ring-2 focus:ring-sf-teal/15 placeholder:text-gray-300"
                id="new-habit-name"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              />

              {/* Emoji Picker */}
              <label className="text-[0.82rem] font-medium text-text-dark-secondary mt-4 mb-2 block">
                Choose an Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      newHabitIcon === emoji
                        ? 'bg-sf-teal/15 ring-2 ring-sf-teal scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setNewHabitIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Add Button */}
              <motion.button
                className="w-full h-12 mt-6 bg-surface-dark text-white rounded-xl text-[0.92rem] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                onClick={addHabit}
                disabled={!newHabitName.trim()}
                whileTap={{ scale: 0.97 }}
                id="confirm-add-habit-btn"
              >
                <Plus size={18} />
                Add Habit
              </motion.button>
            </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
