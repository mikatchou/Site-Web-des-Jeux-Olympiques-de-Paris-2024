import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from "vitest";
import cart from '../helpers/cart';
import Summary from '../../components/checkout/Summary';


const { mockUseCart } = vi.hoisted(() => ({
    mockUseCart: vi.fn(),
}))
vi.mock("../../components/CartContext", () => ({
    useCart: mockUseCart,
}))

describe("Summary component", () => {
    async function SummaryRender(cartExist = true) {
        const Cart = cartExist && cart({})
        mockUseCart.mockReturnValue({
            cart: Cart
        })

        const { container } = render(
            <MemoryRouter>
                <Summary nextStepUrl={"commande/facturation"} nextStepName={"facturation"} />
            </MemoryRouter>
        )
        return { container, Cart }
    }
    const value = (data: string) => screen.findAllByText(new RegExp(String(data), "i"))

    it("le composant affiche les informations de chaque offre du panier ainsi que le prix total", async () => {

        const { container, Cart } = await SummaryRender(true)
        expect(screen.getByText("Résumé")).toBeInTheDocument()

        const items = container.querySelectorAll(".summary-item")
        expect(items).toHaveLength(2);

        const nextButton = container.querySelector("a");
        expect(nextButton).toHaveTextContent("facturation");
        expect(nextButton).toHaveAttribute("href", "/commande/facturation");

        if (Cart) {
            const total = await value(Cart.total_price)
            const tva = await value((Number(Cart.total_price) * 20 / 120).toFixed(2))
            const date = await value(Cart.items[0].event.date.slice(0, 4))
            const quantity = await value(Cart.items[0].quantity.toString())
            const discipline = await value(Cart.items[0].event.discipline_name)

            expect(discipline[0]).toBeInTheDocument()
            expect(quantity[0]).toBeInTheDocument()
            expect(date[0]).toBeInTheDocument()
            expect(total[0]).toBeInTheDocument()
            expect(tva[0]).toBeInTheDocument()
        }
    })

    it("le composant affiche les informations de chaque offre du panier ainsi que le prix total", async () => {

        const { container } = await SummaryRender(false)
        expect(screen.getByText("Résumé")).toBeInTheDocument()

        const items = container.querySelectorAll(".summary-item")
        expect(items).toHaveLength(0);

        const nextButton = container.querySelector("a");
        expect(nextButton).toHaveTextContent("facturation");
        expect(nextButton).toHaveAttribute("href", "/commande/facturation");
    })
})  //                 npm run test src\__tests__\components\Summary.test.tsx