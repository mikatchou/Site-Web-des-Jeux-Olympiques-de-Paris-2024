import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from "vitest";
import CheckoutHeader from '../../components/checkout/CheckoutHeader';

const { mockUseLocation } = vi.hoisted(() => ({
    mockUseLocation: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
    ...(await importOriginal<typeof import("react-router-dom")>()),
    useLocation: mockUseLocation,
}));


describe("CheckoutHedaer component", () => {

    async function headerRenderer(cartExist: boolean, loading: boolean) {

        const { container } = render(
            <MemoryRouter>
                <CheckoutHeader cartExist={cartExist} loading={loading} />
            </MemoryRouter>)
        return { container }
    }

    it.each([
        { cartExist: false, loading: true, disabled: false },
        { cartExist: false, loading: false, disabled: true },
        { cartExist: true, loading: true, disabled: false },
        { cartExist: true, loading: false, disabled: false },
    ])("cartExist=$cartExist, loading=$loading : navigation désactivée=$disabled",
        async ({ cartExist, loading, disabled }) => {

            mockUseLocation.mockReturnValue({ pathname: "/panier" });

            const { container } = await headerRenderer(cartExist, loading)
            const currentStep = container.querySelector("div.current_page");
            const header = container.querySelector("header");
            expect(header).toHaveClass('visible')
            expect(currentStep).toHaveClass("current_page");
            expect(currentStep).toBeInTheDocument();

            const links = container.querySelectorAll("a.checkout_step_link");
            const disabledLinks = container.querySelectorAll(".forbidden-steps");
            if (disabled) {
                expect(container.querySelector(".forbidden-steps") !== null).toBe(disabled);
                expect(disabledLinks).toHaveLength(6) // npm run test:coverage -- src/__tests__/components/CheckoutHeader.test.tsx
            } else {
                expect(disabledLinks).toHaveLength(0)
                expect(links).toHaveLength(5)
                expect(links[0]).toHaveAttribute("href", "/commande/facturation");
            }
        });

    it("masque le header en descendant et le réaffiche en remontant", () => {
        mockUseLocation.mockReturnValue({ pathname: "/panier" });

        headerRenderer(true, false)

        const header = screen.getByRole("banner");
        expect(header).toHaveClass("visible");

        Object.defineProperty(window, "scrollY", {
            configurable: true,
            value: 100,
        });
        fireEvent.scroll(window);
        expect(header).toHaveClass("hidden");

        Object.defineProperty(window, "scrollY", {
            configurable: true,
            value: 50,
        });
        fireEvent.scroll(window);
        expect(header).toHaveClass("visible");
    });
})    