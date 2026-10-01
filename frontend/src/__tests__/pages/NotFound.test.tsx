import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import NotFound from "../../pages/NotFound";
import '@testing-library/jest-dom'

describe("NotFound page", () => {
    it("afficher la page si introuvable", async () => { 
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        )
        expect(await screen.findByText("Désolé, la page recherchée n'existe pas..")).toBeInTheDocument();
    })
})