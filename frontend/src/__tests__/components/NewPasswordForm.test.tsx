import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import NewPasswordForm from '../../components/NewPasswordForm';

const mockAlert = vi.fn()
window.alert = mockAlert

describe("formulaire de connexion", () => {
    let password: HTMLElement;
    let confirmation: HTMLElement;
    let bouton: HTMLElement;

    beforeEach(() => { 
        render(
            <MemoryRouter>
                <NewPasswordForm  auth_id={120} />
            </MemoryRouter>
        );
        password = screen.getByLabelText("Mot de passe *")
        confirmation = screen.getByLabelText("Confirmation de mot de passe *")
        bouton = screen.getByRole('button', { name: /Valider la modification/i })
    })

    const setError = async (
        passwordInput: HTMLElement, 
        confirmationInput: HTMLElement, 
        valuePassword : string,
        valueConfirmation : string,
        errorMessage: string | null
    ) => {
        fireEvent.change(passwordInput, { target: { value: valuePassword } });
        fireEvent.change(confirmationInput, { target: { value: valueConfirmation } });
        await waitFor(() => {
            expect(passwordInput).toHaveValue(valuePassword);
        });
        fireEvent.click(bouton);

        if (errorMessage) {
            await waitFor(() => {
                expect(screen.queryByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
            });
        }
    };


    it("erreur navigateur si un champ est vide", async () => {
        await setError(password, confirmation, "", "motdepasse","Le mot de passe doit contenir au moins 10 caractères");
    })    
    
    it("erreur mots de passe non identiques", async () => {
        await setError(password, confirmation, "validPassword.2025", "validPassword.2026","Les mots de passe doivent être identiques");
    })

    it("erreur compte bloqué", async () => {
        await setError(password, confirmation, "BlockedAccount..2025", "BlockedAccount..2025", 'Trop de tentatives, veuillez réessayer ultérieurement');
    })

    it("formulaire de connexion avec des données valides", async () => {
        await setError(password, confirmation, "validPassword.2025", "validPassword.2025", null);
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining("Votre mot de passe a bien été réinitialisé, vous allez être redirigé vers la page de connexion."))
        });
    })
})