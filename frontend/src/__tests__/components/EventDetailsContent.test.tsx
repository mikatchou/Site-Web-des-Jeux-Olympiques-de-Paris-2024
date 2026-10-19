import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import EventDetailsContent from "../../components/EventDetailsContent";
import type { EventResult } from "../../types/EventType";

const eventTest: EventResult = {
    id: 1,
    date: "2026-11-21T18:30:00Z",
    discipline: {
        id: 50,
        name: "Athlétisme",
        image: "http://127.0.0.1:8000/media/disciplines/athletisme.png",
    },
    venue: {
        name: "Stade de France",
        city: "Saint-Denis",
        image: "http://127.0.0.1:8000/media/venues/stade-de-france.png",
    },
    teams: [
        { country: { name: "France", code: "FR" } },
        { country: { name: "Turquie", code: "TR" } },
    ],
    players: [],
    categories: [
        {
            id: "1",
            name: "Catégorie A",
            total_seats: 50,
            available_seats: 20,
            offers: [
                {
                    id: 1,
                    name: "Billet standard",
                    seat_quantity: 2,
                    price: 50,
                },
            ],
        },
    ],
};
describe("Event details page", () => {

    beforeEach(() => {
        render(
            <MemoryRouter>
                <EventDetailsContent data={eventTest} />
            </MemoryRouter>
        );
    })

    it("affiche les données de l'événement", async () => {
        expect(await screen.findByText(/Athlétisme/i)).toBeInTheDocument()
        expect(await screen.findByText(/Ajouter/i)).toBeInTheDocument()
    })
    it("l'image s'agrandit et se ferme", async () => {
        const boutonImage = await screen.findByRole("button", { name: /Plan du site/i });
        await userEvent.click(boutonImage);
        const closeButton = await screen.findByRole("button", {name: "Fermer l’image agrandie"});
        expect(closeButton).toBeInTheDocument();
        await userEvent.click(closeButton);
        expect(closeButton).not.toBeInTheDocument();
    })
})