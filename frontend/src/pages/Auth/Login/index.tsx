import {useState, ChangeEvent, FormEvent} from 'react'
import { Link } from 'react-router-dom';
import { useLoginUserMutation } from '../../../api/UserApi';
import { useNavigate } from 'react-router-dom';

import { Socket } from "socket.io-client";

interface SocketProps {
    socket: Socket;
}

interface FormProps {
    username: string;
    password: string;
}

const Login: React.FC<SocketProps> = ({ socket }) => {
    
    const navigate = useNavigate();

    const [loginUser, {isLoading: LoginLoading, error: LoginError}] = useLoginUserMutation();

    const [form, setForm] = useState<FormProps>({
        username: '',
        password: '',
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try{
            const {username, password} = form;

            if(username === "" || password === ""){
                return alert("Please input all field");
            }

            const { data } = await loginUser({
                username: username,
                password: password,
            });
            setForm({
                username: '',
                password: '',
            })

            if(data.token){

                await socket.emit('login', {
                    username: data.username,
                    id: data.id,
                });

                navigate('/dashboard');
            }
            
        }catch(e){
            console.log(LoginError);
            console.error(e);
        }
    }

    return (
        <>
            <div className='bg-[#003366] flex justify-center items-center h-[100vh] w-full'>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white w-full p-5 rounded-lg">
                    <h1 className='font-medium text-center text-3xl mb-2'>LOGIN</h1>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" value={form.username} onChange={handleChange} name="username" id="floating_username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                    </div>
                    <div className="relative z-0 w-full mb-2 group">
                        <input type="password" value={form.password} onChange={handleChange} name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>
                    <div className='mb-4'>
                        <Link to="/" className='text-sm text-gray-500 hover:underline hover:text-blue-600 transition duration-300 ease-in-out'>Forgot password</Link>
                    </div>
                    <div className='w-full mt-5'>
                        <button type="submit" className={`${LoginLoading ? 'pointer-events-none' : ''} text-white w-full bg-green-700 py-3 rounded-lg font-medium cursor-pointer`}>{LoginLoading ? 'Loading...' : 'Login'}</button>
                    </div>
                    <div className='mb-4 text-sm mt-6 text-center'>
                    Don't have an account? <Link to="/register" className='text-sm text-gray-500 hover:underline hover:text-blue-600 transition duration-300 ease-in-out'>Register</Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;