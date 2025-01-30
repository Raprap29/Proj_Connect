import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Search from "../search";
import UpdateModal from "../modal/updateModal";
import { ContextData } from "../../context/AppContext";
import SuccessModal from "../modal/success.Modal";
import DeleteModal from "../modal/deleteModal";
import { AddModal } from "../modal/addModal";
import { ContainerSearch } from "../container/containerSearch";
import { Button } from "../button/button";

//  Interfaces

interface UserProps {
    _id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    role: number | undefined;
    username: string | undefined;
}

interface User {
    _id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    role: number | undefined;
    username: string | undefined;
    password: string | undefined;
}

interface updateUser {
    firstName: string | undefined;
    lastName: string | undefined;
    username: string | undefined;
    password: string | undefined;
}

interface addUser {
    firstName: string | undefined;
    lastName: string | undefined;
    username: string | undefined;
    password: string | undefined;
}


interface PropsTable {
    users: UserProps[] | undefined;
    totalPages: number | undefined;
    currentPage: number | undefined;
    handleNextPage(): void;
    handlePage(page: number): void;
    handlePrevPage(): void;
    tableHead: string[];
    loading: boolean;

    
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    refetch(): void;

    updateMutation: (payload: { _id: string | undefined; updates: Partial<updateUser> }) => void;
    LoadingUpdate: boolean;

    deleteMutation?: (payload: {_id: string | undefined}) => void;
    LoadingDelete: boolean;

    userQuery: UserProps | undefined;
    LoadingInfo: boolean;
    userRefetch(): void;

    isAddModal: boolean;
    isTextAddModal?: string;

    addMutation?: (payload: {addUser: Partial<addUser>}) => void;
    LoadingAdd?: boolean;

}

