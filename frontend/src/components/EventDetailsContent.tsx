import { type EventResult } from "../types/EventType"
import { useEffect, useState } from "react";
import { ImEnlarge } from "react-icons/im";
import { BiBasket } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { CgUnavailable } from "react-icons/cg";

type dataProps = {
    data: EventResult
}
export default function EventDetailsContent({ data }: dataProps) {
    const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
    const venueImage = data.venue.image;

    useEffect(() => {
        if (!expandedImage) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setExpandedImage(null);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [expandedImage]);

    const date = new Date(data.date);
    const jour = date
        .toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        .split(" ")
        .map((part, index) => (index === 1 ? part.toUpperCase() : part))
        .join(" ");
    const heure = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return <>
        <section className="event-informations-map-section">
            <div className="event-image-discipline-venue-div">
                <div className="event-image-info-div">
                    <div className="event-image-div">
                        <img className="event-image" src={data.discipline.image} alt={data.discipline.name} />
                    </div>
                    <div className="discipline-info-div">
                        <p className="event-discipline-name">{data.discipline.name}</p>
                        <p className="venue-name">{data.venue.name}</p>
                        <p id="venue-city" className="venue-city">{data.venue.city}</p>
                    </div>
                </div>
                <div className="countries-date-info-div">
                    <p className="countries-name-info">
                        {data.teams && data.teams.length >= 2 && `${data.teams[0].country.name} - ${data.teams[1].country.name}`}
                    </p>
                    <p className="event-date-info">{jour}</p>
                    <p className="event-hour-info">{heure}</p>
                </div>
            </div>
            <div className="map-div">
                {venueImage ? <>
                    <img className="map-image" src={venueImage} alt={`Plan du site : ${data.venue.name}`}
                        onClick={() => setExpandedImage({ src: venueImage, alt: `Plan du site : ${data.venue.name}` })} />
                    <button className="map-button" onClick={() => setExpandedImage({ src: venueImage, alt: `Plan du site : ${data.venue.name}` })}>
                        <ImEnlarge />
                        Plan du site
                    </button>
                </> : <div className="anavailable-image-div"><p>Plan du site indisponible</p></div>}
            </div>
        </section>
        {data.categories.map((category) => (
            <section key={category.id} className={category.offers.length == 0 ? "unavailable-cattegory" : "category"}>
                <p className="category-title">Categorie {category.name}</p>
                <div className="offers-div">
                    {category.offers.length == 0 && <p className="unavailable-message">Aucune offre n'est disponible pour cette gatégorie.</p>}
                    {category.offers.map((offer) =>
                        <div key={offer.id} className="offer-div">
                            <div className="offer-informations-div">
                                <div className="offer-name-div">
                                    <p className="offer-name">{offer.name}</p>
                                </div>
                                <div className="quantity-div seat-quantity">
                                    <p className="wide-screen">Quantité :&nbsp;</p>
                                    <p className="mobile-screen">Qté :&nbsp;</p>
                                    <p className="seat-quantity">    {offer.seat_quantity}</p>
                                </div>
                                <div className="price-div">
                                    <p>{offer.price}€</p>
                                </div>
                            </div>
                            <div className="add-button-div">
                                {category.available_seats && offer.seat_quantity && offer.seat_quantity <= category.available_seats ?
                                    <button className="add-button">
                                        Ajouter
                                        <BiBasket />
                                    </button>
                                    : <button className="unavailable-add-button">
                                        indisponible
                                        <CgUnavailable />
                                    </button>}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        ))}
        {expandedImage && (
            <div className="image-lightbox" role="presentation" onClick={() => setExpandedImage(null)}>
                <div className="image-lightbox-content" role="dialog" aria-modal="true" aria-label="Image agrandie"
                    onClick={(event) => event.stopPropagation()}>
                    <button className="image-lightbox-close" type="button" aria-label="Fermer l’image agrandie"
                        onClick={() => setExpandedImage(null)}>
                        <IoClose aria-hidden="true" />
                    </button>
                    <img src={expandedImage.src} alt={expandedImage.alt} />
                </div>
            </div>
        )}
    </>
}
