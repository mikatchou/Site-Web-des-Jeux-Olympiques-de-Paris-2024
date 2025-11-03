import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import OtpForm from '../../components/OtpForm';

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe('connexion: étape 2 - code otp', () => {
    let otpInput: HTMLElement;
    let bouton: HTMLElement;
    beforeEach(() => {
        render(
            <MemoryRouter>
                <OtpForm  auth={120} timer={300} setTimer={() => {}}/>
            </MemoryRouter>
        );
        otpInput = screen.getByLabelText("otp_input");
        bouton = screen.getByRole('button', { name: /bouton_otp/i })
    })

    const setError = async (
        value: string,
        errorMessage?: string | null
    ) => {
        fireEvent.change(otpInput, { target: { value: value } });
        fireEvent.click(bouton);

        if (errorMessage) {
            await waitFor(() => {
                expect(screen.queryByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
            });
        }
    };
    
    it("erreur si le champ est vide", async () => {
        await setError("", "Veuillez saisir un code")
    })

    it("erreur si authentification inexistant", async () => {
        await setError("inexistant_auth", "Aucune tentative de connexion")
    })
    
    it("erreur si le compte est bloqué", async () => {
        await setError("blocked@example.com", "Trop de tentatives")
    })

    it("erreur si le compte est expiré", async () => {
        await setError("expired", "Le code a expiré")
    })

    it("connexion validé", async () => {
        await setError("nouveau_code", "")
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled()
        });
    })
})


describe("connexion: étape 2 - nouveau code otp", () => {
    let bouton: HTMLElement;
    let rerender: ReturnType<typeof render>["rerender"];

    beforeEach(() => {
        const utils = render(
        <MemoryRouter>
            <OtpForm auth={120} timer={null} setTimer={() => {}} />
        </MemoryRouter>
        );
        rerender = utils.rerender;
        bouton = screen.getByRole("button", { name: /bouton_new_otp/i });
    });

    const setRequest = async (authId: number | null, message: string | null) => {

        rerender(
        <MemoryRouter>
            <OtpForm auth={authId} timer={null} setTimer={() => {}} />
        </MemoryRouter>
        );

        fireEvent.click(bouton);

        if (message) {
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(message, "i"))).toBeInTheDocument();
        });
        }
    };

    it("erreur id associé à aucune connexion", async () => {
        await setRequest(120, "Aucune tentative de connexion");
    });

    it("erreur si compte bloqué", async () => {
        await setRequest(121, "Trop de tentatives");
    });

    it("erreur si code toujours valide", async () => {
        await setRequest(123, "un code à été déjà envoyé");
    });
});

