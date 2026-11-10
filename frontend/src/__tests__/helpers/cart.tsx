import type { CartType } from "../../types/CartType";

type CartOptions = {
    increases?: boolean;
    expired?: boolean;
    deleteItemId?: number;
};

export default function cart({ increases, expired = false, deleteItemId, }: CartOptions = {}) {

    const quantityAvailability: [number, number, string] = increases === undefined ? [2, 7, "190"] : increases ? [3, 1, "285"] : [1, 7, "95"];
    const expiresAt = expired ? new Date(Date.now() - 1000).toISOString() : new Date(Date.now() + 1000).toISOString();
    const total = deleteItemId ? quantityAvailability[2] : String(Number(quantityAvailability[2]) * 2)

    const cart: CartType = {
        id: 1,
        created_at: "2026-11-21T18:30:00Z",
        expires_at: expiresAt,
        user: 1,
        items: [
            {
                id: 1,
                quantity: quantityAvailability[0],
                total_seats: 2 * quantityAvailability[0],
                offer: {
                    id: 1,
                    name: "Duo",
                    seat_quantity: 2,
                    price: "95",
                    category: 1,
                },
                event: {
                    countries: [
                        "FRA",
                        "TRY"
                    ],
                    date: "2026-11-25T18:30:00Z",
                    discipline_name: "Football",
                    venue_city: "Saint-Denis",
                    venue_name: "Stade de France",
                },
                category_name: "A",
                available_seats: quantityAvailability[1],
            },
            {
                id: 2,
                quantity: 5,
                total_seats: 2 * 5,
                offer: {
                    id: 2,
                    name: "Duo",
                    seat_quantity: 2,
                    price: "95",
                    category: 1,
                },
                event: {
                    countries: [],
                    date: "2026-12-21T18:30:00Z",
                    discipline_name: "Athlétisme",
                    venue_city: "Paris",
                    venue_name: "Centre sportif Léo Lagrange",
                },
                category_name: "A",
                available_seats: quantityAvailability[1],
            }
        ],
        total_price: total,
    }
    if (deleteItemId !== undefined) {
        cart.items = cart.items.filter(item => item.id !== deleteItemId);
    }
    return cart
}