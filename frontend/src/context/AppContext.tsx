import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface UserProps {
    _id: string;
    firstName: string;
    lastName: string;
    role: number;
    username: string;
}

interface ContextProp {
    page: number;
    setPages: Dispatch<SetStateAction<number>>;

    updateModal: boolean;
    setUpdateModal: Dispatch<SetStateAction<boolean>>;

    deleteModal: boolean;
    setDeleteModal: Dispatch<SetStateAction<boolean>>;

    addModal: boolean;
    setAddModal: Dispatch<SetStateAction<boolean>>;

    showLoading: boolean;
    setShowLoading: Dispatch<SetStateAction<boolean>>;

    users: UserProps[];
    setUsers: Dispatch<SetStateAction<UserProps[]>>;

    id: string;
    setId: Dispatch<SetStateAction<string>>;

}

interface ProviderProps {
    children: ReactNode;
}

const ContextData = createContext<ContextProp | undefined>(undefined);

const AppContext: React.FC<ProviderProps> = ({ children }) => {
    const [page, setPages] = useState(1);
    const [updateModal, setUpdateModal] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [id, setId] = useState("");
    const [users, setUsers]  = useState<UserProps[]>([]);

    return (
        <ContextData.Provider value={{ 
            page,
            setPages,

            updateModal,
            setUpdateModal,

            deleteModal,
            setDeleteModal,

            addModal,
            setAddModal,

            showLoading,
            setShowLoading,

            users,
            setUsers,

            id,
            setId

         }}>
            {children}
        </ContextData.Provider>
    )
}

export { AppContext, ContextData } 


