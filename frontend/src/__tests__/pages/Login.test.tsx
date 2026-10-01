import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";
import '@testing-library/jest-dom';
import Login from "../../pages/Login";


vi.mock("../../components/LoginForm", () => ({
    default: ({ setStep}: { setStep: (step: string) => void }) => (
        <button onClick={() => setStep("otp")}>Passer à OTP</button>
    ),
}));

vi.mock("../../components/OtpForm", () => ({
    default: () => <h1>formulaire</h1>,
}));

describe("Login Page", () => {
    it("affichage du formulaire de connexion par default", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )
        expect(await screen.findByText(/Connexion/i)).toBeInTheDocument();
    });

    it("affichage du formulaire OTP après changement d'état", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )
        const button = await screen.findByText("Passer à OTP");
        fireEvent.click(button);
        expect(await screen.findByText("Connexion: étape 2")).toBeInTheDocument();
    });
});