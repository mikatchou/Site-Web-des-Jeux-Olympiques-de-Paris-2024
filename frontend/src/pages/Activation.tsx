import api from "../api"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import { useParams } from "react-router-dom";

export default function Activation () {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const { token } = useParams<{ token: string }>();

    useEffect(() => {
        const activation = async () => {
            try {
                    const res = await api.put(`auth/activation/${token}/`)
                    if (res.status === 200) {
                        navigate("/connexion/?actived=true")
                    }
                } catch (error: any) {
                    if (error.status == 404) {
                        setLoading(false)
                        alert("Aucun compte associé au lien d'activation n'a été trouvé, vérifiez si votre compte à déjà été activé en essayant de vous connecter.")
                        navigate("/connexion/")
                    }
                } finally {
                    setLoading(false)
                }
        }
        activation()
    }, [])

    return <>
        {loading && <LoadingIndicator /> }
    </>
}