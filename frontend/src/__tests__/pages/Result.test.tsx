import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Result from "../../pages/Result";
import "@testing-library/jest-dom/vitest";

"npm test -- src/__tests__/pages/Result.test.tsx"

describe("Result Page", () => {

    it("La page de résultat affiche les événements", async () => {
        render(
            <MemoryRouter initialEntries={["/recherche?discipline=football"]}>
                <Result />
            </MemoryRouter>
        )
        expect(screen.getByText(/Résultat pour :/i)).toBeInTheDocument();
        expect(screen.findByText(/Athlétisme0/i))
    })
    it("Affichage des événements suivants", async () => {
        let bouttonPlus: HTMLElement;
        render(
            <MemoryRouter initialEntries={["/recherche?discipline=football"]}>
                <Result />
            </MemoryRouter>
        )
        bouttonPlus = await screen.findByRole("button", { name: "Afficher plus de billets" })
        fireEvent.click(bouttonPlus)
        expect(await screen.findByText(/Fin des résultats/i))
    })

    it("affichage d'un message d'erreur si la requête échoue (status 4xx, 5xx,..)", async () => {
        render(
            <MemoryRouter initialEntries={["/recherche?discipline=error"]}>
                <Result />
            </MemoryRouter>
        )
        expect(
            await screen.findByText("Erreur réseau ou serveur injoignable.")
        ).toBeInTheDocument();
    })
})