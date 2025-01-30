import { useState, useContext, useEffect } from 'react'
import { useGetUserQuery } from '../../../../api/UserApi';
import TableData from '../../../../components/table/TableData';
import { ContextData } from '../../../../context/AppContext';
import { 
  useUserInfoQuery,

  useUpdateUserMutation,
  useDeleteUserMutation,

} from "../../../../api/UserApi";
import TitleNavbar from '../../../../components/TItleNavbar';

interface UserProps {
  _id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  role: number | undefined;
  username: string | undefined;
}

const UserMaintenance = () => {

  const context = useContext(ContextData);
    
  if(!context){
    throw new Error("PageComponent must be used within an AppContext provider");
  }

  const {page, setPages, id } = context;

  const tableHeader: string[] = ['Full Name', 'Username', 'Actions'];

  const [search, setSearch] = useState("");
  const { data: infoUser, isLoading: LoadingInfo, refetch: userRefetch } = useUserInfoQuery({ _id: id });
  const { data, isLoading: loadingUser, refetch } = useGetUserQuery({page, search});
  const [updateUser, {isLoading: LoadingUpdate}] = useUpdateUserMutation();
  const [deleteUser, {isLoading: LoadingDelete}] = useDeleteUserMutation();

  const userQuery: UserProps | undefined = infoUser?.user ? infoUser.user : undefined;

  useEffect(() => {
    refetch();
  }, [page, search, refetch]);

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
      <TitleNavbar title='Manage Users' />
      <TableData 
        refetch={refetch}

        users={data?.users} 
        totalPages={data?.totalPage}
        currentPage={page} 
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        tableHead={tableHeader}
        handlePage={handlePage}
        loading={loadingUser}

        setSearch={setSearch}

        updateMutation={updateUser}
        LoadingUpdate={LoadingUpdate}

        deleteMutation={deleteUser}
        LoadingDelete={LoadingDelete}

        userQuery={userQuery}
        LoadingInfo={LoadingInfo}
        userRefetch={userRefetch}

        isAddModal={false}
        />
    </>
  )
}

export default UserMaintenance;