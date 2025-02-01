import TitleNavbar from "../../../../components/TItleNavbar";
import { ContextData } from "../../../../context/AppContext";
import { 
    useEmployeeInfoQuery,
    useGetEmployeeQuery,
    
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useRegisterEmployeeMutation,

} from "../../../../api/EmployeeApi";
import { useContext, useEffect, useState } from "react";
import TableData from "../../../../components/table/TableData";

interface EmployeeProps {
    _id: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    role: number | undefined;
    username: string | undefined;
  }

const EmployeeMaintenance = () => {

    const context = useContext(ContextData);

    if(!context){
        throw new Error("No running context");
    }
    const [search, setSearch] = useState("");
    const {page, setPages, id } = context;
    const tableHeader: string[] = ['Full Name', 'Username', 'Actions'];

    const { data: infoEmployee, isLoading: LoadingInfo, refetch: employeeRefetch } = useEmployeeInfoQuery({ _id: id });
    const { data, isLoading: loadingEmployee, refetch } = useGetEmployeeQuery({page, search});
    const [updateEmployee, {isLoading: LoadingUpdate}] = useUpdateEmployeeMutation();
    const [deleteEmployee, {isLoading: LoadingDelete}] = useDeleteEmployeeMutation();
    const [addEmployee, {isLoading: LoadingAdd}] = useRegisterEmployeeMutation();


      const employeeQuery: EmployeeProps | undefined = infoEmployee?.user ? infoEmployee.user : undefined;
    
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
            <TitleNavbar title="Manage Employee" /> 
            <TableData 
                refetch={refetch}

                users={data?.users} 
                totalPages={data?.totalPage}
                currentPage={page} 
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                tableHead={tableHeader}
                handlePage={handlePage}
                loading={loadingEmployee}

                setSearch={setSearch}

                updateMutation={updateEmployee}
                LoadingUpdate={LoadingUpdate}

                deleteMutation={deleteEmployee}
                LoadingDelete={LoadingDelete}

                userQuery={employeeQuery}
                LoadingInfo={LoadingInfo}
                userRefetch={employeeRefetch}

                isAddModal={true}
                isTextAddModal="Add Employee"
                addMutation={addEmployee}
                LoadingAdd={LoadingAdd}

            />
        </>
    )
}

export default EmployeeMaintenance;