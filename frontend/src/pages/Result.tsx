import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import Event from "../components/Event";
import { type EventResult } from "../types/EventType";
import "../styles/result.css"

export default function Result() {
    const [searchParams] = useSearchParams();
    const urlDiscipline = searchParams.get("discipline") ?? "";
    const [loading, setLoading] = useState(true)
    const [next, setNext] = useState("")
    const [error, setError] = useState("")
    const [events, setEvents] = useState<EventResult[]>([])


    const fetch = async (searchUrl: string, discipline?:string, isNext?: boolean) => {
        const url = searchUrl
        const params = {
            discipline: discipline,
        };
        api.get(url, {params})
        .then((result) => {
            const events = result.data.results
            setNext(result.data.next ?? "")
            if (isNext) {
                setEvents((prevEvents) => [...prevEvents, ...events]);
            } else {
                setEvents(events)
            }
            setLoading(false)
        })
        .catch(() => {
            setError("Erreur réseau ou serveur injoignable.");
            setLoading(false)
        })
    }

    const getResult = () => {
        fetch("events/search/", urlDiscipline)
    }
    const getNext = () => {
        setLoading(true)
        fetch(next, urlDiscipline, true)
    }
    const location = useLocation()
    useEffect(() => {
        setLoading(true)
        setNext("")
        setEvents([])
        getResult()
    }, [urlDiscipline, location.state?.searchTime])

    return <>
        <h1 className="result-title">
            Résultat pour : <span>{urlDiscipline || "Toutes les disciplines"}</span>
        </h1>
        <div className="result-container">
            {events.map((d) => (<Event key={d.id} data={d} />))}
        </div>
        <div className="events-message-container">
            {loading && <LoadingIndicator />}
            {next && <button className="button-show-more button-show-more-hover" onClick={getNext}>Afficher plus de billets</button>}
            {!next && events.length > 0 && <p className="button-show-more">Fin des résultats</p>}
            {error && <p className="error-message">{error}</p>}
            {!next && events.length == 0 && !error && !loading && <p className="no-results">Aucun résultat trouvé</p>}
        </div>
    </>
}