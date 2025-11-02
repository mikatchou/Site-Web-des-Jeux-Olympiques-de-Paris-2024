import LoginForm from "../components/LoginForm";
import OtpForm from "../components/OtpForm";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
    const [step, setStep] = useState<"login" | "otp">("login");
    const [authId, setAuthId] = useState<number | null>(null);
    const [timer, setTimer] = useState<number | null>(20);
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (localStorage.getItem("access")) {
            navigate("/")
            return
        }
        setStep("login")
        setAuthId(null)
    },[location.key])

    return <>
        { step == "login" 
            ? 
                <>
                    <h1>Connexion</h1>
                    <LoginForm  setAuth={setAuthId} setStep={setStep} setTimer={setTimer}/>
                </>
            : 
                <>
                    <h1>Connexion: étape 2</h1>
                    <OtpForm auth={authId} timer={timer} setTimer={setTimer}/> 
                </>
        }
    </>
}