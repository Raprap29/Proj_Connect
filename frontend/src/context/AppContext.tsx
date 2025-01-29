import React, { createContext, useState, ReactNode } from "react";

interface ContextProp {
    page: number;
    setPages: React.Dispatch<React.SetStateAction<number>>;

    updateModal: boolean;
    setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProviderProps {
    children: ReactNode;
}

const ContextData = createContext<ContextProp | undefined>(undefined);

const AppContext: React.FC<ProviderProps> = ({ children }) => {
    const [page, setPages] = useState(1);
    const [updateModal, setUpdateModal] = useState(false);
    return (
        <ContextData.Provider value={{ 
            page,
            setPages,

            updateModal,
            setUpdateModal,
         }}>
            {children}
        </ContextData.Provider>
    )
}

export { AppContext, ContextData } 


