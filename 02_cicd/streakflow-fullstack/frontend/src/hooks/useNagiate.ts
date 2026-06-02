import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constant";

export const useNavigator = () => {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate(ROUTES.HOME),
    goToLogin: () => navigate(ROUTES.LOGIN),
    goToRegister: () => navigate(ROUTES.REGISTER),
    goToDashboard: () => navigate(ROUTES.DASHBOARD),
    goToStreak: () => navigate(ROUTES.STREAK),

    back: () => navigate(-1),
    forward: () => navigate(1),

    navigate,
  };
};