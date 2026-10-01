import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import Disciplines from '../../components/Disciplines';
import { server } from '../msw/server';
import { http, HttpResponse } from 'msw';

describe('Disciplines', () => {
    let bouttonPlus : HTMLElement ;
    beforeEach( async () => {
        render(
            <MemoryRouter>
                <Disciplines />
            </MemoryRouter>
        )
        bouttonPlus = await screen.findByRole("button", { name: "Afficher toutes les disciplines" })
    })

    it("récupère et affiche les disciplines", async () => {
        expect(await screen.findByText("nom : 1"))
    })

    it("affiche toutes les disciplines", async () => {
        fireEvent.click(bouttonPlus)
        expect(await screen.findAllByAltText(/nom/)).toHaveLength(20)
    })

    it("ferme les disciplines affichées via le bouton", async () => {
        fireEvent.click(bouttonPlus)
        const bouttonMoins = await screen.findByRole("button", { name: /moins/ })
        fireEvent.click(bouttonMoins)
        expect(await screen.findAllByAltText(/nom/)).toHaveLength(18)
    })
})

describe("Disciplines - serveur injoignable", () => {

    it("affiche un meesage d'erreur quans le serveur est injoignable", async () => {
        server.use(
            http.get('http://127.0.0.1:8000/api/events/disciplines/', () => {
                return HttpResponse.json({ error: 'error server' }, { status: 500 })
            })
        )
        render(
            <MemoryRouter>
                <Disciplines />
            </MemoryRouter>
        )
        expect(await screen.findByText("Erreur réseau ou serveur injoignable."))
    })
})