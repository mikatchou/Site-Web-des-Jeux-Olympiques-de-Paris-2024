type CartItem = {
    id: number;
    quantity: number;
    total_seats: number;
    offer: {
        id: number;
        name: string;
        seat_quantity: number;
        price: string;
        category: number;
    };
    event : {
        countries: string[];
        date: string;
        discipline_name: string;
        venue_city: string;
        venue_name: string;
    }
    category_name: string;
    available_seats: number;
};

type CartType = {
    id: number;
    created_at: string;
    expires_at: string;
    user: number;
    items: CartItem[];
    total_price: string;
};

export type { CartType };