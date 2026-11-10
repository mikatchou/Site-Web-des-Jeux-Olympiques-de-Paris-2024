import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import EventDetailsContent from "../../components/EventDetailsContent";
import { CartProvider } from "../../components/CartContext";
import event from "../helpers/event";
import authenticated_user from "../helpers/connected_user";
import { AuthProvider } from "../../components/AuthProvider";
import { server } from "../msw/server";
import { http, HttpResponse } from "msw";
import cart from "../helpers/cart";
import Header from "../../components/Header";

describe("Event details page", () => {

    async function renderEventDetails(authenticated: boolean) {
        if (authenticated) {
            await authenticated_user();
            server.use(
                http.get("http://127.0.0.1:8000/api/carts/cart/", () =>
                    HttpResponse.json({ ...cart, items: [] })
                )
            );
        }
        render(
            <MemoryRouter>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <EventDetailsContent data={event} />
                    </CartProvider>
                </AuthProvider>
            </MemoryRouter>
        );
        if (authenticated) {
            await screen.findByText("Bonjour Mika");
        }
        return screen.getAllByRole("button", { name: /Ajouter/i })[0];
    }

    it("affiche les données de l'événement", async () => {
        renderEventDetails(false)
        expect(await screen.findByText(/Football/i)).toBeInTheDocument()
        expect(await screen.findByText(/Ajouter/i)).toBeInTheDocument()
    })

    it("l'image s'agrandit et se ferme", async () => {
        renderEventDetails(false)
        const boutonImage = await screen.findByRole("button", { name: /Plan du site/i });
        await userEvent.click(boutonImage);
        const closeButton = await screen.findByRole("button", { name: "Fermer l’image agrandie" });
        expect(closeButton).toBeInTheDocument();
        await userEvent.click(closeButton);
        expect(closeButton).not.toBeInTheDocument();
    })

    it("affichage des informations approprié selon la disponibilité des places", async () => {
        const boutonAjouter = await renderEventDetails(false);
        const boutonIndisponible = screen.getByRole("button", { name: "indisponible" });
        expect(boutonAjouter).toBeEnabled();
        expect(boutonIndisponible).toBeDisabled();
    })

    it("affiche un message au clique du bouton ajouter si utilisateur non connecté", async () => {
        const boutonAjouter = await renderEventDetails(false)
        fireEvent.click(boutonAjouter);
        expect(await screen.findByText("Connexion requise")).toBeInTheDocument()
    })

    it("ajout du billet dans le panier et ouverture du panier", async () => {
        const boutonAjouter = await renderEventDetails(true)
        await userEvent.click(boutonAjouter);
        expect(screen.queryByText("Connexion requise")).not.toBeInTheDocument();
        expect(await screen.findByLabelText("bouton afficher panier dans offre")).toBeInTheDocument();
    })

    it("affichage erreur si place non disponible", async () => {
        server.use(
            http.post("http://127.0.0.1:8000/api/carts/cart/new-item/", () =>
                HttpResponse.json(
                    { detail: "Événement introuvable" },
                    { status: 404 }
                )
            )
        )
        const boutonAjouter = await renderEventDetails(true)
        await userEvent.click(boutonAjouter);
        expect(await screen.findByRole("alert")).toHaveTextContent("Événement introuvable");
    })
})