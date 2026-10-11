import { http, HttpResponse } from 'msw'

const existingEmails = 'existant@example.com'
const inexistingEmails = 'inexistant@example.com'
const blockedEmails = 'blocked@example.com'
const inactifEmails = 'inactif@example.com'
const valid_codeEmails = 'valid_code@example.com'


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
        return HttpResponse.json(
            {message: "OK"}, 
            { status: 201 }
        )
    }),

    http.put("http://127.0.0.1:8000/api/auth/activation/undefined/", async () => {
        return new HttpResponse({message: "OK"}, {status: 200})
    }),

    http.post("http://127.0.0.1:8000/api/auth/connexion/", async ({ request }: { request: Request }) => {
        const body = await request.json()

        if (inexistingEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ['Identifiants incorrects']
                },
                { status: 401 }
            )
        }

        if (blockedEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ['Trop de tentatives, veuillez réessayer ultérieurement']
                },
                { status: 403 }
            )
        }

        if (inactifEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ["Votre compte n'est pas actif, veuillez cliquer sur le lien d'activation qui vous a été envoyé par e-mail"]
                },
                { status: 401 }
            )
        }

        if (valid_codeEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ["un code à été déjà envoyé dans votre adresse mail"]
                },
                { status: 200 }
            )
        }

        return HttpResponse.json({"success": "un code à été envoyé dans votre adresse mail", "auth_id": 102}, {status:200})
    }),

    http.post("http://127.0.0.1:8000/api/auth/connexion/etape-2/", async ({ request }: { request: Request }) => {
        const body = await request.json()
        const expiredCode = "expired"
        const inexistantAuth = "inexistant_auth"
        
        if (inexistantAuth.includes(body.otp_code)) {
            return HttpResponse.json(
                { 
                error : ['Aucune tentative de connexion n\'a été trouvée, veuillez réesayer de vous connecter']
                },
                { status: 401 }
            )
        }

        if (blockedEmails.includes(body.otp_code)) {
            return HttpResponse.json(
                { 
                error : ['Trop de tentatives, veuillez réessayer ultérieurement']
                },
                { status: 403 }
            )
        }

        if(expiredCode.includes(body.otp_code)) {
            return HttpResponse.json(
                { 
                error : ['Le code a expiré, veuillez faire une nouvelle demande de code']
                },
                { status: 401 }
            )
        }

        return HttpResponse.json({"success": "Connexion validée"}, {status: 200})
    }),

    // http.post("http://127.0.0.1:8000/api/auth/connexion/etape-2/", async ({ request }: { request: Request }) => {
    //     const body = await request.json()

    //     if (inexistantAuth.includes(body.otp_code)) {
    //         return HttpResponse.json(
    //             { 
    //             error : ['Aucune tentative de connexion n\'a été trouvée, veuillez réesayer de vous connecter']
    //             },
    //             { status: 401 }
    //         )
    //     }

    //     if (blockedEmails.includes(body.otp_code)) {
    //         return HttpResponse.json(
    //             { 
    //             error : ['Trop de tentatives, veuillez réessayer ultérieurement']
    //             },
    //             { status: 403 }
    //         )
    //     }

    //     if(expiredCode.includes(body.otp_code)) {
    //         return HttpResponse.json(
    //             { 
    //             error : ['Le code a expiré, veuillez faire une nouvelle demande de code']
    //             },
    //             { status: 401 }
    //         )
    //     }

    //     return HttpResponse.json({"success": "Connexion validée"}, {status: 200})
    // }),

    http.post("http://127.0.0.1:8000/api/auth/connexion/etape-2/nouveau-code/", async ({ request }: { request: Request }) => {
        const body = await request.json()
        const inexistantAuth = "120"
        const blockedAuth = "121"
        const valid_code = "123"

        if (inexistantAuth.includes(body.auth_id)) {
            return HttpResponse.json(
                { 
                error : ['Aucune tentative de connexion n\'a été trouvée, veuillez réesayer de vous connecter']
                },
                { status: 401 }
            )
        }

        if (blockedAuth.includes(body.auth_id)) {
            return HttpResponse.json(
                { 
                error : ['Trop de tentatives, veuillez réessayer ultérieurement']
                },
                { status: 403 }
            )
        }

        if(valid_code.includes(body.auth_id)) {
            return HttpResponse.json(
                { 
                error : ['un code à été déjà envoyé dans votre adresse mail']
                },
                { status: 401 }
            )
        }

        return HttpResponse.json({"success": "un code à été envoyé dans votre adresse mail"}, {status: 200})
    }),

    http.post("http://127.0.0.1:8000/api/auth/refresh/", () => {

        return HttpResponse.json(
            {
                access: "new_access_token",
                first_name: "Mika"
            },
            { status: 200 }
        )
    }),

    http.post("http://127.0.0.1:8000/api/auth/ask_new_password/", async ({ request }: { request: Request }) => {
        const body = await request.json()
        
        if (inexistingEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ["Cet email n'est associé à aucun compte existant"]
                },
                { status: 401 }
            )
        }

        if (blockedEmails.includes(body.email)) {
            return HttpResponse.json(
                { 
                error : ['Trop de tentatives, veuillez réessayer ultérieurement']
                },
                { status: 403 }
            )
        }

        return HttpResponse.json({success : "un code à été envoyé dans votre adresse mail"}, {status: 200} )
    }),

    http.put("http://127.0.0.1:8000/api/auth/new_password/", async ({ request }: { request: Request }) => {
        const body = await request.json()
        const blockedMdp = 'BlockedAccount..2025'

            if (blockedMdp.includes(body.password)) {
                return HttpResponse.json(
                { 
                error : 'Trop de tentatives, veuillez réessayer ultérieurement'
                },
                { status: 403 }
            )
        }

        return HttpResponse.json({success : "Votre mot de passe a bien été modifié."}, {status: 200})
    })
]