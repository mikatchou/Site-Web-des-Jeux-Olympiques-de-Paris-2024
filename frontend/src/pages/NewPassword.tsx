import AskNewPasswordForm from "../components/AskNewPasswordForm"
import NewPasswordForm from "../components/NewPasswordForm";
import OtpForm from "../components/OtpForm";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NewPassword() {
    const [step, setStep] = useState<string>("ask");
    const [authId, setAuthId] = useState<number | null>(null);
    const [timer, setTimer] = useState<number | null>(300);
    const navigate = useNavigate()
    const location = useLocation()


    useEffect(() => {
        if (localStorage.getItem("access")) {
            navigate("/")
            return
        }
        setStep("ask")
        setAuthId(null)
    },[location.key])

        if(step === "ask") {
            return <>
                <h1>Demande de réinitialisation</h1>
                <AskNewPasswordForm  setAuth={setAuthId} setStep={setStep} setTimer={setTimer}/>
            </>
        } else if (step === "otp") {
            return <>
                <h1>Authentification par code</h1>
                <OtpForm setStep={setStep}  auth={authId} timer={timer} setTimer={setTimer} forWhich={"new"}/> 
            </>
        } else {
            return <>
                <h1>Réinitialisation du mot de passe</h1>
                <NewPasswordForm  auth_id={authId} /> 
                </>
        }
}