import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from '../../components/LoginForm';
import '@testing-library/jest-dom'

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe("formulaire de connexion", () => {
    let passwordInput: HTMLElement;
    let email: HTMLElement;
    let bouton: HTMLElement;

    beforeEach(() => { 
        render(
            <MemoryRouter>
                <LoginForm setAuth={() => {}} setStep={()=> {}} setTimer={() => {}}/>
            </MemoryRouter>
        );
        passwordInput = screen.getByLabelText(/^mot de passe \*$/i)
        email = screen.getByLabelText(/e-mail/i)
        bouton = screen.getByRole('button', { name: /bouton_connexion/i })
    })

    const setError = async (
        emailInput: HTMLElement, 
        valueEmail : string,
        valuePassword: string,
        errorMessage: string | null
    ) => {
        fireEvent.change(emailInput, { target: { value: valueEmail } });
        fireEvent.change(passwordInput, { target: { value: valuePassword } });
        fireEvent.click(bouton);

        if (errorMessage) {
            await waitFor(() => {
                expect(screen.queryByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
            });
        }
    };


    it("erreur navigateur si un champ est vide", async () => {
        await setError(email, "existant@example.com", "", "Veuillez entrer un mot de passe");
    })

    it("erreur email inexistant", async () => {
        await setError(email, "inexistant@example.com", "Jeux.Olympiques.2024", "Identifiants incorrects");
    })

    it("erreur trop d'essais", async () => {
        await setError(email, "blocked@example.com", "Jeux.Olympiques.2024", "Trop de tentatives, veuillez réessayer ultérieurement");
    })

    it("erreur email innactif", async () => {
        await setError(email, "inactif@example.com", "Jeux.Olympiques.2024", "Votre compte n'est pas actif, veuillez cliquer sur le lien d'activation qui vous a été envoyé par e-mail");
    })

    it("message pour une reconnexion avec code déjà envoyé", async () => {
        await setError(email, "valid_code@example.com", "Jeux.Olympiques.2024", null);
    })

    it("formulaire de connexion avec des données valides", async () => {
        await setError(email, "example@example.com", "Jeux.Olympiques.2024", null);
    })
})