import { Link } from "react-router-dom"

export default function NotFound () {
    return <>
        <div className="notfound-container">
            <p className="notfound-p">Désolé, la page recherchée n'existe pas.. </p>
            <Link className="notfound-link" to="/">Aller à la page d'accueil</Link>
        </div>
        <style>{`
            .notfound-container {
                flex: 1;
                display: flex;
                width: 100%;
                gap: 20px;
                font-size: 4lvh;
                padding: 15lvh 0 0 0;
            }
            .notfound-p {
                font-weight: lighter;
                white-space: nowrap;
            }
            .notfound-link {
                text-decoration-line: underline;
            }
            @media (max-width: 800px) {
                .notfound-container {
                    padding: 5lvh 0 0 0;
                    display: flex;
                    flex-direction: column;
                    font-size: 3lvh;
                }
                .notfound-p {
                    white-space: wrap;
                }
            }
    `}</style>
    </>
}