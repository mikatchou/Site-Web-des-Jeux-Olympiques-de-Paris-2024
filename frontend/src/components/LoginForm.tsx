import React, { useState, } from "react"
import LoadingIndicator from "./LoadingIndicator"
import { Link } from "react-router-dom";
import type { FormEvent } from 'react'
import api from "../api"

export default function LoginForm ({ setAuth, setStep, setTimer }: { setAuth: React.Dispatch<React.SetStateAction<number | null>>; setStep: React.Dispatch<React.SetStateAction<string>>; setTimer: React.Dispatch<React.SetStateAction<number | null>> }) {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<string>("");
    const [errorMail, setErrorMail] = useState<string>("");

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name == "email") {
            setEmail(e.target.value)
        } else {
            setPassword(e.target.value)
        }
    }
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setErrorMail("")
        setErrorPassword("")

        let error = false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email as string)) {
            setErrorMail("Veuillez entrer une adresse e-mail valide.")
            error = true
        }
        if (password == "" ) {
            setErrorPassword("Veuillez entrer un mot de passe")
            error = true
        }
        if (error) {
            setLoading(false)
            return
        }
        try {
            const res = await api.post("auth/connexion/", {
                email,
                password
            })
            if (res.status == 200) {
                setAuth(res.data.auth_id)
                setStep('otp')
                if (res.data.remaining_time) {
                    setTimer(res.data.remaining_time)
                }
            }
        } catch (error: any) {
            setLoading(false)
            if (error.response && error.response.data) {
                const data = error.response.data
                if (data.error) {
                    setLoading(false)
                    setError(data.error)
                    return
                } else if (data.otp_code) {
                    setLoading(false)
                    setError(data.otp_code)
                    return
                }
            } else {
                setLoading(false)
                setError("Erreur réseau ou serveur injoignable.")
            }
        } finally {
            setLoading(false)
        }
    }

    return <>
        <form id="login-form" aria-label='formulaire_connexion'  onSubmit={handleSubmit} noValidate>
            <div className="form-row" id="login-form-row">
                <div className="form-field">
                    <label htmlFor="email" >Adresse e-mail *</label>
                    <input  value={email} onChange={handleChange} className="input" type="email" id="email" name="email" required/>
                </div>
                <p className={`error-wrapper ${errorMail ? "show" : ""}`}>
                    {errorMail}
                </p>              
                <div className="form-field">
                    <label htmlFor="password">Mot de passe *</label>
                    <input value={password} onChange={handleChange} className="input" type="password" id="password" name="password" required/>
                </div>
                <p className={`error-wrapper ${errorPassword ? "show" : ""}`}>
                    {errorPassword}
                </p>
                <div className="button-container">
                    <button aria-label="bouton_connexion" type='submit' className="submit" id='submit'>Me connecter</button>
                    <Link className="forgot-link" to="/connexion/mot-de-passe-oublie">Mot de passe oublié</Link>
                    <div className="loading-error-container">
                        <p className={`err ${error ? "show" : ""}`}>
                            {error}
                        </p>
                        <div className={`loading-wrapper ${loading ? "show" : ""}`}>
                            <LoadingIndicator />
                        </div>
                    </div>
                </div>
            </div>
        </form> 
    </>
}