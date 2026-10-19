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
        image?: string;
    };
    teams?: {
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
        name?: string;
        total_seats?: number;
        available_seats?: number;
        offers: {
            seat_quantity?: number;
            id?: number;
            name?: string
            price: number;
        }[];
        id?: string;
    }[];
};

type Filters = {
    "villes": string[],
    "pays": string[],
    "dates": string[],
    "disciplines": string[],
}

type FiltersProps = {
    filters: Filters,
    setDate: React.Dispatch<React.SetStateAction<string>>,
    setDiscipline: React.Dispatch<React.SetStateAction<string>>,
    setVille: React.Dispatch<React.SetStateAction<string>>,
    setPays: React.Dispatch<React.SetStateAction<string>>,
    date: string,
    discipline: string,
    ville: string,
    pays: string
}

export type { EventResult, Filters, FiltersProps }