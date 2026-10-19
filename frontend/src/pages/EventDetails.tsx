import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api"
import { type EventResult } from "../types/EventType"
import LoadingIndicator from "../components/LoadingIndicator"
import "../styles/EventDetails.css"
import EventDetailsContent from "../components/EventDetailsContent"
import Redirection from "../components/Redirection"
import axios from "axios"

export default function EventDetails() {
    const { id } = useParams()
    const [discipline, setDiscipline] = useState<EventResult>()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchEvent = async () => {
        try {
            const result = await api.get(`events/${id}`)
            setDiscipline(result.data[0])
            console.log(result)
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setError("Événement introuvable.");
            } else {
                setError(
                    "Une erreur inconnue est survenue, veuillez recharger la page ou réessayer ultérieurement."
                );
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvent()
    }, [id])


    return <>
        <div className="redirection-button-div">
            <Redirection />
        </div>
        {loading || error &&
            <div className="loading-error-div">
                {loading && <LoadingIndicator />}
                {error && <p>{error}</p>}
            </div>
        }

        {!loading && !error && discipline &&
            <div className="event-details-div">
                {discipline && <EventDetailsContent data={discipline} />}
            </div>
        }

    </>

}