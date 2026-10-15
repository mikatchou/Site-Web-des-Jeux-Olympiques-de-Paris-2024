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

type Filters = {
        "villes": string[],
        "pays": string[],
        "dates": string[],
        "disciplines": string[],
    }

type FiltersProps = {
    filters : Filters,
    setDate  : React.Dispatch<React.SetStateAction<string>>, 
    setDiscipline  : React.Dispatch<React.SetStateAction<string>>,
    setVille  : React.Dispatch<React.SetStateAction<string>>, 
    setPays  : React.Dispatch<React.SetStateAction<string>>,
    date: string,
    discipline: string,
    ville: string,
    pays: string
}

export type { EventResult, Filters, FiltersProps}