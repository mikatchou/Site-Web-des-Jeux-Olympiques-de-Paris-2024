import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function Redirection() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleRedirection = () => {
        const redirectTo = location.state?.from ?? "/";
        navigate(redirectTo, { replace: true });
    };

    return <>
        <button className="redirection-button" onClick={handleRedirection}>
            <IoArrowBack />
            Retour
        </button>
    </>
}