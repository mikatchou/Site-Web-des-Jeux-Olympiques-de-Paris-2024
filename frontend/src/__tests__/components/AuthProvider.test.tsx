import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AuthProvider } from "../../components/AuthProvider";
import Header from "../../components/Header";
import { ACCESS_TOKEN } from "../../constants";

function createFakeJwt(payload: object) {
    const base64 = btoa(JSON.stringify(payload));
    return `header.${base64}.signature`;
}

describe("AuthProvider", () => {

    beforeEach(() => {
        localStorage.clear();
    })

        it("affiche se connecter si aucune connexion", () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    < Header />
                </AuthProvider>
            </MemoryRouter>
        )
        expect(screen.getByText("Me connecter")).toBeInTheDocument();
    });

    it("affiche le nom de l'utilisateur connecté", () => {
        localStorage.setItem("first_name", "Mika");
        localStorage.setItem(ACCESS_TOKEN, 
            createFakeJwt({
                sub: "123",
                name: "Mika",
                exp: Math.floor(Date.now() / 1000) + 600,
            })
        );
        render(
            <MemoryRouter>
                <AuthProvider>
                    < Header />
                </AuthProvider>
            </MemoryRouter>
        )
        expect(screen.getByText("Bonjour Mika")).toBeInTheDocument();
    });

    it("génération d'un nouveau token, si token expiré", () => {
        localStorage.setItem("first_name", "Mika");
        localStorage.setItem(ACCESS_TOKEN, 
            createFakeJwt({
                sub: "123",
                name: "Mika",
                exp: Math.floor(Date.now() / 1000) - 60,
            })
        );
        render(
            <MemoryRouter>
                <AuthProvider>
                    < Header />
                </AuthProvider>
            </MemoryRouter>
        )
        waitFor(() => {
            expect(screen.getByText("Bonjour Mika")).toBeInTheDocument();
            screen.debug()
        })
    });
});