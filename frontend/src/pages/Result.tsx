import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import Event from "../components/Event";
import { type EventResult, type Filters } from "../types/EventType";
import "../styles/result.css"
import SearchFilters from "../components/searchFilters";

export default function Result() {
    const [searchParams] = useSearchParams();
    const [discipline, setDisicipline] = useState(searchParams.get("discipline") ?? "")
    const [loading, setLoading] = useState(true)
    const [next, setNext] = useState("")
    const [error, setError] = useState("")
    const [events, setEvents] = useState<EventResult[]>([])
    const [filters, setFilters] = useState<Filters>({
        villes: [],
        pays: [],
        dates: [],
        disciplines: [],
    })
    const [date, setDate] = useState("")
    const [pays, setPays] = useState("")
    const [ville, setVille] = useState("")


    const fetch = async (searchUrl: string, discipline?: string, isNext?: boolean) => {
        const url = searchUrl
        const params = {
            discipline: discipline,
            date: date,
            country: pays,
            city: ville
        };
        api.get(url, { params })
            .then((result) => {
                const events = result.data.results
                setNext(result.data.next ?? "")
                if (isNext) {
                    setEvents((prevEvents) => [...prevEvents, ...events]);
                } else {
                    setEvents(events)
                    const apiFilters = result.data.filters;
                    setFilters({
                        villes: apiFilters.cities,
                        pays: apiFilters.countries,
                        dates: apiFilters.dates,
                        disciplines: apiFilters.disciplines,
                    });
                }
                setLoading(false)
            })
            .catch(() => {
                setError("Erreur réseau ou serveur injoignable.");
                setLoading(false)
            })
    }

    const getResult = () => {
        fetch("events/search/", discipline)
    }
    const getNext = () => {
        setLoading(true)
        fetch(next, discipline, true)
    }
    const location = useLocation()
    const searchTime = location.state?.searchTime;
    const previousSearchTime = useRef(searchTime);

    useEffect(() => {
        if (previousSearchTime.current === searchTime) return;

        previousSearchTime.current = searchTime;
        setDate("");
        setPays("");
        setVille("");
    }, [searchTime, searchParams]);

    useEffect(() => {
        setLoading(true);
        setNext("");
        setEvents([]);
        getResult();
    }, [discipline, date, ville, pays]);

    return <>
        <h1 className="result-title">
            Résultat pour : <span>{discipline || "Toutes les disciplines"}</span>
        </h1>
        <div className="result-container">
            <SearchFilters
                key={location.state?.searchTime ?? 0}
                filters={filters}
                setDate={setDate}
                setDiscipline={setDisicipline}
                setVille={setVille}
                setPays={setPays}
                date={date}
                discipline={discipline}
                ville={ville}
                pays={pays}
            />
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