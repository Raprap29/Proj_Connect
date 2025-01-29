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
        <div className="w-full">
            <Navbar />
            <div className="ml-[0px] lg:ml-[257px]">
                <Outlet />
            </div>
        </div>
    )
}

export const LayoutCustomer = () => {
    return(
        <>
            <Outlet />
        </>
    )
}