import { http, HttpResponse } from "msw";
import { type EventResult } from "../../../types/EventType";

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

export const eventHandlers = [
    http.get("http://127.0.0.1:8000/api/events/:id", ({ params }) => {

        if (params.id === "1") {
            return HttpResponse.json([eventTest])
        };
        if (params.id === "erreur") {
            return HttpResponse.json(
                { detail: "Événement introuvable" },
                { status: 503 }
            );
        };
        return HttpResponse.json(
            { detail: "Événement introuvable" },
            { status: 404 }
        );
    })
];