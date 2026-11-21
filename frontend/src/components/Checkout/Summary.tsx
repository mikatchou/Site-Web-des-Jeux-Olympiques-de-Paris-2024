import { useCart } from "../CartContext"
import { Link } from "react-router-dom";

type SummaryProps = {
    nextStepUrl: string;
    nextStepName: string;
};

export default function Summary({ nextStepUrl, nextStepName }: SummaryProps) {
    const { cart } = useCart()

    function date(itemEventDate: string) {
        const date = new Date(itemEventDate);
        const jour = date
            .toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
            .split(" ")
            .map((part, index) => (index === 1 ? part.toLowerCase() : part))
            .join(" ");

        const heure = date
            .toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            })
            .replace(":", "h")
            .replace(/h00$/, "h");

        return <div className="summary-item-date-div"><p className="item-date">{jour}</p><p className="item-hour">{heure}</p></div>
    }

    return <section aria-label="recapitulatif" className="summary">
        <h2>Résumé</h2>
        <div className="summary-items">
            {cart &&
                cart.items.map((item) =>
                    <div key={item.id} className="summary-item">
                        <div className="summary-item-information">
                            <div className="discipline-countries-div">
                                <p className="summary-discipline-title">{item.event.discipline_name}</p>
                                <p className="summary-category-name"> Cat : {item.category_name}</p>
                            </div>
                            {date(item.event.date)}
                            <p className="summary-p item-offer">Offre : {item.offer.name}</p>
                            <div className="summary-item-offer-quantity">
                                <p className="summary-p item-offer">Quantité : {item.quantity}</p>
                                <p className="bold-text offer-price">Prix : {item.offer.price } €</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
        <div className="summary-total">
            <div className="total-text">
                <p className="cart-total-price"> TOTAL TTC :</p>
                <p className="tva"> Dont TVA :</p>

            </div>
            <div className="total-value-div">
                <p className="cart-total-price">{cart?.total_price} €</p>
                <p className="tva">{(Number(cart?.total_price) * 20 /120).toFixed(2)} €</p>
            </div>
        </div>
            <Link className="next-button" to={nextStepUrl}>{nextStepName}</Link>
    </section>
}