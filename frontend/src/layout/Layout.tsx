import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export const Layout = () => {
    return (
        <>
            <Outlet />
        </>
    )
}

export const LayoutPrivate = () => {
    return(
        <div className="flex">
            <Navbar />
            <div className="ml-[270px]">
                <Outlet />
            </div>
        </div>
    )
}