type SearchBarProps = {
    search: string;
    setSearch: (search: string) => void;
}

export default function SearchBar({search, setSearch}: SearchBarProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    };

    return (
        <div>
            <input value={search} type="text" placeholder="Search..." onChange={handleChange} />
        </div>
    );
}