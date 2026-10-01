import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import '@testing-library/jest-dom'
import Registered from "../../pages/Registered";

describe("Registered Page", () => {
    it("La page de confirmation d'inscription aaffiche un message de succès", async () => {
        render(
            <MemoryRouter>
                <Registered />
            </MemoryRouter>
        )
        expect(await screen.findByText(/Votre compte viens d'être crée !/i)).toBeInTheDocument();
    })
})