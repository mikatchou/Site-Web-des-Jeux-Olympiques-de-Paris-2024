import CheckoutLayout from '../../components/Checkout/CheckoutLayout';
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useOutletContext } from 'react-router-dom';
import { describe, expect, it, vi } from "vitest";
import { useEffect } from 'react';
import cart from '../helpers/cart';


const { mockUseCart, mockDeleteCart, mockUseContext } = vi.hoisted(() => ({
    mockUseCart: vi.fn(),
    mockDeleteCart: vi.fn(),
    mockUseContext: vi.fn(),
}));
vi.mock("../../components/CartContext", () => ({
    useCart: mockUseCart,
}));
vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();

    return {
        ...actual,
        useContext: mockUseContext,
    };
});
vi.mock("../../components/checkout/CheckoutHeader", () => ({
    default: () => <header data-testid="checkout header" />
}))
vi.mock("../LoadingIndicator", () => ({
    default: () => <div data-testid="loading-indicator" />
}))
vi.mock("../../components/Footer", () => ({
    default: () => <footer data-testid="footer" />
}))
vi.mock("../../components/checkout/Summary", () => ({
    default: ({ nextStepUrl, nextStepName }: { nextStepUrl: string; nextStepName: string; }) => <div data-testid="summary">
        <a href={nextStepUrl}>{nextStepName}</a>
    </div>
}))

type PageType = {
    setStep: (step: string) => void;
    setNextStep: (value: string[]) => void;
    cartExist: boolean;
};
function Page() {
    const { setStep, setNextStep, cartExist } =
        useOutletContext<PageType>();

    useEffect(() => {
        setStep("Panier");
        setNextStep([
            "commande/facturation",
            "Aller vers la facturation",
        ]);
    }, [setStep, setNextStep]);

    return (
        <div data-testid="page">
            {cartExist ?
                <span data-testid="panier-détaillé">Panier détaillé</span>
                : <span data-testid="panier-vide">Panier Vide</span>
            }
        </div>
    );
}
describe("CheckoutLayout component", () => {

    async function renderChekoutLayout(authenticated = false) {
        localStorage.clear()
        mockUseContext.mockReturnValue({ isAuthenticated: authenticated });

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<CheckoutLayout />}>
                        <Route index element={<Page />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        )
    }

    it("tout les éléments s'affichent", async () => {
        mockUseCart.mockReturnValue({
            cart: cart({}),
            deleteCart: vi.fn(),
            loading: false,
        });
        await renderChekoutLayout(true)
        expect(screen.getByTestId("checkout header")).toBeInTheDocument();
        expect(screen.getByTestId("page")).toBeInTheDocument();
        expect(screen.getByTestId("summary")).toBeInTheDocument();
        expect(screen.getByText("Panier")).toBeInTheDocument();
        expect(screen.getByText("Aller vers la facturation")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    })

    it("adapte l'affichage si le panier est inexistant", async () => {
        mockUseCart.mockReturnValue({
            cart: null,
            deleteCart: vi.fn(),
            loading: false,
        });
        await renderChekoutLayout(true)
        expect(screen.getByTestId("checkout header")).toBeInTheDocument();
        expect(screen.getByTestId("page")).toBeInTheDocument();
        expect(screen.queryByTestId("summary")).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId("panier-vide")).toBeInTheDocument();
        });
        expect(screen.queryByText("Aller vers la facturation")).not.toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    })

    it("affiche un message si l'utilisateur n'est pas connecté", async () => {
        mockUseCart.mockReturnValue({
            cart: null,
            deleteCart: vi.fn(),
            loading: false,
        });
        await renderChekoutLayout()
        await waitFor(() => {
            expect(screen.queryByText(/Connexion requise/i)).toBeInTheDocument()
        })
    })

    it("adapte l'affichage et affiche un message quand le panier expire", async () => {
        mockDeleteCart.mockImplementation(() => {
            mockUseCart.mockReturnValue({
                cart: null,
                deleteCart: mockDeleteCart,
                loading: false,
            });
        });

        mockUseCart.mockReturnValue({
            cart: cart({ expired: true }),
            deleteCart: mockDeleteCart,
            loading: false,
        });

        await renderChekoutLayout(true)
        await waitFor(() => {
            expect(screen.getByText("Panier expiré")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.queryByTestId("summary")).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.queryByLabelText("cart timer")).not.toBeInTheDocument();
        });
        expect(await screen.findByTestId("panier-vide")).toBeInTheDocument()
    })
})