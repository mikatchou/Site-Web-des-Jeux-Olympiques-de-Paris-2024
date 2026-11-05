import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Event from "../../components/Event";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { EventResult } from "../../types/EventType";


const dataset: EventResult = {
    id: 5,
    categories: [
        {
            offers: [
                { id: 1, seat_quantity: 1, price: 50.00 },
                { id: 2, seat_quantity: 1, price: 750.00 },
            ]
        },
        {
            offers: [
                { id: 3, seat_quantity: 1, price: 50.00 },
                { id: 4, seat_quantity: 1, price: 750.00 },
            ]
        }
    ],
    date: "2026-10-21T00:00:00Z",
    discipline: {
        id: 1,
        image: "http://127.0.0.1:8000/media/disciplines/athletisme-de4cd2ae-27d5-4351-9d3e-9eee606dd5bb.png",
        name: `Athlétisme`
    },
    players: [
        {
            country: {
                name: "Turkey",
                code: "TR"
            }
        },
        {
            country: {
                name: "france",
                code: "fr"
            }
        }
    ],
    teams: [],
    venue: {
        name: "stade de montparnasse",
        city: "saint-ouen"
    }
}
describe("Event", () => {
    render (<MemoryRouter>
        <Event key={dataset.id} data={dataset} />
    </MemoryRouter>
    )

    it('à partir des données fournit, le composant prépare et rend un événement',() => {
        expect(screen.getByText(/Athlétisme/i)).toBeInTheDocument()
    })
})