import { HabitStatus } from "@prisma/client";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { addDaysToLocalDate, getTodayLocalDate } from "../../utils/date.js";
import { ensureMonthlyFreezeCredits, getUserOrThrow } from "../users/user.service.js";

const getSummaryNumbers = async (userId: string) => {
  const [totalCompletions, bestStreakAgg] = await Promise.all([
    prisma.habitCompletion.count({
      where: { userId },
    }),
    prisma.habitProgress.aggregate({
      where: {
        habit: {
          userId,
          status: HabitStatus.ACTIVE,
        },
      },
      _max: {
        bestStreak: true,
      },
    }),
  ]);

  return {
    totalCompletions,
    bestStreak: bestStreakAgg._max.bestStreak ?? 0,
  };
};

export const getWeeklyProgress = async (userId: string) => {
  const user = await getUserOrThrow(userId);
  const today = getTodayLocalDate(user.timezone);
  const startDate = addDaysToLocalDate(today, -6);

  const grouped = await prisma.habitCompletion.groupBy({
    by: ["localDate"],
    where: {
      userId,
      localDate: {
        gte: startDate,
        lte: today,
      },
    },
    _count: { _all: true },
  });

  const countByDate = new Map(grouped.map((entry) => [entry.localDate, entry._count._all]));
  const series = Array.from({ length: 7 }, (_, offset) => {
    const date = addDaysToLocalDate(startDate, offset);
    return {
      date,
      completedHabits: countByDate.get(date) ?? 0,
    };
  });

  return {
    startDate,
    endDate: today,
    series,
  };
};

export const getActivityHeatmap = async (userId: string) => {
  const user = await getUserOrThrow(userId);
  const today = getTodayLocalDate(user.timezone);
  const startDate = addDaysToLocalDate(today, -30);

  const grouped = await prisma.habitCompletion.groupBy({
    by: ["localDate"],
    where: {
      userId,
      localDate: {
        gte: startDate,
        lte: today,
      },
    },
    _count: { _all: true },
  });

  const countByDate = new Map(grouped.map((entry) => [entry.localDate, entry._count._all]));
  const activity = Array.from({ length: 31 }, (_, offset) => {
    const date = addDaysToLocalDate(startDate, offset);
    const completions = countByDate.get(date) ?? 0;

    return {
      date,
      completions,
      status: completions > 0 ? "completed" : "missed",
    };
  });

  return {
    startDate,
    endDate: today,
    activity,
  };
};

export const getHabitLeaderboard = async (userId: string) => {
  const habits = await prisma.habit.findMany({
    where: {
      userId,
      status: HabitStatus.ACTIVE,
    },
    include: {
      progress: true,
    },
  });

  return habits
    .map((habit) => ({
      habitId: habit.id,
      name: habit.name,
      icon: habit.icon,
      currentStreak: habit.progress?.currentStreak ?? 0,
      bestStreak: habit.progress?.bestStreak ?? 0,
    }))
    .sort((a, b) => b.currentStreak - a.currentStreak || b.bestStreak - a.bestStreak)
    .slice(0, 10);
};

export const getDashboard = async (userId: string) => {
  await ensureMonthlyFreezeCredits(userId);
  const user = await getUserOrThrow(userId);
  const today = getTodayLocalDate(user.timezone);

  const habits = await prisma.habit.findMany({
    where: {
      userId,
      status: HabitStatus.ACTIVE,
    },
    include: {
      progress: true,
      completions: {
        where: {
          localDate: today,
        },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!habits) {
    throw new AppError("Unable to load dashboard", 500);
  }

  const completedToday = habits.filter((habit) => habit.completions.length > 0).length;
  const completionRate = habits.length === 0 ? 0 : Math.round((completedToday / habits.length) * 100);
  const [weeklyProgress, heatmap, leaderboard, summary] = await Promise.all([
    getWeeklyProgress(userId),
    getActivityHeatmap(userId),
    getHabitLeaderboard(userId),
    getSummaryNumbers(userId),
  ]);

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      timezone: user.timezone,
    },
    today: {
      localDate: today,
      completedHabits: completedToday,
      totalHabits: habits.length,
      completionRate,
    },
    habits: habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      completedToday: habit.completions.length > 0,
      currentStreak: habit.progress?.currentStreak ?? 0,
      bestStreak: habit.progress?.bestStreak ?? 0,
      reminderEnabled: habit.reminderEnabled,
      reminderTime: habit.reminderTime,
    })),
    streakFreeze: {
      monthlyCredits: user.streakFreezeCredits,
    },
    stats: {
      totalCompletions: summary.totalCompletions,
      bestStreak: summary.bestStreak,
      weeklyProgress: weeklyProgress.series,
      activityHeatmap: heatmap.activity,
      leaderboard,
    },
  };
};
