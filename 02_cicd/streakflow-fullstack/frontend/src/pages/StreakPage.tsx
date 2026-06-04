import { useEffect, useState, useCallback } from 'react'
import { useStatStore } from '../store/statStore'
import { useHabitStore } from '../store/habitStore'
import Loader from '../components/Loader'
import { StreakHeader } from '../components/streak/StreakHeader'
import { StreakCurrentCard } from '../components/streak/StreakCurrentCard'
import { StreakActivityGrid } from '../components/streak/StreakActivityGrid'
import { StreakFreezeCard } from '../components/streak/StreakFreezeCard'
import { StreakMarkComplete } from '../components/streak/StreakMarkComplete'

const StreakPage = () => {
  const { dashboardData, getDashboardStats } = useStatStore();
  const { freezeHabit, completeHabit, isLoading } = useHabitStore();

  const habit = dashboardData?.habits?.[0];

  useEffect(() => {
    getDashboardStats();
  }, [getDashboardStats]);

  const [markedToday, setMarkedToday] = useState(false);
  
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
        background: 'linear-gradient(180deg, #e8faf6 0%, #f0fdf9 30%, #f7fdfb 60%, #ffffff 100%)',
      }}
    >
      <StreakHeader habit={habit} />
      
      <StreakCurrentCard 
        totalCompletions={dashboardData.stats.totalCompletions}
        bestStreak={dashboardData.stats.bestStreak}
      />

      <StreakActivityGrid 
        heatmap={heatmap || []}
        markedToday={markedToday}
      />

      <StreakFreezeCard 
        freezesLeft={freezesLeft}
        isLoading={isLoading}
        isActionTakenToday={isActionTakenToday}
        todayStatus={todayStatus}
        markedToday={markedToday}
        onUseFreeze={handleUseFreeze}
      />

      <div className="flex-1 min-h-6" />

      <StreakMarkComplete 
        isActionTakenToday={isActionTakenToday}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  )
}

export default StreakPage
