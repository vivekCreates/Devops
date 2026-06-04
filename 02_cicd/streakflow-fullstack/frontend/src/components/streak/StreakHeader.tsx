import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { Habit } from '../../store/habitStore'

interface Props {
  habit?: Habit;
}

export const StreakHeader = ({ habit }: Props) => (
  <div
    className="relative rounded-b-[2rem] overflow-hidden pb-8 pt-8 sm:pt-10 px-5 sm:px-6"
    style={{
      background: 'linear-gradient(160deg, #2cb5a0 0%, #4dc9b4 40%, #7dd8c8 100%)',
    }}
  >
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl sm:text-[2rem] mb-3">
        {habit?.icon || '🎯'}
      </div>
      <h1 className="text-xl sm:text-[1.4rem] font-extrabold text-white tracking-tight">
        {habit?.name || 'My Habit'}
      </h1>
      <div className="flex items-center gap-1.5 mt-2">
        <Clock size={14} className="text-white/70" />
        <p className="text-[0.82rem] sm:text-sm text-white/75 font-medium">
          {habit?.reminderTime
            ? `Scheduled at ${habit.reminderTime}`
            : 'No schedule set'}
        </p>
      </div>
    </motion.div>
  </div>
);