const TableData: React.FC<PropsTable> = ({ 
    users, 
    totalPages, 
    currentPage, 
    handleNextPage, 
    handlePrevPage, 
    handlePage, 
    tableHead,
    loading,
    refetch,

    setSearch,

    updateMutation,
    LoadingUpdate,

    deleteMutation,
    LoadingDelete,

    userQuery,
    LoadingInfo,
    userRefetch,

    isAddModal,
    isTextAddModal = "",

    addMutation,
    LoadingAdd,

}) => {

    // Properties
    const [showModal, setShowModal] = useState(false);
    const context = useContext(ContextData);

    const [user, setUser] = useState<User>({
        _id: '',
        firstName: '',
        lastName: '',
        role: 0,
        username: '',
        password: '',
    });

    const [addUser, setAddUser] = useState<addUser>({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    })

    const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handleChangeAddForm = (e: ChangeEvent<HTMLInputElement>) => {
        setAddUser({...addUser, [e.target.name]: e.target.value});
    }

    if(!context){
        throw new Error("No running context");
    }

    const {setUpdateModal, setShowLoading, setPages, setDeleteModal, setId, id, setAddModal} = context;

    const handleOpen = (_id: string) => {
        setUpdateModal(true);
        setId(_id);
    }

    const handleSubmitUpdate = async (e: FormEvent) => {
        e.preventDefault();
        try{
       
            await updateMutation({
                _id: user._id,
                updates: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    password: user.password,
                }
            })

            setId("");
            userRefetch();
            setPages(1);
            setUpdateModal(false);
            setShowModal(true);
        }catch(e){
            console.error(e);
        }
    }

    const handleDeleteOpen = (_id: string) => {
        setDeleteModal(true);
        setId(_id);
    }

    const handleSubmitDelete = async (e: FormEvent) => {
        e.preventDefault();
        try{
            if(deleteMutation){
                await deleteMutation({
                    _id: id
                })
            }

            setId("");
            userRefetch();
            setPages(1);
            setDeleteModal(false);
            setShowModal(true);
        }catch(e)
        {
            return console.error(e);
        }
    }

    const handleAddOpen = () => {
        setUser({
            _id: '',
            firstName: '',
            lastName: '',
            role: 0,
            username: '',
            password: '',
        })
        setAddModal(true);
    }

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        try{

            const {firstName, lastName, username, password} = addUser;
            if(addMutation){
                await addMutation({
                    addUser: {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        password: password,
                    }
                });
            }

            setUser({
                _id: '',
                firstName: '',
                lastName: '',
                role: 0,
                username: '',
                password: '',
            })
            setAddModal(false);
            refetch();
            setPages(1);
            setShowModal(true);
        }catch(e){
            return console.error(e);
        }
    }

    useEffect(() => {
        if(userQuery){
       
            setUser({
                _id: userQuery?._id,
                firstName: userQuery?.firstName,
                lastName: userQuery?.lastName,
                role: userQuery?.role,
                username: userQuery?.username,
                password: '',
            });
        }

        if(LoadingInfo){
            setShowLoading(true);
        }else{
            setShowLoading(false);
        }

        if(LoadingUpdate || LoadingDelete || LoadingAdd){
            setShowLoading(true);
            refetch();
        }else{
            setShowLoading(false);
        }

    }, [userQuery, LoadingUpdate, setShowLoading, refetch, LoadingDelete, LoadingInfo, LoadingAdd]);


    useEffect(() => {
        if(showModal){
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 3000);
        
            return () => clearTimeout(timer);
        }
    }, [showModal])

    return(
        <>
            <div className="w-full px-5 mt-5">
                <SuccessModal showModal={showModal} message='Successfully updated' />
                <UpdateModal color="blue" text="UPDATE USER">
                    <form onSubmit={handleSubmitUpdate} className="w-full max-w-lg mt-5">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    First Name
                                </label>
                                <input onChange={handleChangeForm} value={user.firstName} className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white border border-gray-200 focus:border-gray-500" id="firstName" name="firstName" type="text" placeholder="Jane" />
                                {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                    Last Name
                                </label>
                                <input onChange={handleChangeForm} value={user.lastName}  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="lastName" name="lastName" type="text" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input onChange={handleChangeForm} value={user.username} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="username" type="text" name="username" placeholder="Enter username" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="new-password">
                                New Password
                                </label>
                                <input value={user?.password} onChange={handleChangeForm} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="new-password" name="password" type="password" placeholder="******************" />
                                <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                            </div>
                        </div>
                        <hr className='text-gray-500' />
                        <div className="md:flex md:items-center w-full mt-4 mb-4">
                            <button type="submit" className="transition duration-300 ease-in-out shadow bg-purple-500 w-full hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 cursor-pointer px-4 rounded">
                                Update User
                            </button>
                        </div>
                    </form>
                </UpdateModal>
                <DeleteModal color="red" text="WARNING DELETING USER">
                    <form onSubmit={handleSubmitDelete} className="w-full max-w-lg mt-5">
                        <div className="mb-4 text-center">
                            <p className="font-bold">WARNING: THIS METHOD DELETES DATA AND CANNOT BE UNDONE</p>
                        </div>    
                        <hr className='text-gray-500' />
                        <div className="md:flex md:items-center w-full mt-4 mb-4">
                            <button type="submit" className="transition duration-300 ease-in-out shadow bg-purple-500 w-full hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 cursor-pointer px-4 rounded">
                                Delete User
                            </button>
                        </div>
                    </form>
                </DeleteModal>
                {isAddModal && (
                    <AddModal color="green" text="ADD USER">
                        <form onSubmit={handleAddUser} className="w-full max-w-lg mt-5">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                        First Name
                                    </label>
                                    <input onChange={handleChangeAddForm} value={addUser.firstName} className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white border border-gray-200 focus:border-gray-500" id="firstName" name="firstName" type="text" placeholder="Jane" />
                                    {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                        Last Name
                                    </label>
                                    <input onChange={handleChangeAddForm} value={addUser.lastName}  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="lastName" name="lastName" type="text" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input onChange={handleChangeAddForm} value={addUser.username} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="username" type="text" name="username" placeholder="Enter username" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="new-password">
                                    New Password
                                    </label>
                                    <input value={addUser?.password} onChange={handleChangeAddForm} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="new-password" name="password" type="password" placeholder="******************" />
                                    <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                                </div>
                            </div>
                            <hr className='text-gray-500' />
                            <div className="md:flex md:items-center w-full mt-4 mb-4">
                                <button type="submit" className="transition duration-300 ease-in-out shadow bg-purple-500 w-full hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 cursor-pointer px-4 rounded">
                                    Add User
                                </button>
                            </div>
                        </form>
                    </AddModal>
                )}
                <ContainerSearch>
                    <Search setSearch={setSearch} />
                    {isAddModal && (  <Button onclick={handleAddOpen} text={isTextAddModal} color="bg-blue-500" hover="bg-blue-400" />)}
                </ContainerSearch>
                <table className="min-w-full border-2 border-gray-200 rounded-[5px] divide-y divide-gray-200 overflow-x-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            {tableHead.map((item, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? 
                            <>
                                <tr>
                                    <td colSpan={tableHead.length} className="py-5">
                                        <p className="text-center text-gray-500">Loading...</p>
                                    </td>
                                </tr>
                            </>
                            : 
                            <>
                                {users?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.firstName} {item.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                            <button type="button" onClick={() => handleOpen(item._id || "")} className="cursor-pointer text-indigo-600 hover:text-indigo-900">Update</button>
                                            <button type="button" onClick={() => handleDeleteOpen(item._id || "")} className="cursor-pointer ml-4 text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        }
                    </tbody>
                </table>
                <nav aria-label="Page navigation" className="mt-5">
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <button type="button" onClick={handlePrevPage} className={`${currentPage === 1 ? 'pointer-events-none bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 '} hover:bg-blue-500 ease-in-out transition duration-300 hover:text-white cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-gray-300 rounded-s-lg`}>
                                <MdKeyboardArrowLeft fontSize={24} />
                            </button>
                        </li>
                        {Array.from({ length: totalPages || 0 }, (_, index) => (
                            <li key={index}>
                                <button type="button" onClick={() => handlePage(index + 1)} className={`${currentPage === index + 1 ? 'pointer-events-none bg-blue-500 text-white font-bold' : ''} hover:bg-blue-500 ease-in-out transition duration-300 hover:text-white cursor-pointer border-1 border-gray-200 flex items-center justify-center px-3 h-8 leading-tight`}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button type="button" onClick={handleNextPage} className={`${currentPage === totalPages ? 'pointer-events-none bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 '} hover:bg-blue-500 ease-in-out transition duration-300 hover:text-white cursor-pointer flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg`}>
                                <MdKeyboardArrowRight fontSize={24} />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}


export default TableData;