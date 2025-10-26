import {Navigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants'
import { useState, useEffect, type ReactNode } from "react"

export default function ProtectedRoute ({children}:{children: ReactNode}) {

    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("token/refresh/", {
                refresh: refreshToken
            })
            if (res.status === 200) {
                localStorage.setItem(REFRESH_TOKEN, res.data.access)
                setIsAuthorized(true)
                setLoading(false)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode<{exp:number}>(token)
        const tokenExp = decoded.exp
        const now = Date.now() / 1000
        if (tokenExp < now) {
            setLoading(true)
            await refreshToken()
        } else {
            setIsAuthorized(true)
            setLoading(false)
        }
    }

    if (isAuthorized === null) {
        return <div>{loading}</div>
    }
    return isAuthorized ? children : <Navigate to="/connexion" />
    
}