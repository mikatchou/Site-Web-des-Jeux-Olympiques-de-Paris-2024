import { it, expect, describe } from 'vitest'
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Timer from '../../components/Timer';
import '@testing-library/jest-dom'

describe("affichage du timer", () => {
    
    const timer = (n : number) => { 
        render(
            <MemoryRouter>
                <Timer start={n} setTimer={() => {}} />
            </MemoryRouter>
        );
    }
    
    it("affiche le temps restant", () => {
        timer(200)
        expect(screen.getByText(/Temps restant :/i)).toBeInTheDocument();
    })

    it("affiche le temps restant", () => {
        timer(0)
        expect(screen.queryByText(/Temps restant :/i)).not.toBeInTheDocument();
    })
})