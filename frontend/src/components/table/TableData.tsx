import React from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Search from "../search";


interface UserProps {
    _id: string;
    firstName: string;
    lastName: string;
    role: number;
    username: string;
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

    return(
        <div className="w-full px-5 mt-5">
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
                                        <button type="button" className="cursor-pointer text-indigo-600 hover:text-indigo-900">Update</button>
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
                        <button type="button" onClick={handlePrevPage} className="cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <MdKeyboardArrowLeft fontSize={24} />
                        </button>
                    </li>
                    {Array.from({ length: totalPages || 0 }, (_, index) => (
                        <li key={index}>
                            <button type="button" onClick={() => handlePage(index + 1)} className={`${currentPage === index + 1 ? 'pointer-events-none bg-blue-500 text-white font-bold' : ''} cursor-pointer border-1 border-gray-400 flex items-center justify-center px-3 h-8 leading-tight`}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button type="button" onClick={handleNextPage} className="cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <MdKeyboardArrowRight fontSize={24} />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default TableData;