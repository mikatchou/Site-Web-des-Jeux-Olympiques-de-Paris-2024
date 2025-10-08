import { render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Header from '../Header'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import '@testing-library/jest-dom'


const renderWithRouter = (ui: ReactNode) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe('composant Header', () => {

    // Test pour vérifier que le composant Header se rend correctement
    it('rendre le header au chargement de la page', () => {
        renderWithRouter(<Header />)
        const header = screen.getByRole('banner')
        expect(header).toBeInTheDocument()
        expect(header).toHaveClass('visible')
    })

    // Test pour vérifier que le menu utilisateur s'ouvre au clic sur le bouton utilisateur
    it('ouvrir le menu utilisateur au click du button user', () => {
    renderWithRouter(<Header />)
    const userButton = screen.getByLabelText('Menu utilisateur')
    fireEvent.click(userButton)
    const userMenuTitle = screen.getByText(/Bonjour Mika/i)
    expect(userMenuTitle).toBeVisible()
    })

    // Test pour vérifier que le menu principal s'ouvre au clic sur le bouton menu
    it('ouvrir le menu principal au click du button menu', () => {
        renderWithRouter(<Header />)
        const mainMenuButton = screen.getByLabelText('Menu principal')
        fireEvent.click(mainMenuButton)
        const mainMenu = screen.getByTestId('main-menu')
        expect(mainMenu).toBeVisible()
    })

    // Test pour vérifier que le menu utilisateur se ferme au clic en dehors du menu
    it('fermer le menu utilisateur au click en dehors du menu', () => {
        renderWithRouter(<Header />)
        const userButton = screen.getByLabelText('Menu utilisateur')
        fireEvent.click(userButton)
        const userMenuTitle = screen.getByText(/Bonjour Mika/i)
        expect(userMenuTitle).toBeVisible()
        userEvent.click(document.body)
        expect(userMenuTitle).toHaveClass('closed')
    })
})
