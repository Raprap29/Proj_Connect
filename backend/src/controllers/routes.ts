import userRoutes from "./users/routes";
import employeeRoutes from "./employee/routes";
import aiRoutes from "./AiController/routes";
export const routes = [userRoutes, employeeRoutes, aiRoutes] as const

export type AppRoutes = (typeof routes)[number];