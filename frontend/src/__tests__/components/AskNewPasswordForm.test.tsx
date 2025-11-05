import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import AskNewPasswordForm from '../../components/AskNewPasswordForm';

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe("formulaire de connexion", () => {
    let email: HTMLElement;
    let bouton: HTMLElement;

    beforeEach(() => { 
        render(
            <MemoryRouter>
                <AskNewPasswordForm  setAuth={() => {}} setStep={() => {}} setTimer={() => {}}/>
            </MemoryRouter>
        );
        email = screen.getByLabelText(/e-mail/i)
        bouton = screen.getByRole('button', { name: /bouton_réinitialisation/i })
    })

    const setError = async (
        emailInput: HTMLElement, 
        valueEmail : string,
        errorMessage: string | null
    ) => {
        fireEvent.change(emailInput, { target: { value: valueEmail } });
        fireEvent.click(bouton);

        if (errorMessage) {
            await waitFor(() => {
                expect(screen.queryByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
            });
        }
    };


    it("erreur navigateur si un champ est vide", async () => {
        await setError(email, "existanmple.com","Veuillez entrer une adresse e-mail valide.");
    })

    it("erreur email inexistant", async () => {
        await setError(email, "inexistant@example.com", "Cet email n'est associé à aucun compte existant");
    })

    it("erreur trop d'essais", async () => {
        await setError(email, "blocked@example.com", "Trop de tentatives, veuillez réessayer ultérieurement");
    })

    it("formulaire de connexion avec des données valides", async () => {
        await setError(email, "example@example.com", null);
    })
})