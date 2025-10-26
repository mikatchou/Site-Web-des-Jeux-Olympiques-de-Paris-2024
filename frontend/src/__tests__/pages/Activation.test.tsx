import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter} from "react-router-dom";
import Activation from "../../pages/Activation";
import '@testing-library/jest-dom'

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe("activation du compte", () => {

    beforeEach(() => {
        render (
            <MemoryRouter>
                <Activation />
            </MemoryRouter>
        )
    })
    it("redirection après activation du compte", async () => {
        const loading = screen.getByTestId("loader")
        expect(loading).toBeInTheDocument();
        waitFor(() => {
            expect(loading).not.toBeInTheDocument();
            expect(mockNavigate).toBeCalledWith("/connexion/?actived=true")
        })
    })
})