import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CartProvider } from "../../components/CartContext";
import Header from "../../components/Header";
import '@testing-library/jest-dom'
import { AuthProvider } from "../../components/AuthProvider";
import authenticated_user from "../helpers/connected_user";
import Cart from "../../components/Cart";
import userEvent from "@testing-library/user-event";
import { server } from "../msw/server";
import { http, HttpResponse } from "msw";                      /*  npm run test src/__tests__/components/Cart.test.tsx     */
import cart from "../helpers/cart";

describe("Cart Component", () => {

    async function renderCart(authenticated?: boolean, header?: boolean) {
        if (authenticated) {
            await authenticated_user();
        }
        render(
            <MemoryRouter>
                <AuthProvider>
                    <CartProvider>
                        {header ? <Header /> : <Cart />}
                    </CartProvider>
                </AuthProvider>
            </MemoryRouter>
        )
    }

    it("affiche un message si le panier est vide", async () => {
        server.use(
            http.get("http://127.0.0.1:8000/api/carts/cart/", () =>
                HttpResponse.json(
                    { detail: "Panier introuvable" },
                    { status: 404 }
                )
            )
        );
        await renderCart(true, true)
        expect(await screen.findByText(/Votre Panier est vide./i)).toBeInTheDocument()
    })

    it("affiche le panier avec l'offre et le timer", async () => {
        await renderCart(true, true)
        const cart = screen.getByLabelText('cart');
        expect(cart).toBeVisible()
        await userEvent.click(cart)
        expect(await screen.findByLabelText("panier")).toBeInTheDocument()
        expect(screen.getByLabelText("cart timer")).toBeInTheDocument()
        const boutonPlus = await screen.findAllByLabelText("bouton plus")
        expect(boutonPlus[1]).toBeDisabled()
    })

    it("augmente la quantité d'une offre", async () => {
        await renderCart(true)
        const quantiteOffre = await screen.findAllByText("2", {
            selector: ".item-quantity",
        });
        expect(quantiteOffre[0]).toBeInTheDocument();
        expect(await screen.findByText(/380/i)).toBeInTheDocument()
        const boutonPlus = await screen.findAllByLabelText("bouton plus")
        await userEvent.click(boutonPlus[0])
        const NouvellequantiteOffre = await screen.findAllByText("3", {
            selector: ".item-quantity",
        });
        expect(NouvellequantiteOffre[0]).toBeInTheDocument();
        expect(await screen.findByText(/570/i)).toBeInTheDocument()
    })

    it("baisse la quantité d'une offre à 1 est désactive le bouton moins", async () => {
        await renderCart(true)
        server.use(
            http.put("http://127.0.0.1:8000/api/carts/cart/item/:id/", () =>
                HttpResponse.json(cart({ increases: false }), { status: 200 })
            )
        )
        const quantiteOffre = await screen.findAllByText("2", {
            selector: ".item-quantity",
        });
        expect(quantiteOffre[0]).toBeInTheDocument();
        expect(await screen.findByText(/380/i)).toBeInTheDocument()
        const boutonMoins = await screen.findAllByLabelText("bouton moins")
        await userEvent.click(boutonMoins[0])
        const NouvellequantiteOffre = await screen.findAllByText("1", {
            selector: ".item-quantity",
        });
        expect(NouvellequantiteOffre[0]).toBeInTheDocument();
        expect(await screen.findByText(/190/i)).toBeInTheDocument()
        expect(boutonMoins[0]).toBeDisabled()
    })

    it("affiche si quantité insufisante", async () => {
        await renderCart(true)
        server.use(
            http.put("http://127.0.0.1:8000/api/carts/cart/item/:id/", () =>
                HttpResponse.json(
                    { detail: "Places insuffisantes : 5 places disponibles." },
                    { status: 400 }
                )
            )
        )

        const quantiteOffre = await screen.findByText("2", {
            selector: ".item-quantity",
        });
        expect(quantiteOffre).toBeInTheDocument();
        const boutonPlus = await screen.findAllByLabelText("bouton plus")
        await userEvent.click(boutonPlus[0])
        expect(await screen.findByText("Places insuffisantes : 5 places disponibles.")).toBeInTheDocument()
    })

    it("supprime une offre du panier", async () => {
        let currentCart = cart();

        server.use(
            http.get("http://127.0.0.1:8000/api/carts/cart/", () =>
                HttpResponse.json(currentCart)
            ),
            http.delete(
                "http://127.0.0.1:8000/api/carts/cart/item/:id/",
                ({ params }) => {
                    currentCart = cart({ increases: false, deleteItemId: Number(params.id) });
                    return new HttpResponse(null, { status: 204 });
                }
            )
        );

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await renderCart(true);

        expect(
            await screen.findAllByLabelText("Supprimer cet article du panier")
        ).toHaveLength(2);

        await userEvent.click(
            screen.getAllByLabelText("Supprimer cet article du panier")[0]
        );

        await waitFor(() => {
            expect(
                screen.getAllByLabelText("Supprimer cet article du panier")
            ).toHaveLength(1);
        });

        vi.restoreAllMocks();
    });

    it("supprime le panier", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        await renderCart(true, true);
        const cartDeleteButton = await screen.findByLabelText("Supprimer le panier")
        expect(cartDeleteButton).toBeInTheDocument();
        await userEvent.click(cartDeleteButton);
        expect(await screen.findByText("Votre Panier est vide.")).toBeInTheDocument();
        vi.restoreAllMocks();
    })

    it("suprime le panier à l'expiration de celui-ci", async () => {

        server.use(
            http.get("http://127.0.0.1:8000/api/carts/cart/", () =>
                new HttpResponse(null, { status: 204 })
            )
        )
        await renderCart(true, true);
        const cartButton = screen.getByLabelText('Bouton panier');
        expect(cartButton).toBeInTheDocument();
        fireEvent.click(cartButton);
        const panier = screen.getByLabelText('cart');
        expect(panier).toBeInTheDocument
        expect(await screen.findByText(/Votre Panier est vide/i)).toBeInTheDocument();

    })

})