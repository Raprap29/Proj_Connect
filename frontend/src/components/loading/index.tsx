import { useEffect } from "react";

interface LoadingProps {
    loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
    
    useEffect(() => {
        if(loading){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    }, [loading]);
  
    return (
        <div className={`${loading ? 'fixed' : 'hidden'} bg-black opacity-90 w-full h-[100vh] top-0 z-[9999]`}>
            <div className="text-white">ttt</div>
        </div>
    )
}

export default Loading;
