import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchFilters from "../../components/searchFilters";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

const defaultProps = {
    filters: {
        disciplines: ["Football"],
        villes: ["Paris"],
        pays: ["France"],
        dates: ["2024-07-26"],
    },
    date: "",
    ville: "",
    pays: "",
    setDate: vi.fn(),
    setVille: vi.fn(),
    setPays: vi.fn(),
};
function SearchFiltersWithState() {
    const [discipline, setDiscipline] = useState("football");
    const [ville, setVille] = useState("Paris");
    const [pays, setPays] = useState("France");
    const [date, setDate] = useState("2024-07-26");

    return (
        <SearchFilters
            {...defaultProps}
            discipline={discipline}
            setDiscipline={setDiscipline}
            setDate={setDate}
            setVille={setVille}
            setPays={setPays}
            date={date}
            ville={ville}
            pays={pays}
        />
    );
}

describe("search filters component", () => {


    beforeEach(() => {
        render(
            <MemoryRouter>
                <SearchFiltersWithState />
            </MemoryRouter>
        )
    })

    it("affichage des filtres séléctionnés", () => {
        expect(screen.getByRole("button", { name: /football/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Paris/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /France/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /2024-07-26/i })).toBeInTheDocument();
    })

    it("suppression du filtre séléctionné", async () => {
        const boutonFiltre = screen.getByRole("button", { name: /football/i })
        await userEvent.click(boutonFiltre);
        expect(
            screen.queryByRole("button", { name: /football/i })
        ).not.toBeInTheDocument();

        const boutonFiltrePays = screen.getByRole("button", { name: /France/i })
        await userEvent.click(boutonFiltrePays);
        expect(
            screen.queryByRole("button", { name: /France/i })
        ).not.toBeInTheDocument();

        const boutonFiltreVille = screen.getByRole("button", { name: /Paris/i })
        await userEvent.click(boutonFiltreVille);
        expect(
            screen.queryByRole("button", { name: /Paris/i })
        ).not.toBeInTheDocument();

        const boutonFiltreDate = screen.getByRole("button", { name: /2024-07-26/i })
        await userEvent.click(boutonFiltreDate);
        expect(
            screen.queryByRole("button", { name: /2024-07-26/i })
        ).not.toBeInTheDocument();
    })
})