import { create } from "zustand";
import type { Habit } from "./habitStore";
import { getActivityHeatmapApi, getDashboardStatsApi, getHabitLeaderboardApi, getWeeklyProgressApi } from "../api/stats";



export interface DashboardUser {
  id: string;
  fullName: string;
  timezone: string;
}

export interface DashboardTodayStats {
  localDate: string;
  completedHabits: number;
  totalHabits: number;
  completionRate: number;
}

export interface StreakFreeze {
  monthlyCredits: number;
}
export interface DashboardWeeklyProgress {
    date: string;
    completedHabits: number;
}

export interface DashboardActivityHeatmap {
  date: string;
  completions: number;
  status: "done" | "missed" | "partial";
}


export interface WeeklyProgress {
    startDate: string;
    endDate: string;
    series:{
        date: string;
        completedHabits: number;
    }
}

export interface ActivityHeatmap {
  startDate: string;
    endDate: string;
    activities: {  
        date: string;
        completions: number;
        status: "done" | "missed" | "partial";
    }[]
}


export interface LeaderboardItem {
  habitId: string;
  name: string;
  icon: string;
  currentStreak: number;
  bestStreak: number;
}

export interface Stats {
  totalCompletions: number;
  bestStreak: number;
  weeklyProgress: DashboardWeeklyProgress[];
  activityHeatmap: DashboardActivityHeatmap[];
  leaderboard: LeaderboardItem[];
}

export interface DashboardResponse {
  user: DashboardUser;
  today:DashboardTodayStats;
  habits: Habit[];
  streakFreeze: StreakFreeze;
  stats: Stats;
}


interface StatState {
    dashboardData: DashboardResponse | null;
    weeklyProgress: WeeklyProgress[];
    activityHeatmap: ActivityHeatmap[];
    habitLeaderboard: LeaderboardItem[];
    isLoading: boolean;
    error: string | null;

    getDashboardStats: () => Promise<void>;
    getWeeklyProgress: () => Promise<void>;
    getActivityHeatmap: () => Promise<void>;
    getHabitLeaderboard: () => Promise<void>;
}

export const useStatStore = create<StatState>((set,get) => ({
    dashboardData: null,
    isLoading: false,
    error: null,
    weeklyProgress: [],
    activityHeatmap: [],
    habitLeaderboard: [],

    getDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try{
            const {data} = await getDashboardStatsApi();
            console.log("Dashboard Stats Response:", data);
            if(!data.success) {
                throw new Error(data.message || "Failed to fetch dashboard stats");
            }
            set({ dashboardData: data.data, isLoading: false });
        }catch(error:any) {
            set({ error: error.message || "Failed to fetch dashboard stats" });
        }
    },

    getWeeklyProgress: async () => {
        set({ isLoading: true, error: null });
        try{
            const {data} = await getWeeklyProgressApi();
            console.log("Weekly Progress Response:", data);

            if(!data.success) {
                throw new Error(data.message || "Failed to fetch weekly progress");
            }
            set({ weeklyProgress: data.data, isLoading: false });
        }catch(error:any) {
            set({ error: error.message || "Failed to fetch weekly progress" });
        }   
    },

    getActivityHeatmap: async () => {
        set({ isLoading: true, error: null });
        try{
            const {data} = await getActivityHeatmapApi();
            console.log("Activity Heatmap Response:", data);
            if(!data.success) {
                throw new Error(data.message || "Failed to fetch activity heatmap");
            }
            set({ activityHeatmap: data.data, isLoading: false });
        }catch(error:any) {
            set({ error: error.message || "Failed to fetch activity heatmap" });
        }
    },
    getHabitLeaderboard: async () => {
        set({ isLoading: true, error: null });
        try{
            const {data} = await getHabitLeaderboardApi();
            console.log("Habit Leaderboard Response:", data);
            if(!data.success) {
                throw new Error(data.message || "Failed to fetch habit leaderboard");
            }
            set({ habitLeaderboard: data.data, isLoading: false });
        }catch(error:any) {
            set({ error: error.message || "Failed to fetch habit leaderboard" });
        }
    },
}));