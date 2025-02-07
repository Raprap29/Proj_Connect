import userRoutes from "./users/routes";
import employeeRoutes from "./employee/routes";
import aiRoutes from "./AiController/routes";
import messageRouters from "./MessageController/routes";
export const routes = [userRoutes, employeeRoutes, aiRoutes, messageRouters] as const

export type AppRoutes = (typeof routes)[number];