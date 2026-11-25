import { Outlet } from "react-router-dom"
import "../../styles/checkoutHeader.css"
import CheckoutHeader from "./CheckoutHeader"
import Footer from "../Footer"
import { useContext, useEffect, useRef, useState } from "react"
import { useCart } from "../CartContext"
import Timer from "../Timer"
import Redirection from "../Redirection"
import Summary from "./Summary"
import LoadingIndicator from "../LoadingIndicator"
import { AuthContext } from "../AuthProvider"
import WarningPopup from "../WarningPopup"

export default function CheckoutLayout() {
  const { cart, deleteCart, loading } = useCart()
  const [timer, setTimer] = useState<number | null>(null);
  const expirationHandled = useRef<number | null>(null);
  const [step, setStep] = useState("Panier")
  const [nextStep, setNextStep] = useState<string[]>(["", ""])
  const { isAuthenticated } = useContext(AuthContext)
  const [isExpired, setIsExpired] = useState(false)
  const [warning, setWarning] = useState(false)
  const [cartExist, setCartExist] = useState(true);
  const [anonym, setAnonym] = useState(false)

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
      if (remaining <= 300) {
        setWarning(true)
      }
      setTimer(remaining);
      if (remaining === 0 && expirationHandled.current !== cartId) {
        setIsExpired(true)
        expirationHandled.current = cartId;
        void deleteCart();
      }
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [cart?.id, cart?.expires_at, deleteCart]);

  useEffect(() => {
    if (cart) {
      setCartExist(true);
      return;
    }
    const timer = setTimeout(() => {
      setCartExist(false);
        setAnonym(!isAuthenticated);
    }, 500);

    return () => clearTimeout(timer);
  }, [cart, isAuthenticated]);

  return (
    <>
      <CheckoutHeader cartExist={Boolean(cart)} loading={loading} />
      {loading && <div className="loading-screen"><LoadingIndicator /></div>}
      {!loading && isExpired ? WarningPopup(
        "Panier expiré",
        "Votre panier a expiré, vous allez être rediriger vers la page d'accueil..",
        "Page d'accueil",
        "/"
      ) : !isExpired && !cartExist && step !== "Panier" ? WarningPopup(
        "Panier vide",
        "Votre panier est vide, vous allez être redirigé vers la page d'accueil.",
        "Page d'accueil",
        "/"
      ) : anonym && WarningPopup(
        "Connexion requise",
        "Vous devez vous connecter pour acheter un billet",
        "Connexion",
        "/connexion"
      )}
      <main className="checkout-main">
        {isAuthenticated && <>
          {timer !== null && <div className={`timer-div ${warning && "warning"}`} aria-label="cart timer" ><Timer start={timer} setTimer={setTimer} /></div>}
          <h1 className="step-title">{step}</h1>
          <div className="sections">
            <Outlet context={{ setStep, setNextStep, cartExist }} />
            {cart && <Summary nextStepUrl={nextStep[0]} nextStepName={nextStep[1]} />}
          </div>
          <div className="return-title-div">
            <Redirection />
          </div>
        </>}
      </main>
      <Footer />
    </>
  )
}