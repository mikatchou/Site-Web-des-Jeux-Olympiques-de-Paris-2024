import { http, HttpResponse } from 'msw'

// const existing = 'existing'
// const inexisting = 'inexisting'
// const error = 'error'


export const disciplinesHandlers = [

    http.get('http://127.0.0.1:8000/api/events/disciplines/', async () => {

        return HttpResponse.json(
            Array.from({ length: 20 }, (_, index) => ({
                id: index++,
                name: `nom : ${index++}`,
                image: `/media/${index++}`
            }))
        )
    })
]