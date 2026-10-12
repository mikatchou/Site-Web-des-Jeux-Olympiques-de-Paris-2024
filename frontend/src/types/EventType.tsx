type EventResult = {
    id: number;
    date: string;
    discipline: {
        id: number;
        name: string;
        image: string;
    };
    venue: {
        name: string;
        city: string;
    };
    teams: {
        country: {
            name: string;
            code: string;
        }
    }[];
    players?: {
        country: {
            name: string;
            code: string;
        }
    }[];
    categories: {
        offers: {
            price: number;
        }[];
    }[];
};

export type { EventResult }