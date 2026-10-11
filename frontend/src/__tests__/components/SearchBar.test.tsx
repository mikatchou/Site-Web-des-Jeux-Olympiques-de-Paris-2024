import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchBar from "../../components/SearchBar";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";


describe("searchBar", () => {
    const menuIsOpen = vi.fn()

    function Currenturl() {
        const location = useLocation()
        return <p data-testid="current-url">{location.pathname}{location.search}</p>
    }

    let user: ReturnType<typeof userEvent.setup>;
    let input: HTMLInputElement;
    let bouton: HTMLButtonElement;

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
        render(
            <MemoryRouter>
                <SearchBar menuIsOpen={menuIsOpen} />
                <Currenturl />
            </MemoryRouter>
        )
        input = screen.getByPlaceholderText(/rechercher/i);
        bouton = screen.getByRole("button", { name: "Rechercher" });
    })


    it("affichage du composant et saisit dans le champ de saisit", async () => {
        await user.type(input, "football")
        expect(input).toHaveValue("football");
    })

    it('redirection avec le mot clé en paramètre de l\'url', async () => {
        await user.type(input, "football")
        await user.click(bouton)
        expect(screen.getByTestId("current-url")).toHaveTextContent("/recherche?discipline=football")
    })
})