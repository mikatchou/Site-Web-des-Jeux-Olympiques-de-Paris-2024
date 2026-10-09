import { Link } from "react-router-dom";
import { type EventResult } from "../types/EventType";

type EventProps = {
    data: EventResult
}
export default function Event({ data }: EventProps) {

    const price = data.categories[0].offers[0] ? data.categories[0].offers[0].price : ""
    const date = new Date(data.date);
    const jour = date.toLocaleDateString();
    const heure = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return <>
        <div className="event-card">
            <div className="image-discipline-venue-div">
                <div className="discipline-image-div">
                    <img className="discipline-image" src={data.discipline.image} alt={data.discipline.name} />
                </div>
                <div className="discipline-venue-div">
                    <div className="discipline-name-container">
                        <p className="discipline-name">{data.discipline.name}</p>
                    </div>
                    <div className="venue-info-container">
                        <p className="venue-name">{data.venue.name}</p>
                        <p className="venue-city">{data.venue.city}</p>
                    </div>
                </div>
            </div>

            <div className="countries-date-prix-div">
                <div className="countries-date-div">
                    <div className="countries-name-div">
                        <p className="countries-name">
                            {data.teams.length > 0 && `${data.teams[0].country.code} - ${data.teams[1].country.code}`}
                        </p>
                    </div>
                    <div className="date-div">
                        <p className="event-date">{jour}</p>
                        <p className="event-hour">{heure}</p>
                    </div>
                </div>
                <div className="prix-div">
                    <p className="prix-titre">A partir de</p>
                    <div className="prix-titre-euros-div">
                        <p className="prix-titre">{price && price }</p>
                        <p className="prix-euros">euros</p>
                    </div>
                </div>
            </div>

            <div className="button-div">
                <Link to={`recherche/billet/${data.id}`} className="discipline-details-button">Voir les billets</Link>
            </div>
        </div>
    </>
}