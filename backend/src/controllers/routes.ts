import userRoutes from "./users/routes";

export const routes = [userRoutes] as const

export type AppRoutes = (typeof routes)[number];