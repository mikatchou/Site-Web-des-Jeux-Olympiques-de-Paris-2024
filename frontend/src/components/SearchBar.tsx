// type SearchBarProps = {
//     search: string;
//     setSearch: (search: string) => void;
// }
// {search, setSearch}: SearchBarProps

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom";

type classProps = {
    className?: string;
    menuIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchBar({ className = "", menuIsOpen }: classProps) {
    const [search, setSearch] = useState("")
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        menuIsOpen(false);
        navigate(`/recherche?discipline=${encodeURIComponent(search)}`, {
            state: { searchTime: Date.now() }
        });
        setSearch("")
    }
    return (
        <div id={`${className}searchBar-container`}>
            <form className={`${className}searchBar`} onSubmit={handleSubmit}>
                <input
                    id={`${className}searchBar-input`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    type="search"
                    placeholder="Rechercher…"
                />
                <button id={`${className}searchBar-button`} type="submit" aria-label="Rechercher" onClick={() => menuIsOpen(false)}>
                    <Search size={35} aria-hidden="true" />
                </button>
            </form>
        </div>
    );
}