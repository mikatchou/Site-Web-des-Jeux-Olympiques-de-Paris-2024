import { useNavigate } from 'react-router-dom'
import api from '../api'
import React, { useState } from 'react'
import type { FormEvent } from 'react'
import LoadingIndicator from './LoadingIndicator'

export default function NewPasswordForm ({ auth_id }: {auth_id: number | null;}) {

    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const [errorConfirmation, setErrorConfirmation] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePasswordChange = (e?: React.ChangeEvent<HTMLInputElement>, ) => {
        let value = ''
        if (e !== undefined) {
            value = e.target.value
            setPassword(value)
        } else {
            value = password
        }
        if (value.length < 10) {
            setErrorPassword("Le mot de passe doit contenir au moins 10 caractères")
        } else if (!/[A-Z]/.test(value)) {
            setErrorPassword("Il doit contenir au moins une majuscule")
        } else if (!/[a-z]/.test(value)) {
            setErrorPassword("Il doit contenir au moins une minuscule")
        } else if (!/[0-9]/.test(value)) {
            setErrorPassword("Il doit contenir au moins un chiffre")
        } else if (!/[!@#$%^&*.]/.test(value)) {
            setErrorPassword("Il doit contenir au moins un caractère spécial")
        } else {
            setErrorPassword("")
        }
    }

    const handleConfirmationChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
        let value = ''
        if (e !== undefined) {
            value = e.target.value
            setConfirmation(value)
        } else {
            value = confirmation
        } 
        if (value !== password) {
            setErrorConfirmation("Les mots de passe doivent être identiques")
        } else {
            setErrorConfirmation("")
        }
    }
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        handlePasswordChange()
        handleConfirmationChange()

        if(error) {
            setError(error)
            setLoading(false)
            return 
        }
        if(errorPassword) {
            setErrorPassword(errorPassword)
            setLoading(false)
            return 
        }
        if(errorConfirmation) {
            setErrorConfirmation(errorConfirmation)
            setLoading(false)
            return 
        }
        if (password === "" || confirmation === "") {
            setError("Veuillez remplir tout les champs")
            setLoading(false)
            return 
        }
        try {
            const res = await api.put("auth/new_password/", {password, auth_id})
            if (res.status === 200) {
                setLoading(false)
                alert("Votre mot de passe a bien été réinitialisé, vous allez être redirigé vers la page de connexion.")
                navigate("/connexion/")
            }
        } catch (error: any) {
            setLoading(false)
            if (error.response && error.response.data) {
                const data = error.response.data
                setError(data.error)
            } else {
                alert("Erreur réseau ou serveur injoignable.")
            }
        } finally {
            setLoading(false)
        }
    }
    

    return <form id="new-password-form" aria-label='formulaire_nouveau_mot_de_passe'  onSubmit={handleSubmit} noValidate>
        <div className="form-row">
            <div className="form-field">
                <label htmlFor="password">Mot de passe *</label>
                <input value={password} onChange={handlePasswordChange} className="input" type="password" id="password" name="password" required/>
            </div>
            {errorPassword && <p className="error">{errorPassword}</p>}
            <p id='mdp-p'>Votre mot de passe doit contenir au moins 10 caractères, dont une majuscule, une minuscule, un chiffre et un carractère spécial (ex: !@#$%^&*.)</p> 
            <div className="form-field">
                <label htmlFor="confirmation">Confirmation de mot de passe *</label>
                <input value={confirmation} onChange={handleConfirmationChange} className="input" type="password" id="confirmation" name="confirmation" required/>
            </div>
            {errorConfirmation && <p className="error">{errorConfirmation}</p>}
        </div>
        <div className='asterisque-div'>
            <p id='asterisque'>Les champs représentés par un (*) sont obligatoires</p>
        </div>
        <br/>
        <div className="button-container">
            <button type='submit' id='submit' className="submit">Valider la modification</button>
            <div className="loading-error-container">
                <p className={`err ${error ? "show" : ""}`}>
                    {error}
                </p>
                <div className={`loading-wrapper ${loading ? "show" : ""}`}>
                    <LoadingIndicator />
                </div>
            </div>
        </div>
    </form>
}
