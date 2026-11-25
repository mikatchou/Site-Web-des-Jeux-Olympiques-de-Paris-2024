import { IoArrowBack } from "react-icons/io5";
import {  useNavigate } from "react-router-dom";

export default function Redirection() {

    const navigate = useNavigate();

    const handleRedirection = () => {
        const previousUrl = document.referrer;

        if (previousUrl && new URL(previousUrl).origin === window.location.origin) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return <>
        <button className="redirection-button" onClick={handleRedirection}>
            <IoArrowBack />
            Retour
        </button>
    </>
}