import { useState, useContext } from 'react'
import { useGetUserQuery } from '../../../../api/UserApi';
import TableData from '../../../../components/table/TableData';
import { ContextData } from '../../../../context/AppContext';
const UserMaintenance = () => {
  
  const context = useContext(ContextData);

  if(!context){
    throw new Error("PageComponent must be used within an AppContext provider");
  }

  const {page, setPages} = context;

  const tableHeader: string[] = ['Full Name', 'Username', 'Actions'];

  const [search, setSearch] = useState("");
  const {data, isLoading: loadingUser} = useGetUserQuery({page, search});
  
  const handleNextPage = () => {
    if (data?.totalPage && page < data.totalPage) {
      setPages((prevPage) => prevPage + 1);
    }
  };

  // Handle previous page logic
  const handlePrevPage = () => {
    if (page > 1) {
      setPages((prevPage) => prevPage - 1);
    }
  };

  const handlePage = (page: number) => {
    setPages(page);
  }

  return (
    <>
      <div className='py-4 px-5 bg-white border-b-2 border-gray-300 shadow-md'>
        <p className='font-bold text-2xl'>Manage Users</p>
      </div>
      <TableData 
        users={data?.users} 
        totalPages={data?.totalPage}
        currentPage={page} 
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        tableHead={tableHeader}
        handlePage={handlePage}
        loading={loadingUser}

        setSearch={setSearch}
        />
    </>
  )
}

export default UserMaintenance;