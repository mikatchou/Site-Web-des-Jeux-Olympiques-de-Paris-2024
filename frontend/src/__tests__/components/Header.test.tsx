import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../../components/CartContext'
import authenticated_user from '../helpers/connected_user'
import { AuthProvider } from '../../components/AuthProvider'

describe('composant Header', () => {

    it('rendre le header au chargement de la page', () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>)
        const header = screen.getByRole('banner')
        expect(header).toBeInTheDocument()
        expect(header).toHaveClass('visible')
    })

    it('ouvrir le menu utilisateur au click du button user', () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>)
        const userButton = screen.getByLabelText('Bouton menu utilisateur')
        fireEvent.click(userButton)
        const userMenuTitle = screen.getByLabelText('Menu utilisateur');
        expect(userMenuTitle).toBeVisible()
    })

    it('ouvrir le menu principal au click du button menu', () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>)
        const mainMenuButton = screen.getByLabelText('Bouton menu principal')
        fireEvent.click(mainMenuButton)
        const mainMenu = screen.getByLabelText('Menu principal');
        expect(mainMenu).toBeVisible()
    })

    it('ferme le menu utilisateur au click en dehors du menu', async () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>);
        const userButton = screen.getByLabelText('Bouton menu utilisateur');
        userEvent.click(userButton);
        const userMenu = screen.getByLabelText('Menu utilisateur');
        expect(userMenu).toBeVisible();
        userEvent.click(document.body);
        expect(userMenu).toHaveClass('closed');
    });

    it('ouvre le panier au click du button panier : deconnecté', () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>)
        const cartButton = screen.getByLabelText('Bouton panier')
        fireEvent.click(cartButton)
        const cart = screen.getByLabelText('cart');
        expect(cart).toBeVisible()
        expect(screen.getByText('vous devez être connécté(e)')).toBeInTheDocument()
    })

    it('ouvre et affiche le panier au click du button panier : connecté', () => {
        authenticated_user()
        render(<MemoryRouter><AuthProvider><CartProvider><Header /></CartProvider></AuthProvider></MemoryRouter>)
        const cartButton = screen.getByLabelText('Bouton panier')
        fireEvent.click(cartButton)
        const cart = screen.getByLabelText('cart');
        expect(cart).toBeVisible()
        expect(screen.getByText('Panier')).toBeInTheDocument()
    })

    it('ferme le panier au click en dehors du panier', async () => {
        render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>);
        const cartButton = screen.getByLabelText('Bouton panier');
        userEvent.click(cartButton);
        const cart = screen.getByLabelText('cart');
        expect(cart).toBeVisible();
        userEvent.click(document.body);
        expect(cart).toHaveClass('closed');
    });

})
