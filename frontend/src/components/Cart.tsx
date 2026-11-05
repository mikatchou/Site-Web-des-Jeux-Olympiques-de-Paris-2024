import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext"
import Timer from "./Timer"
import { Trash } from "lucide-react";
import { CgAdd, CgRemove } from "react-icons/cg";
import { Link } from "react-router-dom";

export default function Cart() {
    const { cart, deleteCart, updateItem, setIsCartOpen, deleteItem, errorMessage } = useCart()
    const [timer, setTimer] = useState<number | null>(null);
    const expirationHandled = useRef<number | null>(null);

    useEffect(() => {

        if (!cart) {
            setTimer(null);
            expirationHandled.current = null;
            return;
        }
        const cartId = cart.id;
        const expiresAt = Date.parse(cart.expires_at);
        const updateTimer = () => {
            const remaining = Math.max(
                0,
                Math.ceil((expiresAt - Date.now()) / 1000)
            );
            setTimer(remaining);
            if (remaining === 0 && expirationHandled.current !== cartId) {
                expirationHandled.current = cartId;
                alert("Votre panier a éxpiré.")
                void deleteCart();
            }
        };

        updateTimer();
        const intervalId = window.setInterval(updateTimer, 1000);

        return () => window.clearInterval(intervalId);
    }, [cart?.id, cart?.expires_at, deleteCart]);

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

    return <div className="Cart-div">
        {timer !== null && <div className="timer-div"><Timer start={timer} setTimer={setTimer} /></div>}
        <div className="cart-items">
            {cart &&
                cart.items.map((item) =>
                    <div key={item.id} className="cart-item">
                        <div className="item-information">
                            <div className="discipline-countries-div">
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
                            <div className="item-offer-quantity">
                                <p className="offer-price">Prix : {item.offer.price} euros</p>
                                <div className="quantity-box">
                                    <button className={item.quantity === 1 ? "less-button disabled" : "less-button"} disabled={item.quantity <= 1} onClick={() => updateItem(item.id, (item.quantity - 1))}><CgRemove /></button>
                                    <p className="item-quantity">{item.quantity}</p>
                                    <button className={item.available_seats < item.offer.seat_quantity || item.quantity * item.offer.seat_quantity > 9 ? "more-button disabled" : "more-button"} disabled={item.available_seats < item.offer.seat_quantity || item.quantity * item.offer.seat_quantity === 10} onClick={() => updateItem(item.id, item.quantity + 1)}><CgAdd /></button>
                                </div>
                            </div>
                        </div>
                        <div className="item-setting-div">
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
        <div className="cart-totat-price-div">
            <p className="cart-total-price"> TOTAL : {cart?.total_price} euros</p>
        </div>
        <div className="error-message-div">
            <p className={errorMessage ? `cart-error-message show` : `cart-error-message`}>{errorMessage}</p>
        </div>
        <div className="link-delete-div">
            <Link className="cart-detail-button" to="/panier" onClick={() => setIsCartOpen(false)}>Accéder au panier</Link>
            <button
                className="cart-delete-button"
                onClick={() => {
                    if (window.confirm("Voulez-vous vraiment supprimer votre panier ?")) {
                        deleteCart();
                    }
                }}
                aria-label="Supprimer le panier">
                <Trash />
            </button>
        </div>
    </div>
}