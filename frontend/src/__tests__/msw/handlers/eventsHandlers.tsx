import { http, HttpResponse } from "msw";
import { type EventResult } from "../../../types/EventType";

function datasets(index: number) {
    const dataset: EventResult[] = []
    for (let i = index; i < index + 2; i++) {
        dataset.push(
            {
                id: i,
                "categories": [
                    {
                        offers: [
                            { price: 50.00 },
                            { price: 750.00 },
                        ]
                    },
                    {
                        offers: [
                            { price: 50.00 },
                            { price: 750.00 },
                        ]
                    }
                ],
                date: "2026-10-21T00:00:00Z",
                discipline: {
                    id: 1,
                    image: "http://127.0.0.1:8000/media/disciplines/athletisme-de4cd2ae-27d5-4351-9d3e-9eee606dd5bb.png",
                    name: `Athlétisme${i}`
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
        );
    }
    return dataset
}

export const eventsHandlers = [

    http.get("http://127.0.0.1:8000/api/events/search/", ({ request }) => {
        const url = new URL(request.url);

        if (url.searchParams.get("offset") === "2") {
            return HttpResponse.json({
                count: 7,
                next: null,
                previous: null,
                results: datasets(1),
            });
        }

        if (url.searchParams.get(("discipline")) == "error") {
            return HttpResponse.json(
                { detail: "Erreur de test" },
                { status: 400 }
            );
        }

        return HttpResponse.json({
            count: 3,
            next: "http://127.0.0.1:8000/api/events/search/?discipline=&limit=2&offset=2",
            previous: null,
            results: datasets(10),
        });
    }),
]