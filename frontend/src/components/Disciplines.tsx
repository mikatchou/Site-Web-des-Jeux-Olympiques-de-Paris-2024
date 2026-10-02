import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/home.css";

export default function Disciplines() {
    type Discipline = {
        id: number;
        name: string;
        image: string;
    };

    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const getDisciplines = async () => {
            try {
                const response = await api.get("events/disciplines/");
                setDisciplines(response.data);
            } catch (err: any) {
                setError("Erreur réseau ou serveur injoignable.");
            }
        };

        getDisciplines();
    }, []);

    const displayed = showAll ? disciplines : disciplines.slice(0, 18);

    return (
        <div className="disciplines_container">
            <h3>Trouvez votre discipline</h3>

            {error && <p>{error}</p>}

            <div className="disciplines_grid">
                {displayed.map((d) => (
                    <div key={d.id} className="discipline_card" onClick={() => navigate(`/recherche/?discipline=${d.id}`)}>
                        <div className="discipline_image">
                            <img src={d.image} alt={d.name} />
                        </div>
                        <div className="discipline_name">
                            <p>{d.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            {disciplines.length > 18 && !showAll && (
                <button className="more_less_button" onClick={() => setShowAll(true)}>
                    Afficher toutes les disciplines
                </button>
            )}

            {showAll && (
                <button className="more_less_button" onClick={() => setShowAll(false)}>
                    Afficher moins
                </button>
            )}
        </div>
    );
}
