import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Register from "../../pages/Register";
import '@testing-library/jest-dom'

describe("Register Page", () => {
    it("La page d'inscription affiche le formulaire d'inscription", async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        )
        screen.debug();
        expect(await screen.findByText("Inscription")).toBeInTheDocument();
        expect(await screen.findByText("Créer mon compte")).toBeInTheDocument();
    })
})