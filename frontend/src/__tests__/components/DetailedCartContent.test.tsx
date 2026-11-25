import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import DetailedCartContent from '../../components/checkout/DetailedCartContent';
import cart from '../helpers/cart';

const { mockUseCart, mockDeleteCart, mockUpdateItem, mockDeleteItem } = vi.hoisted(() => ({
    mockUseCart: vi.fn(),
    mockDeleteCart: vi.fn(),
    mockUpdateItem: vi.fn(),
    mockDeleteItem: vi.fn(),
}));
vi.mock("../../components/CartContext", () => ({
    useCart: mockUseCart,
}));

const mockSetCartExist = vi.fn();
function testTree() {
    return (
        <MemoryRouter>
            <Routes>
                <Route element={<Outlet context={{ setCartExist: mockSetCartExist }} />}>
                    <Route index element={<DetailedCartContent />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

function renderer() {
    return render(testTree());
}

type GetCartOptions = {
    error?: boolean | string;
    increases?: boolean;
    deleteItemId?: number;
    emptyCart?: boolean;
    loading?: boolean;
};
function getCart({ error = false, increases, deleteItemId, emptyCart = false, loading = false }: GetCartOptions = {}) {
    const updated = increases !== undefined ? { increases } : deleteItemId !== undefined ? { deleteItemId } : {};
    const Cart = cart(updated);

    mockUseCart.mockReturnValue({
        updateItem: mockUpdateItem,
        deleteItem: mockDeleteItem,
        deleteCart: mockDeleteCart,
        cart: emptyCart ? null : Cart,
        errorMessage: error,
        loading: loading,
    });

    return Cart;
}

describe("DetailedCartContent component", () => {

    it("le panier s'affiche avec tout les offres", async () => {
        const Cart = getCart()
        renderer()
        const items = document.querySelectorAll(".cart-item");
        const boutonPlus = screen.getAllByLabelText("bouton plus")[0]
        const boutonMoins = screen.getAllByLabelText("bouton moins")[0]
        const date = await screen.findAllByText(new RegExp(String(Cart.items[0].event.date.slice(0, 4)), "i"))

        expect(items).toHaveLength(Cart.items.length)
        expect(screen.getAllByLabelText("quantité offre")[0]).toBeInTheDocument()
        expect(boutonPlus).toBeInTheDocument()
        expect(boutonMoins).toBeInTheDocument()
        expect(boutonMoins).not.toBeDisabled()
        expect(boutonPlus).not.toBeDisabled()
        expect(date[0]).toBeInTheDocument()
    })

    const update = [
        { incrementation: true, parameter: +1, bouton: "bouton plus", update: "incrémentation" },
        { incrementation: false, parameter: -1, bouton: "bouton moins", update: "décrémentation" },
    ]
    it.each(update)("le panier adapte l'affichage à la mise à jour des offres : $update", ({ incrementation, parameter, bouton }) => {
        const cart = getCart();
        const view = renderer();

        mockUpdateItem.mockImplementation(() => {
            getCart({ increases: incrementation });
        });

        fireEvent.click(screen.getAllByLabelText(bouton)[0]);
        expect(mockUpdateItem).toHaveBeenCalledWith(cart.items[0].id, cart.items[0].quantity + parameter)

        view.rerender(testTree());

        const updatedButtons = within(view.container).getAllByLabelText(bouton);
        expect(updatedButtons[0]).toBeDisabled();
    });

    it("le panier adapte l'affichage à la suppression d'une offre", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
        const cart = getCart();
        const view = renderer();
        const deleteItemId = cart.items[0].id

        mockDeleteItem.mockImplementation(() => {
            getCart({ deleteItemId: deleteItemId });
        });

        fireEvent.click(screen.getAllByLabelText("Supprimer cet article du panier")[0]);
        expect(confirmSpy).toHaveBeenCalledWith("Supprimer cet article du panier ?");
        expect(mockDeleteItem).toHaveBeenCalledWith(deleteItemId)

        view.rerender(testTree());

        const deletedItem = within(view.container).queryByTestId(deleteItemId)
        expect(deletedItem).not.toBeInTheDocument()
    });

    it("le panier affiche un message à la suppression du panier", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
        getCart();
        const view = renderer();

        mockDeleteCart.mockImplementation(() => {
            mockUseCart.mockReturnValue({
                updateItem: mockUpdateItem,
                deleteItem: mockDeleteItem,
                deleteCart: mockDeleteCart,
                cart: null,
                errorMessage: null,
                loading: false,
            });
        });

        fireEvent.click(screen.getByLabelText("Supprimer le panier"));
        expect(confirmSpy).toHaveBeenCalledWith("Voulez-vous vraiment supprimer votre panier ?");
        expect(mockDeleteCart).toHaveBeenCalled()

        view.rerender(testTree());

        const deletedItem = view.container.querySelector(".cart-item");
        expect(deletedItem).not.toBeInTheDocument()
        expect(deletedItem).not.toBeInTheDocument()
    });

    it("le panier affiche l'erreur dans l'espace dédié", () => {
        getCart({ error: "une erreur est survenue, veuillez réessayer ultérieurement" })
        renderer()
        expect(screen.getByText("une erreur est survenue, veuillez réessayer ultérieurement")).toBeInTheDocument()
    })

    it("le panier désactive les boutons quantité au loading", async () => {
        getCart({ loading: true })
        renderer()
        const boutonPlus = screen.getAllByLabelText("bouton plus")
        const boutonMoins = screen.getAllByLabelText("bouton moins")
        boutonPlus.forEach((bouton, index) => {
            expect(bouton).toBeDisabled()
            expect(boutonMoins[index]).toBeDisabled()
        });
    })

})

// npm run test:coverage src/__tests__/components/DetailedCartContent.test.tsx