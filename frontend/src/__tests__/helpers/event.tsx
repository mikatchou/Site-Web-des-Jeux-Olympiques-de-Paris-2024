import type { EventResult } from "../../types/EventType";

const event: EventResult = {
    id: 1,
    date: "2026-11-21T18:30:00Z",
    discipline: {
        id: 50,
        name: "Football",
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
            id: 1,
            name: "A",
            total_seats: 50,
            available_seats: 10,
            offers: [
                {
                    id: 1,
                    name: "Duo",
                    seat_quantity: 2,
                    price: 95,
                },
            ],
        },
        {
            id: 5,
            name: "B",
            total_seats: 50,
            available_seats: 0,
            offers: [
                {
                    id: 98,
                    name: "Solo",
                    seat_quantity: 1,
                    price: 50,
                },
            ],
        },
    ],
};
export default event