import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})
const mockAlert = vi.fn()
window.alert = mockAlert


describe("formulaire d'inscription", () => {
    let passwordInput: HTMLElement;
    let confirmation: HTMLElement;
    let nom: HTMLElement;
    let prénom: HTMLElement;
    let naissance: HTMLElement;
    let pays: HTMLElement;
    let ville: HTMLElement;
    let postal: HTMLElement;
    let adresse: HTMLElement;
    let email: HTMLElement;
    let bouton: HTMLElement;
    beforeEach(() => { 
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );
        passwordInput = screen.getByLabelText(/^mot de passe \*$/i)
        confirmation = screen.getByLabelText(/confirmation/i)
        nom = screen.getByLabelText("Nom *");
        prénom = screen.getByLabelText("Prénom *");
        naissance = screen.getByLabelText(/date de naissance/i)
        pays = screen.getByLabelText(/pays/i)
        ville = screen.getByLabelText(/ville/i)
        postal = screen.getByLabelText(/postal/i)
        adresse = screen.getByLabelText(/adresse complète/i)
        email = screen.getByLabelText(/e-mail/i)
        bouton = screen.getByRole('button', { name: /Créer mon compte/i })
    })

    it("rend le formulaire d'inscription", () => {
        const form = screen.getByRole("form", { name: /formulaire inscription/i });
        expect(form).toBeInTheDocument();
    });

    it('erreur si mot de passe d moins de 10 caractères', async () => {
        await userEvent.type(passwordInput, "azzerty");
        expect(screen.getByText(/Le mot de passe doit contenir au moins 10 caractères/i)).toBeInTheDocument();
    })

    it('erreur si mot de passe sans majuscule', async () => {
        await userEvent.type(passwordInput, "enes.20252025");
        expect(screen.getAllByText(/Il doit contenir au moins une majuscule/i))
    })

    it('erreur si mot de passe sans minuscule', async () => {
        await userEvent.type(passwordInput, "ENES.20252025");
        expect(screen.getAllByText(/Il doit contenir au moins une minuscule/i))
    })

    it('erreur si mot de passe sans  chiffre', async () => {
        await userEvent.type(passwordInput, "Enes.............");
        expect(screen.getAllByText(/Il doit contenir au moins un chiffre/i))
    })

    it('erreur si mot de passe sans caractère spécial', async () => {
        await userEvent.type(passwordInput, "Enes220252025");
        expect(screen.getAllByText(/Il doit contenir au moins un caractère spécial/i))
    })
    

    it("erreur si les mots de passe ne sont pas identiques", async () => {
        await userEvent.type(passwordInput, "Selim.2025");
        await userEvent.type(confirmation, "Selim.2026")
        expect(screen.queryByText(/Les mots de passe doivent être identiques/i)).toBeInTheDocument();
    })
    
    it('aucun erreur si le mot de passe est au bon format', async () => {
        await userEvent.type(passwordInput, "Selim.2025");
        expect(screen.queryByText(/Il doit/i)).not.toBeInTheDocument();
    })

    it("erreur mail existant", async () => {
        fireEvent.change(nom, { target: { value : "Temel" }});
        fireEvent.change(prénom, { target: { value : "Müzemmil" }});
        fireEvent.change(naissance, { target: { value : "1998-02-04" }});
        fireEvent.change(pays, { target: { value : "France" }});
        fireEvent.change(ville, { target: { value : "Deluz" }});
        fireEvent.change(postal, { target: { value : "25960" }});
        fireEvent.change(adresse, { target: { value : "28 rue du tatre" }});
        fireEvent.change(email, { target: { value : 'existant@example.com' }});
        fireEvent.change(passwordInput, { target: { value : "Jeux.Olympiques.2024" }});
        fireEvent.change(confirmation, { target: { value : "Jeux.Olympiques.2024" }});
        fireEvent.click(bouton)
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining('existe déjà'))
        });
    })

    it("Redirection après création de compte", async () => {
        fireEvent.change(nom, { target: { value : "Temel" }});
        fireEvent.change(prénom, { target: { value : "Müzemmil" }});
        fireEvent.change(naissance, { target: { value : "1998-02-04" }});
        fireEvent.change(pays, { target: { value : "France" }});
        fireEvent.change(ville, { target: { value : "Deluz" }});
        fireEvent.change(postal, { target: { value : "25960" }});
        fireEvent.change(adresse, { target: { value : "28 rue du tatre" }});
        fireEvent.change(email, { target: { value : "mika@gmail.com" }});
        fireEvent.change(passwordInput, { target: { value : "Jeux.Olympiques.2024" }});
        fireEvent.change(confirmation, { target: { value : "Jeux.Olympiques.2024" }});
        fireEvent.click(bouton)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/inscription/confirmation")
        });
    }, 6000)
});
