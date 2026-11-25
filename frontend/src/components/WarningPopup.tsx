import { Link } from "react-router-dom";

export default function WarningPopup(title: string, description: string, button: string, path: string,) {

    return <div className="popup-overlay">
        <section
            className="popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
        >

            <h2 id="popup-title">{title}</h2>
            <p>{description}</p>

            <Link to={path} className="popup-link">
                {button}
            </Link>
        </section>
    </div>
}