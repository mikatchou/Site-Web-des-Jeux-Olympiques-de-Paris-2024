import { useNavigate } from 'react-router-dom'
import api from '../api'
import React, { useState } from 'react'
import type { FormEvent } from 'react'
import LoadingIndicator from './LoadingIndicator'

export default function RegisterForm() {

    const navigate = useNavigate()
    const [password, setPassword] = useState('')
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
            setError("Le mot de passe doit contenir au moins 10 caractères")
        } else if (!/[A-Z]/.test(value)) {
            setError("Il doit contenir au moins une majuscule")
        } else if (!/[a-z]/.test(value)) {
            setError("Il doit contenir au moins une minuscule")
        } else if (!/[0-9]/.test(value)) {
            setError("Il doit contenir au moins un chiffre")
        } else if (!/[!@#$%^&*.]/.test(value)) {
            setError("Il doit contenir au moins un caractère spécial")
        } else {
            setError("")
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
        handlePasswordChange()
        handleConfirmationChange()

        if(error || errorConfirmation) {
            alert(
                `
                ${error}
                ${errorConfirmation}
                `
            )
            return 
        }

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        console.log(data)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email as string)) {
            alert("Veuillez entrer une adresse e-mail valide.")
            return
        }

        const requiredFields = [
            'last_name',
            'first_name',
            'birth',
            'country',
            'city',
            'zip_code',
            'address',
            'email',
            'password',
            'confirmation',
        ]

        const missingFields = requiredFields.filter(field => !data[field])
        if (missingFields.length > 0) {
            alert("Veuillez remplir tous les champs obligatoires.")
            setLoading(false)
            return
        }
        try {
            const res = await api.post("auth/inscription/", data)
            if (res.status === 201) {
                navigate("/inscription/confirmation")
            }
        } catch (error: any) {
        setLoading(false)
        if (error.response && error.response.data) {
            const data = error.response.data
            if (data.email) {
                alert(data.email[0])
            } else {
                alert("Une erreur est survenue.")
            }
        } else {
            alert("Erreur réseau ou serveur injoignable.")
        }
        } finally {
            setLoading(false)
        }
    }
    

    return <form aria-label='formulaire inscription'  onSubmit={handleSubmit} noValidate>
        <div className="form-row">
            <div className="form-field">
                <label htmlFor="last_name" >Nom *</label>
                <input className="input" type="text" id="last_name" name="last_name" required/>
            </div>
                <div className="form-field">
                <label htmlFor="first_name" >Prénom *</label>
                <input className="input" type="text" id="first_name" name="first_name" required/>
            </div>
                <div className="form-field">
                <label htmlFor="birth" >Date de naissance *</label>
                <input className="input" type="date" id="birth" name="birth" required/>
            </div>
            <div className="form-field">
                <label htmlFor="phone" >Numéro de téléphone</label>
                <input className="input" type="number" id="phone" name="phone"/>
            </div>
            <div className="form-field">
                <label htmlFor="country" >Pays *</label>
                <input className="input" type="text" id="country" name="country" required/>
            </div>
            <div className="form-field">
                <label htmlFor="city" >Ville *</label>
                <input className="input" type="text" id="city" name="city" required/>
            </div>
            <div className="form-field">
                <label htmlFor="zip_code" >Code postal *</label>
                <input className="input" type="number" id="zip_code" name="zip_code" required/>
            </div>
            <div className="form-field">
                <label htmlFor="address" >Adresse complète *</label>
                <input className="input" type="text" id="address" name="address" required/>
            </div>
            <div className="form-field">
                <label htmlFor="email" >Adresse e-mail *</label>
                <input className="input" type="email" id="email" name="email" required/>
            </div>
            <div className="form-field">
                <label htmlFor="password">Mot de passe *</label>
                <input value={password} onChange={handlePasswordChange} className="input" type="password" id="password" name="password" required/>
            </div>
            {error && <p className="error">{error}</p>}
            <p id='mdp-p'>Votre mot de passe doit contenir au moins 10 caractères, dont une majuscule, une minuscule, un chiffre et un carractère spécial (ex: !@#$%^&*.)</p> 
            <div className="form-field">
                <label htmlFor="confirmation">Confirmation de mot de passe</label>
                <input value={confirmation} onChange={handleConfirmationChange} className="input" type="password" id="confirmation" name="confirmation" required/>
            </div>
            {errorConfirmation && <p className="error">{errorConfirmation}</p>}
        </div>
        <div className='asterisque-div'>
            <p id='asterisque'>Les champs représentés par un (*) sont obligatoires</p>
        </div>
        <button type='submit' id='submit'>Créer mon compte</button>
        <br/>
        {loading && <LoadingIndicator /> } 
    </form>
}
