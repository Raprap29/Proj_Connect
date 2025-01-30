import { useContext } from "react";
import { ContextData } from "../../../../context/AppContext";

const OptionButton = () => {

    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }

    const { setToggleForm, toggleForm } = context;

    const handleToggleModal = () => {
        setToggleForm(!toggleForm);
    }

    return (
        <div className='flex justify-center gap-x-5 pt-12'>
            <div>
                <button type="button" onClick={handleToggleModal} className={`${!toggleForm ? 'bg-blue-500 text-white' : 'bg-white text-black'}  font-bold w-[200px] h-[80px] text-2xl cursor-pointer transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white border-amber-400 border-2 rounded-lg shadow-2xl`}>ADMIN</button>
            </div>
            <div>
                <button type="button" onClick={handleToggleModal} className={`${toggleForm ? 'bg-blue-500 text-white' : 'bg-white text-black'}  font-bold w-[200px] h-[80px] text-2xl cursor-pointer transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white border-amber-400 border-2 rounded-lg shadow-2xl`}>CUSTOMER</button>
            </div>
        </div>
    )
}

export default OptionButton;
