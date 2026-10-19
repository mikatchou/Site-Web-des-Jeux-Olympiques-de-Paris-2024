import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EventDetails from "../../pages/EventDetails";
import "@testing-library/jest-dom/vitest";

describe("Event details page", () => {

    it("affiche la page et les données de l'événement", async () => {
        render(
            <MemoryRouter initialEntries={["/recherche/billet/1"]}>
                <Routes >
                    <Route path="/recherche/billet/:id" element={<EventDetails />} />
                </Routes>
            </MemoryRouter>
        );
        expect(await screen.findByText(/Athlétisme/i)).toBeInTheDocument()
    })
    it("affichage d'un messsage si event n'existe pas", async () => {
        render(
            <MemoryRouter initialEntries={["/recherche/billet/2"]}>
                <Routes >
                    <Route path="/recherche/billet/:id" element={<EventDetails />} />
                </Routes>
            </MemoryRouter>
        );
        expect(await screen.findByText(/Événement introuvable/i)).toBeInTheDocument()
    });

    it("affichage d'un messsage si erreur serveur", async () => {
        render(
            <MemoryRouter initialEntries={["/recherche/billet/erreur"]}>
                <Routes >
                    <Route path="/recherche/billet/:id" element={<EventDetails />} />
                </Routes>
            </MemoryRouter>
        );
        expect(await screen.findByText(/Une erreur inconnue est survenue, veuillez recharger la page ou réessayer ultérieurement./i)).toBeInTheDocument()
    })
})