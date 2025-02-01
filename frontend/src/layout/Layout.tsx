import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Loading from "../components/loading";
import { useContext } from "react";
import { ContextData } from "../context/AppContext";
import NavbarCustomer from "../components/navbarCustomer";

export const Layout = () => {
    return (
        <>
            <Outlet />
        </>
    )
}

export const LayoutPrivate = () => {
    
    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }

    const { showLoading } = context;
    
    return(
        <div className="w-full mb-5">
            <Loading loading={showLoading} />
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
            <NavbarCustomer />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    )
}