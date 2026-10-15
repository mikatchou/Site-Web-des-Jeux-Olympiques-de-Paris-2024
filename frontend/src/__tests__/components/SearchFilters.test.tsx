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

    return (
        <SearchFilters
            {...defaultProps}
            discipline={discipline}
            setDiscipline={setDiscipline}
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
    })

    it("suppression du filtre séléctionné", async () => {
        const boutonFiltre = screen.getByRole("button", { name: /football/i })
        await userEvent.click(boutonFiltre);
        expect(
            screen.queryByRole("button", { name: /football/i })
        ).not.toBeInTheDocument();
    })
})