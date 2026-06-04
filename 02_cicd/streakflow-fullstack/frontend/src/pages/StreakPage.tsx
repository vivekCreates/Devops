import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Snowflake, Check, Calendar, Clock } from 'lucide-react'
import { useStatStore } from '../store/statStore'
import { useHabitStore } from '../store/habitStore'
import Loader from '../components/Loader'


const StreakPage = () => {

  const {dashboardData,getDashboardStats} = useStatStore();
  const {freezeHabit, completeHabit, isLoading} = useHabitStore();

  // Get the first habit's data for display
  const habit = dashboardData?.habits?.[0]

  useEffect(()=>{
    getDashboardStats()
  },[])

  const [markedToday, setMarkedToday] = useState(false)
  
  const freezesLeft = dashboardData?.streakFreeze?.monthlyCredits ?? 0;
  
  const heatmap = dashboardData?.stats?.activityHeatmap;
  const todayStatus = heatmap?.[heatmap?.length - 1]?.status;
  const isActionTakenToday = todayStatus === 'completed' || todayStatus === 'frozen' || markedToday;

  const handleMarkComplete = useCallback(async () => {
    if (habit) {
      try {
        await completeHabit(habit.id);
        setMarkedToday(true);
        await getDashboardStats();
      } catch (error) {
        console.error(error);
      }
    } else {
      setMarkedToday(true);
    }
  }, [habit, completeHabit, getDashboardStats]);

  const handleUseFreeze = useCallback(async () => {
    if (freezesLeft > 0 && habit) {
      try {
        await freezeHabit(habit.id);
        await getDashboardStats();
      } catch (error) {
        console.error(error);
      }
    }
  }, [freezesLeft, habit, freezeHabit, getDashboardStats]);

  const renderedHeatmap = useMemo(() => {
    const heatmapData = dashboardData?.stats?.activityHeatmap;
    if (!heatmapData || heatmapData.length === 0) return null;

    // Calculate blanks to align with weekday
    const firstDate = new Date(heatmapData[0].date + 'T00:00:00');
    const startDay = (firstDate.getDay() + 6) % 7; // Monday = 0
    
    const blanks = Array.from({ length: startDay }).map((_, i) => (
      <div key={`blank-${i}`} className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px]" />
    ));

    const days = heatmapData.map((day, i) => {
      const isToday = i === heatmapData.length - 1
      let bg = ''
      let border = ''
      if (markedToday && isToday) {
        bg = 'bg-sf-teal'
      } else if (day.status === 'completed') {
        bg = 'bg-sf-teal'
      } else if (day.status === 'frozen') {
        bg = 'bg-blue-400'
      } else if (day.status === 'missed') {
        bg = 'bg-sf-coral/40'
      } else {
        bg = 'bg-[#e0f5f0]'
        border = 'border-[1.5px] border-dashed border-sf-teal/40'
      }

      return (
        <motion.div
          key={`day-${i}`}
          className={`flex items-center justify-center w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-md sm:rounded-lg ${bg} ${border} transition-all duration-200`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.35 + i * 0.012 }}
        >
          <span className={`text-[10px] font-medium ${bg === 'bg-sf-teal' || bg === 'bg-blue-400' ? 'text-white/95' : 'text-gray-600'}`}>
            {new Date(day.date + 'T00:00:00').getDate()}
          </span>
        </motion.div>
      )
    });

    return [...blanks, ...days];
  }, [dashboardData?.stats?.activityHeatmap, markedToday]);

  if (!dashboardData) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#e8faf6] to-white">
        <Loader variant="inline" message="Loading streak" />
      </div>
    );
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


        {/* Habit Info */}
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
            {dashboardData?.stats.totalCompletions}
          </span>
        </div>
        <span className="text-[0.8rem] sm:text-[0.85rem] text-text-dark-secondary font-semibold mb-2">
          Day Streak
        </span>

        <div className="flex items-center gap-1.5 bg-[#fef9e7] px-3 py-1 rounded-full">
          <Trophy size={12} className="text-amber-500" />
          <span className="text-[0.75rem] sm:text-[0.78rem] font-bold text-amber-600">
            Best: {dashboardData?.stats.bestStreak} days
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
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-[5px] sm:gap-[6px] justify-items-center max-w-[280px] mx-auto mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-[10px] font-semibold text-gray-400">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[5px] sm:gap-[6px] justify-items-center max-w-[280px] mx-auto">
            {renderedHeatmap}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-sf-teal" />
              <span className="text-[0.7rem] text-text-dark-secondary font-medium">
                Completed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-400" />
              <span className="text-[0.7rem] text-text-dark-secondary font-medium">
                Frozen
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-sf-coral/40" />
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
            freezesLeft > 0 && !isLoading && !isActionTakenToday
              ? 'text-sf-teal bg-[#e6f9f4] hover:bg-[#d4f3ec] active:scale-95'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
          onClick={handleUseFreeze}
          disabled={freezesLeft === 0 || isLoading || isActionTakenToday}
        >
          {isLoading 
            ? 'Wait...' 
            : todayStatus === 'frozen' 
              ? 'Used' 
              : todayStatus === 'completed' || markedToday 
                ? 'Done' 
                : 'Use'}
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
            isActionTakenToday
              ? 'bg-sf-teal text-white shadow-[0_4px_20px_rgba(44,181,160,0.35)] cursor-not-allowed'
              : 'bg-surface-dark text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:translate-y-0'
          }`}
          onClick={handleMarkComplete}
          whileTap={{ scale: isActionTakenToday ? 1 : 0.97 }}
          id="mark-complete-btn"
          disabled={isActionTakenToday}
        >
          <Check size={20} strokeWidth={2.5} />
          {isActionTakenToday ? 'Completed Today! 🎉' : 'Mark Today Complete'}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default StreakPage
