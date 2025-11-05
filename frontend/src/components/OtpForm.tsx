import { useState, useContext, type FormEvent } from "react"
import { AuthContext } from "./AuthProvider"
import LoadingIndicator from "./LoadingIndicator";
import Timer from "./Timer";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";

type OtpFormProps = {
    setStep: React.Dispatch<React.SetStateAction<string>>;
    auth: number | null;
    timer: number | null;
    setTimer: React.Dispatch<React.SetStateAction<number | null>>;
    forWhich: "login" | "new";
}

export default function OtpForm ({setStep, auth, timer, setTimer, forWhich }: OtpFormProps) {
    const [otp, setOtp] = useState<string>("") 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext)
    const location = useLocation();

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value)
        setError("")
    } 

    const handleLoginSuccess = () => {
        const redirectTo = location.state?.from ?? "/";
        navigate(redirectTo, { replace: true });
    };

    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        if (otp === "") {
            setError("Veuillez saisir un code")
            setLoading(false)
            return
        }
        if (timer == null  || typeof timer !== "number") {
            setError("Le code a expiré, veuillez demander un nouveau code")
            setLoading(false)
            return
        }

        try {
            const response = await api.post("auth/connexion/etape-2/", {
                auth_id: auth,
                otp_code: otp, 
                for_which : forWhich
            })
            if (response.status == 200) {
                if (forWhich === "login") {
                    setUser(response.data.first_name)
                    localStorage.setItem(ACCESS_TOKEN, response.data["access"])
                    localStorage.setItem("first_name", response.data["first_name"])
                    handleLoginSuccess()
                    return
                } else {
                    setStep("new")
                    return
                }
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const data = error.response.data
                if (data.error) {
                    setError(data.error)
                    setLoading(false)
                    return
                } else if (data.otp_code) {
                    setError(data.otp_code)
                    setLoading(false)
                    return
                }
            } else {
                console.log(error)
                setError("Erreur réseau ou serveur injoignable.")
                setLoading(false)
                return
            }
        } finally {
            setLoading(false)
        }
    }
    
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (typeof timer == "number" ) {
            setError("Veuillez attendre que le compte à rebours s'arrête")
            setLoading(false)
            return
        }

        try {
            const response = await api.post("auth/connexion/etape-2/nouveau-code/", {
                auth_id: auth,
            })
            if (response.status == 200) {
                console.log(response.data)
                setTimer(20)
                return
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const data = error.response.data
                if (data.error) {
                    setError(data.error)
                    setLoading(false)
                    return
                } else if (data.otp_code) {
                    setError(data.otp_code)
                    setLoading(false)
                    return
                }
            }
            setError("Erreur réseau ou serveur injoignable.")
                setLoading(false)
                return
        } finally {
            setLoading(false)
        }
    }


    return <>
        <form id="otp-form" aria-label='formulaire_otp'  onSubmit={handleSubmit} noValidate>
            <div className="form-row" id="otp-form-row">
                <div className="form-field-title">
                    <p>Veuillez saisir le code à 6 chiffres qui vous a été envoyé par mail :</p>
                </div>
                <div className="form-field-otp">
                    <input  
                        aria-label="otp_input"
                        placeholder="Saisissez le code..."
                        value={otp} 
                        onChange={handleChange} 
                        className="input" 
                        type="text"
                        id="otp" 
                        name="otp" 
                        required
                    />
                    <button aria-label="bouton_otp" type='submit' id='submit' className="submit">Valider</button>
                </div>
                <p className={`err ${error ? "show" : ""}`}>
                    {error}
                </p>
                <div className="button-timer-container">
                    {typeof timer == "number" &&  <Timer start={timer} setTimer={setTimer} /> }
                    <button 
                    aria-label="bouton_new_otp" 
                    type="button"
                    id='submit_otp' 
                    className={typeof timer === "number" ? "submit otp-submit-disabled" : "submit"} 
                    disabled={typeof timer === "number"}
                    onClick={(e) => typeof timer !== "number" && handleClick(e)}> 
                        Renvoyer un code
                    </button>
                    <div className={`loading-wrapper-otp ${loading ? "show" : ""}`}>
                        <LoadingIndicator />
                    </div>
                </div>
            </div>
        </form> 
    </>
}