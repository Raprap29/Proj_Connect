import React, { ReactNode } from 'react'

interface LoginProps {
    children: ReactNode;
}

const LoginContainter: React.FC<LoginProps> = ({ children }) => {

    return (
        <>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 transform -translate-y-1/2  w-full`}>
                {children}
            </div>
        </>
    )
}

export default LoginContainter;
