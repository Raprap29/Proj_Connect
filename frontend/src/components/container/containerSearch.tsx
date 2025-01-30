
import {FC, ReactNode} from "react";

interface ContainerSearchProps {
    children: ReactNode;
}

export const ContainerSearch: FC<ContainerSearchProps> = ({children}) => {
    return(
        <div className="flex mb-5 justify-between">
            {children}
        </div>
    )
}