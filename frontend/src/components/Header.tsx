import "../styles/header.css";
import { useState, useEffect, useRef } from "react";
import Logo from "../assets/images/Logo petit.png";
import { Link } from "react-router-dom";
import { IoCartOutline, IoClose, IoMenu } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const menuRef = useRef<HTMLElement | null>(null)
    const userMenuRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            setIsVisible(false);
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const handleClickOutside = (event : MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
            }
        };

        if (isMenuOpen || isUserMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen, isUserMenuOpen]);


    return (
        <header className={isVisible ? "visible" : "hidden"}>
        <div id="logo-container">
            <Link to="/">
            <img id="logo" src={Logo} alt="Logo des jeux olympiques de Paris 2024" />
            </Link>
        </div>
        <div id="searchBar"></div>
        <div id="navigation">
            <div id="panier">
            <button id="cartbutton" aria-label="">
                <IoCartOutline style={{ width: '35px', height: '35px', color: 'white' }}/>
            </button>
            </div>
            <div id="user">
            <button id="userbutton" aria-label="Menu utilisateur" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                {isUserMenuOpen ? <IoClose style={{ width: '35px', height: '35px', color: 'white' }} /> : <FaCircleUser style={{ width: '35px', height: '35px', color: 'white' }} />}
            </button>
            </div>
            <div id="block-menu">
            <button id="menubutton" aria-label="Menu principal" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <IoClose style={{ width: '35px', height: '35px', color: 'white' }} /> : <IoMenu style={{ width: '35px', height: '35px', color: 'white' }} />}
            </button>
            </div>
        </div>

        <nav ref={menuRef} id="menu" className={isMenuOpen ? "menu open" : "menu closed"} data-testid="main-menu">
            <ul className="menu-list">
            <li className="menu-puce"><Link to="/">Accueil</Link></li>
            <li className="menu-puce"><Link to="/contact">Contact</Link></li>
            <li className="menu-puce"><Link to="/about-us">A propos</Link></li>
            </ul>
        </nav>
        <nav ref={userMenuRef} id="userMenu" className={isUserMenuOpen ? "menu open" : "menu closed"}>
            <h3 id="userMenuTitle" className="closed">Bonjour Mika</h3>
            <ul className="menu-list">
                <li className="menu-puce"><Link to="/login">Me connecter</Link></li>
                <li className="menu-puce"><Link to="/register">M'inscrire</Link></li>
            </ul>
        </nav>
        </header>
    );
}
