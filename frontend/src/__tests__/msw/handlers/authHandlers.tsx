import { http, HttpResponse } from 'msw'

const existingEmails = ['existant@example.com', 'deja@pris.com']

export const authHandlers = [

    http.post('http://127.0.0.1:8000/api/auth/inscription/', async ({ request }: { request: Request }) => {
        const body = await request.json()
        
        if (existingEmails.includes(body.email)) {
        return HttpResponse.json(
            { 
            email: ['Un utilisateur avec cet email existe déjà.']
            },
            { status: 400 }
        )
        }
        
        if (!body.email || !body.password) {
        return HttpResponse.json(
            { 
            email: ['Ce champ est obligatoire.'],
            password: ['Ce champ est obligatoire.']
            },
            { status: 400 }
        )
        }
        console.log(body)
        return HttpResponse.json(
            {message: "OK"}, 
            { status: 201 }
        )
    }),
    http.put("http://127.0.0.1:8000/api/auth/activation/undefined/", async () => {
        return new HttpResponse({message: "OK"}, {status: 200})
    })

]