import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest'
import DetailedCart from '../../pages/checkout/DetailedCart';
import cart from "../helpers/cart"

const { mockUseContext, mockUseCart, mockSetStep, mockSetNextStep, mockDetailedCartContent } = vi.hoisted(() => ({
    mockUseContext: vi.fn(),
    mockUseCart: vi.fn(),
    mockSetStep: vi.fn(),
    mockSetNextStep: vi.fn(),
    mockDetailedCartContent: vi.fn(() => "cart component"),
}))
vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    return {
        ...actual,
        useContext: mockUseContext,
    };
})
vi.mock("../../components/CartContext", () => ({
    useCart: mockUseCart,
}))
vi.mock("../../components/checkout/DetailedCartContent", () => ({
    default: mockDetailedCartContent,
}))
vi.mock("react-router-dom", async (importOriginal) => ({
    ...(await importOriginal<typeof import("react-router-dom")>()),
    useOutletContext: () => ({
        setStep: mockSetStep,
        setNextStep: mockSetNextStep,
    }),
}));

type rendererParams = {
    authenticated?: boolean,
    cartExist?: boolean,
    loading?: boolean,
}
async function renderer({ authenticated = true, cartExist = true, loading = false }: rendererParams) {
    const Cart = cartExist == false ? null : cart({})
    mockUseContext.mockReturnValue({
        isAuthenticated: authenticated
    })
    mockUseCart.mockReturnValue({
        cart: Cart,
        loading: loading
    })
    render(
        <MemoryRouter>
            <DetailedCart />
        </MemoryRouter>
    )
}

describe("DetailedCart page", () => {

    it("la page s'affiche avec tout les éléments", async () => {
        await renderer({})
        expect(screen.getByLabelText("cart")).toBeInTheDocument()
        expect(await screen.findByText("cart component")).toBeInTheDocument()
    })

    it("la page affiche un message si le panier est vide ", async () => {
        await renderer({ cartExist: false })
        expect(await screen.findByText("Votre Panier est vide.")).toBeInTheDocument()  //      npm run test:coverage src\__tests__\pages\DetailedCart.test.tsx
    })

    it("la page n'affiche rien si l'utilisateur n'est pas connecté", async () => {
        await renderer({ authenticated: false })
        expect(screen.queryByText("cart component")).not.toBeInTheDocument()
        expect(screen.queryByText("Votre Panier est vide.")).not.toBeInTheDocument()
    })
})

