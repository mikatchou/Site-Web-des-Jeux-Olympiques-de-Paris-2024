import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Logo petit.png";
import { IoCartOutline } from "react-icons/io5";
import { TbInvoice } from "react-icons/tb";
import { HiOutlineDocumentText, HiOutlineTicket } from "react-icons/hi";
import { MdOutlinePayment } from "react-icons/md";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import type { IconType } from "react-icons";
import { useEffect, useState } from "react";

export default function CheckoutHeader({ cartExist, loading }: { cartExist: boolean; loading: boolean; }) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const stepLink = (step: string, stepPath: string, title: string, Icon: IconType) => {
        const pathname = useLocation().pathname
        const className = (step: string) => `checkout_step_link ${pathname.includes(step) ? "current_page" : ""}`
        const isCurrent = pathname.includes(step)
        return <li className="checkout_list_li"  aria-label={step} >
            {!cartExist && !loading ?
                <div className={`${className(step)} forbidden-steps`}>
                    <span>
                        {title}
                    </span>
                    <Icon />
                </div>
                : isCurrent ?
                    <div className={className(step)} aria-current="page">
                        <span>
                            {title}
                        </span>
                        <Icon />
                    </div>
                    : <Link className={className(step)} to={stepPath}>
                        <span>
                            {title}
                        </span>
                        <Icon />
                    </Link>
            }
        </li>
    }
    return <header id="checkout_header" className={isVisible ? "visible" : "hidden"}>
        <div id="logo-container">
            <Link className="logo-link" to="/">
                <img id="checkout_logo" src={Logo} alt="Logo des jeux olympiques de Paris 2024" />
            </Link>
        </div>
        <div className="checkout_navigation_container">
            <nav className="checkout_navigation">
                <ul className="checkout_list">
                    {stepLink("panier", "/panier", "Panier détaillé", IoCartOutline)}
                    {stepLink("facturation", "/commande/facturation", "Facturation", TbInvoice)}
                    {stepLink("personnalisation", "/commande/personnalisation", "Personnalisation", HiOutlineTicket)}
                    {stepLink("mode", "/commande/mode-de-paiement", "Mode de paiement", MdOutlinePayment)}
                    {stepLink("recapitulatif", "/commande/recapitulatif", "Récapitulatif", HiOutlineDocumentText)}
                    {stepLink("confirmation", "/commande/confirmation", "Confirmation", HiOutlineCheckCircle)}
                </ul>
            </nav>
        </div>
    </header>
}