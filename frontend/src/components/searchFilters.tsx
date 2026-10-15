import { type FiltersProps } from "../types/EventType"
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";


export default function SearchFilters({ filters, setDate, setDiscipline, setVille, setPays, date, discipline, ville, pays }: FiltersProps) {

    function updateFilter(name: string, value: string) {
        switch (name) {
            case "disciplines":
                setDiscipline(value);
                break;
            case "villes":
                setVille(value);
                break;
            case "pays":
                setPays(value);
                break;
            case "dates":
                setDate(value);
                break;
        }
    }
    const deleteFilter = (name: string) => {
        console.log(name)
        switch (name) {
            case "discipline":
                setDiscipline("");
                console.log(name, "  ", discipline)
                break;
            case "ville":
                setVille("");
                break;
            case "pays":
                setPays("");
                break;
            case "date":
                setDate("");
                break;
        }
    }
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const toggleFilter = (name: string) => {
        setOpenFilter((current) => (current === name ? null : name));
    };
    const selectedValues: Record<string, string> = {
        disciplines: discipline,
        dates: date,
        villes: ville,
        pays: pays,
    };
    const filtersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (openFilter === null) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target;

            if (
                target instanceof Element &&
                target.closest(".filter-button, .filter-fieldset")
            ) {
                return;
            }

            setOpenFilter(null);
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openFilter]);

    return <>
        <div className="search-filters-div" ref={filtersRef}>
            <div className="filters-title-div">
                <p className="filter-title">Filtres : </p>
                <div className="filters-div">
                    {Object.entries(filters).map(([name, values]) => {
                        const isOpen = openFilter === name;

                        return (
                            <div className="filter-div">
                                <button
                                    type="button"
                                    className={`filter-button filter-button-${name}`}
                                    aria-expanded={isOpen}
                                    onClick={() => toggleFilter(name)}
                                >
                                    {name.toUpperCase()}
                                    {isOpen ? <IoClose /> : <IoMdArrowDropdown />}
                                </button>

                                <fieldset
                                    className={`filter-fieldset ${isOpen ? "open" : "closed"}`}
                                    aria-hidden={!isOpen}
                                >
                                    {values.map((value) => {
                                        const id = `${name}-${value}`;

                                        return (
                                            <label className="filter-label" key={id} htmlFor={id}>
                                                {value}
                                                <input
                                                    id={id}
                                                    type="radio"
                                                    name={name}
                                                    value={value}
                                                    checked={selectedValues[name] === value}
                                                    onChange={() => {
                                                        updateFilter(name, value);
                                                        setOpenFilter(null);
                                                    }}
                                                />
                                            </label>
                                        );
                                    })}
                                </fieldset>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="selected-filters-div">
                <p>Selectionné(s) : </p>
                {discipline && <button onClick={() => deleteFilter("discipline")} type="button" className="selected-button">{discipline}<IoClose /></button>}
                {date && <button onClick={() => deleteFilter("date")} type="button" className="selected-button">{date}<IoClose /></button>}
                {pays && <button onClick={() => deleteFilter("pays")} type="button" className="selected-button">{pays}<IoClose /></button>}
                {ville && <button onClick={() => deleteFilter("ville")} type="button" className="selected-button">{ville}<IoClose /></button>}
            </div>
        </div>
    </>
}