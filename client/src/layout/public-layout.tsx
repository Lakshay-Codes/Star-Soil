import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PublicLayout({children} : {children: React.ReactNode}) {
    const navigate = useNavigate();
    useEffect(() => {
        if(Cookies.get("token")) {
            navigate("/");
        }else{
            navigate("/home");
        }
    }, []);
    
    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {children}
        </div>
    );
}

export default PublicLayout;