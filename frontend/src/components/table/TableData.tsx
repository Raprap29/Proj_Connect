import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Search from "../search";
import UpdateModal from "../modal/updateModal";
import { useUserInfoQuery } from "../../api/UserApi";
import { ContextData } from "../../context/AppContext";


interface UserProps {
    _id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    role: number | undefined;
    username: string | undefined;
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

    setSearch

}) => {

    const context = useContext(ContextData);
    const [id, setId] = useState("");

    const { data } = useUserInfoQuery({ _id: id });

    const [user, setUser] = useState<UserProps>({
        _id: '',
        firstName: '',
        lastName: '',
        role: 0,
        username: '',
    })

    const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    if(!context){
        throw new Error("No running context");
    }

    const {setUpdateModal} = context;

    const handleOpen = (_id: string) => {
        setUpdateModal(true);
        setId(_id);
    }

    useEffect(() => {
        if(data?.user){
            setUser(data.user);
        }
    }, [data]);

    return(
        <div className="w-full px-5 mt-5">
            <UpdateModal color="blue" text="UPDATE USER">
                <form className="w-full max-w-lg mt-5">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                First Name
                            </label>
                            <input onChange={handleChangeForm} value={user.firstName} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
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
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="new-password" name="new-password" type="password" placeholder="******************" />
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
            <Search setSearch={setSearch} />
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
                                        <button type="button" className="cursor-pointer ml-4 text-red-600 hover:text-red-900">Delete</button>
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
    )
}

export default TableData;