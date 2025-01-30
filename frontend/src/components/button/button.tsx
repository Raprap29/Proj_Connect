import { FC } from "react";

// Define the ButtonProps interface to type the props
interface ButtonProps {
    text: string;
    color: string;
    onclick(): void;
    hover: string;
}

// Use props object to access the properties
export const Button: FC<ButtonProps> = (props) => {
    return (
        <button 
            type="button"
            onClick={props.onclick}
            className={`transition duration-300 ease-in-out cursor-pointer py-2 px-8 rounded-lg shadow-lg text-white font-bold ${props.color} hover:${props.hover}`}
        >
            {props.text}
        </button>
    );
}
