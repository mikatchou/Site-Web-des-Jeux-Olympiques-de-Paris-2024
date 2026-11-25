import { useCart } from "../CartContext"
import { Trash } from "lucide-react";
import { CgAdd, CgRemove } from "react-icons/cg";
import "../../styles/detailedCard.css"
import { useOutletContext } from "react-router-dom";

export default function DetailedCartContent() {
    const { cart, deleteCart, updateItem, deleteItem, errorMessage, loading } = useCart()
    type contextType = {
        setCartExist: React.Dispatch<React.SetStateAction<boolean>>;
    }
    const { setCartExist } = useOutletContext<contextType>();

    function date(itemEventDate: string) {
        const date = new Date(itemEventDate);
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

        return <div className="item-date-div"><p className="item-date">{jour}</p><p className="item-hour">{heure}</p></div>
    }

    return <div aria-label="panier detaillé" className="detailed-cart-div">
        <div className="detailed-cart-items">
            {cart &&
                cart.items.map((item) =>
                    <div data-testId={item.id} key={item.id} className="detailed-cart-item cart-item">
                        <div className="item-information">
                            <div className="detail-discipline-countries-div">
                                <p className="discipline-title">{item.event.discipline_name}</p>
                                <p className="cart-countries-name">
                                    {item.event.countries && item.event.countries.length >= 2 && `${item.event.countries[0]} - ${item.event.countries[1]}`}
                                </p>
                                <p className="category-name"> Cat : {item.category_name}</p>
                            </div>
                            <p className="item-venue-name">{item.event.venue_name}</p>
                            <p className="item-venue-city">{item.event.venue_city}</p>
                            {date(item.event.date)}
                            <p className="item-offer">Offre : {item.offer.name} | place(s) : {item.offer.seat_quantity}</p>
                            <div className="detailed-item-offer-quantity">
                                <p className="offer-price">Prix : {item.offer.price} euros</p>
                                <div className="quantity-box">
                                    <button aria-label="bouton moins" className={item.quantity === 1 ? "less-button disabled" : "less-button"} disabled={loading || item.quantity <= 1} onClick={() => updateItem(item.id, (item.quantity - 1))}><CgRemove /></button>
                                    <p aria-label="quantité offre" className="item-quantity">{item.quantity}</p>
                                    <button aria-label="bouton plus" className={item.available_seats < item.offer.seat_quantity || item.quantity * item.offer.seat_quantity >= 10 ? "more-button disabled" : "more-button"} disabled={loading || item.available_seats < item.offer.seat_quantity || item.quantity * item.offer.seat_quantity === 10} onClick={() => updateItem(item.id, item.quantity + 1)}><CgAdd /></button>
                                </div>
                            </div>
                        </div>
                        <div className="item-setting-div detailed-item-setting-div">
                            <button className="item-delete-button"
                                onClick={() => {
                                    if (window.confirm("Supprimer cet article du panier ?")) {
                                        deleteItem(item.id);
                                    }
                                }}
                                aria-label="Supprimer cet article du panier">
                                <Trash />
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
        <div className="error-message-div">
            <p className={errorMessage ? `cart-error-message show` : `cart-error-message`}>{errorMessage}</p>
        </div>
        <div className="delete-div">
            <button
                className="detailed-cart-delete-button"
                onClick={() => {
                    if (window.confirm("Voulez-vous vraiment supprimer votre panier ?")) {
                        deleteCart();
                        setCartExist(false)
                    }
                }}
                aria-label="Supprimer le panier">
                Vider le panier
                <Trash />
            </button>
        </div>
    </div>
}