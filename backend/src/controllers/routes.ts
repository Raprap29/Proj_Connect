import userRoutes from "./users/routes";
import employeeRoutes from "./employee/routes";

export const routes = [userRoutes, employeeRoutes] as const

export type AppRoutes = (typeof routes)[number];