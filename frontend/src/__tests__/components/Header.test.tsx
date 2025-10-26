import { render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

describe('composant Header', () => {

    it('rendre le header au chargement de la page', () => {
        render(<MemoryRouter><Header /></MemoryRouter>)
        const header = screen.getByRole('banner')
        expect(header).toBeInTheDocument()
        expect(header).toHaveClass('visible')
    })

    it('ouvrir le menu utilisateur au click du button user', () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    const userButton = screen.getByLabelText('Bouton menu utilisateur')
    fireEvent.click(userButton)
    const userMenuTitle = screen.getByLabelText('Menu utilisateur');
    expect(userMenuTitle).toBeVisible()
    })

    it('ouvrir le menu principal au click du button menu', () => {
        render(<MemoryRouter><Header /></MemoryRouter>)
        const mainMenuButton = screen.getByLabelText('Bouton menu principal')
        fireEvent.click(mainMenuButton)
        const mainMenu = screen.getByLabelText('Menu principal');
        expect(mainMenu).toBeVisible()
    })

    it('fermer le menu utilisateur au click en dehors du menu', async () => {
    render(<MemoryRouter><Header /></MemoryRouter>);

    const userButton = screen.getByLabelText('Bouton menu utilisateur');
    userEvent.click(userButton);

    const userMenu  = screen.getByLabelText('Menu utilisateur');
    expect(userMenu).toBeVisible();

    userEvent.click(document.body);
    expect(userMenu).toHaveClass('closed');

});

})
