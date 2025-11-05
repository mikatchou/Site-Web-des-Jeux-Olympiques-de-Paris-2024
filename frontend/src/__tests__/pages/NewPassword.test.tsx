import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";
import '@testing-library/jest-dom';
import NewPassword from "../../pages/NewPassword";


vi.mock("../../components/AskNewPasswordForm", () => ({
    default: ({ setStep}: { setStep: (step: string) => void }) => (
        <button onClick={() => setStep("otp")}>Valider email</button>
    ),
}));

vi.mock("../../components/OtpForm", () => ({
    default: ({ setStep}: { setStep: (step: string) => void }) => <>
    <button onClick={() => setStep("new")}>Valider otp</button>
    </>
}));


describe("Login Page", () => {
    it("affichage du formulaire mail pour la réinitialisation", async () => {
        render(
            <MemoryRouter>
                <NewPassword />
            </MemoryRouter>
        )
        expect(await screen.findByText(/Demande de réinitialisation/i)).toBeInTheDocument();
    });

    it("affichage du formulaire OTP après changement d'état", async () => {
        render(
            <MemoryRouter>
                <NewPassword />
            </MemoryRouter>
        )
        const button = await screen.findByText("Valider email");
        fireEvent.click(button);
        expect(await screen.findByText("Authentification par code")).toBeInTheDocument();
    });

        it("affichage de réinitialisation après changement d'état", async () => {
        render(
            <MemoryRouter>
                <NewPassword />
            </MemoryRouter>
        )
        const boutonMail = await screen.findByText("Valider email");
        fireEvent.click(boutonMail);
        expect(await screen.findByText("Authentification par code")).toBeInTheDocument();

        const boutonNew = await screen.findByText("Valider otp");
        fireEvent.click(boutonNew);
        expect(await screen.findByText("Réinitialisation du mot de passe")).toBeInTheDocument();
    });
});