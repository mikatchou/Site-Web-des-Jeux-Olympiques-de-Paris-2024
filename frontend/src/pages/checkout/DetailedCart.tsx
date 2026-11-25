import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../components/AuthProvider";
import { useCart } from "../../components/CartContext";
import { useOutletContext } from "react-router-dom";
import DetailedCartContent from "../../components/Checkout/DetailedCartContent";

export default function DetailedCart() {
    const cartRef = useRef<HTMLElement | null>(null)
    const { isAuthenticated } = useContext(AuthContext)
    const { cart, loading } = useCart()

    type contextType = {
        setStep: React.Dispatch<React.SetStateAction<string>>;
        setNextStep: React.Dispatch<React.SetStateAction<string[]>>;
        cartExist: boolean;
    }
    const { setStep, setNextStep } = useOutletContext<contextType>();
    useEffect(() => {
        setStep("Panier");
        setNextStep(["commande/facturation", "Aller vers la facturation"]);
    }, [setStep]);

    return <section aria-label="cart" ref={cartRef} id="detailed_cart">
        {isAuthenticated &&
                cart ?
                <DetailedCartContent />
                : !loading && !cart && <div className="empty-div"><p className="empty-cart">Votre Panier est vide.</p></div>}
    </section>
}