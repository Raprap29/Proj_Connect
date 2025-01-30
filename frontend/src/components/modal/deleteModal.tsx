import React, { ReactNode, useEffect, useContext } from 'react';
import "../../assets/style/modal.css";
import { FaTimes } from "react-icons/fa";
import { ContextData } from '../../context/AppContext';
interface PropsModal {
    children: ReactNode;
    color: string;
    text: string;
}

const DeleteModal: React.FC<PropsModal> = ({ children, color, text }) => {

    const context = useContext(ContextData);
    
    if(!context){
        throw new Error("No running context");
    }

    const {deleteModal, setDeleteModal} = context;

    useEffect(() => {
        if(deleteModal){
            document.body.style.overflow = 'hidden'; 
        }else{
            document.body.style.overflow = 'auto';
        }
    }, [deleteModal]);

    return (
        <div className={`modal-overlay-delete ${deleteModal && ('active-delete')}`}>
            <div className="modal-content-delete">
                <div className='py-4 flex justify-center relative'>
                    <div style={{ backgroundColor: color }} className={`max-w-[300px]  rounded-lg shadow-lg py-4 text-white w-full`}>
                        <p className='text-center font-bold'>{text}</p>
                    </div>
                    <div className='absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2'>
                        <button type='button' onClick={() => setDeleteModal(false)} className='cursor-pointer text-gray-400 transition duration-300 ease-in-out hover:text-red-400'><FaTimes fontSize={24} /></button>
                    </div>
                </div>
                <hr className='text-gray-500' />
                {children}
            </div>
        </div>
    );
};

export default DeleteModal;
