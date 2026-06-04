import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { useStatStore } from "../store/statStore";
import Loader from "../components/Loader";


const DashboardPage = () => {
  const {getDashboardStats,dashboardData,isLoading} = useStatStore();

  useEffect(() => {
    getDashboardStats()
  }, []);

  if (!dashboardData) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#e8faf6] to-white">
        <Loader variant="inline" message="Loading dashboard" />
      </div>
    );
  }

  const { user, today, stats } = dashboardData;

  const todayDateStr = today.localDate;

  const maxBar = Math.max(
    ...stats.weeklyProgress.map((d) => d.completedHabits),
    1
  );

  return (
    <div className="min-h-[100dvh] flex flex-col pb-10 bg-gradient-to-b from-[#e8faf6] to-white">

      {/* HEADER */}
      <motion.div
        className="px-6 pt-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">
          Your Progress 📊
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Keep going, {user.fullName}
        </p>
      </motion.div>

      {/* TODAY CARD */}
      <div className="mx-6 mt-6 bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {today.completedHabits} / {today.totalHabits}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sf-teal font-semibold">
            <TrendingUp size={18} />
            {today.completionRate}%
          </div>
        </div>
      </div>

      {/* WEEKLY CHART */}
      <div className="mx-6 mt-6 bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-4">Weekly Progress</h3>

        <div className="flex items-end gap-2 h-[140px]">
          {stats.weeklyProgress.map((day, i) => {
            const height = (day.completedHabits / maxBar) * 100;
            const isToday = day.date === todayDateStr;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full">
                <motion.div
                  className={`w-full rounded-lg ${
                    isToday ? "bg-sf-teal" : "bg-sf-teal/20"
                  }`}
                  style={{ minHeight: "6px" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />

                <span className="text-[10px] mt-1 text-gray-500">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="mx-6 mt-6 grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalCompletions}
          </div>
          <p className="text-sm text-gray-500">Total Completions</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <div className="flex justify-center items-center gap-1 text-orange-500 font-bold text-2xl">
            <Flame size={20} />
            {stats.bestStreak}
          </div>
          <p className="text-sm text-gray-500">Best Streak</p>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="mx-6 mt-6 bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-4">Leaderboard</h3>

        <div className="flex flex-col gap-3">
          {dashboardData && dashboardData.stats?.leaderboard.map((h, index) => (
            <div
              key={h.habitId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>

                <span className="text-lg">{h.icon}</span>

                <span className="font-medium text-gray-700">
                  {h.name}
                </span>
              </div>

              <div className="flex items-center gap-1 text-orange-500 font-semibold">
                <Flame size={14} />
                {h.currentStreak}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;