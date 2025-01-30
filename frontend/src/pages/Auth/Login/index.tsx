import { Socket } from "socket.io-client";
import LoginAdmin from "./admin";
import LoginContainterButton from "../../../components/container/LoginContainter";
import OptionButton from "./components/optionalButton";
import { useContext } from "react";
import { ContextData } from "../../../context/AppContext";
import LoginCustomer from "./customer";

interface SocketProps {
    socket: Socket;
}


const Login: React.FC<SocketProps> = ({ socket }) => {

    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }

    const { toggleForm } = context;

    return (
        <>
            <div className='bg-[#003366] h-[100vh] w-full'>
                <OptionButton />
                <LoginContainterButton>
                    <LoginAdmin socket={socket} toggleModal={toggleForm} />
                    <LoginCustomer socket={socket} toggleModal={toggleForm} />
                </LoginContainterButton>
            </div>
        </>
    )
}

export default Login;