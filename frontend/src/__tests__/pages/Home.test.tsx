import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import '@testing-library/jest-dom'
import Home from "../../pages/Home";

describe("Home Page", () => {
    it("La page d'accueil s'affiche corréctement avec les disciplines", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        expect(await screen.findByText(/Page d'accueil/i)).toBeInTheDocument();
        expect(await screen.findByText("nom : 1")).toBeInTheDocument();
    })
})