import React, { FormEvent, useContext } from "react";
import SearchHooks from "../../hooks/searchHooks";
import { ContextData } from "../../context/AppContext";

interface SearchProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({ setSearch }) => {

    const context = useContext(ContextData);

    if (!context) {
        throw new Error("PageComponent must be used within an AppContext provider");
    }

    const { setPages } = context;

    const {searchString, handleSearchChange} = SearchHooks();

    const handleClick = (e: FormEvent) => {
        e.preventDefault();
        try{
           setSearch(searchString);
           setPages(1);
        }catch(e)
        {
            return console.error(e);
        }
    }

    return (
        <form onSubmit={handleClick} className="flex rounded-md border border-gray-300 mb-5 overflow-hidden max-w-md font-[sans-serif]">
            <input type="text" placeholder="Search..."
                onChange={handleSearchChange}
                value={searchString}
                className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3" />
            <button type='submit' className="btn btn-primary flex items-center cursor-pointer justify-center bg-blue-500 transtion duration-300 ease-in-out hover:bg-blue-400 px-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-white">
                <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                </path>
                </svg>
            </button>
        </form>
    )
}


export default Search;