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

const Navbar = () => {
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
            <aside id="sidebar" className="fixed top-0 border-1 border-gray-300 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/message" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <span className="flex-1 ms-3 whitespace-nowrap">Message</span>
                            </a>
                        </li>
                        <li>
                            <a href="/maintenance/employees" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <span className="flex-1 ms-3 whitespace-nowrap">Manage Employees</span>
                            </a>
                        </li>
                        <li>
                            <a href="/maintenance/users" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <span className="flex-1 ms-3 whitespace-nowrap">Manage Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                            </a>
                        </li>
                        <li>
                            <button onClick={handleLogout} type="button" className="flex w-full items-center text-start cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}


export default Navbar;