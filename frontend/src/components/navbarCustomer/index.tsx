import { useDispatch } from "react-redux";
import { logout } from "../../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../authToken/helperAuth";
import { jwtDecode } from "jwt-decode";
import {io} from "socket.io-client";

const URL = 'ws://localhost:5000';

const socket = io(URL, {
    reconnection: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
});

interface UserProps {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    auth: boolean;
    exp: number; // Expiration time as a Unix timestamp (seconds)
}

const NavbarCustomer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const token = getAuthToken();
       
        try{
           if(token){
                const res: UserProps = jwtDecode(token); 
                const response = dispatch(logout());
                await socket.emit('logout', {
                    username: res.username,
                    id: res.id,
                });
                
                if(response){
                    navigate('/');
                }
           }
        }catch(e){
            return console.error(e);
        }
    }

    return (
        <>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Customer Service AI Help</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button type="button" onClick={handleLogout} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log Out</button>
                </div>
            </div>
        </nav>

        </>
    )
}


export default NavbarCustomer;