import { http, HttpResponse } from "msw";
import cart from "../../helpers/cart";

export const cartHandlers = [

    http.get("http://127.0.0.1:8000/api/carts/cart/", () => {
        return HttpResponse.json(cart(), { status: 200 })
    }),

    http.post("http://127.0.0.1:8000/api/carts/cart/new-item/", () => {
        return HttpResponse.json(cart(), { status: 201 })
    }),

    http.put("http://127.0.0.1:8000/api/carts/cart/item/:id/", () => {
        return HttpResponse.json(cart({increases:true}), { status: 200 })
    }),

    http.delete("http://127.0.0.1:8000/api/carts/cart/delete/", () => 
        HttpResponse.json({ status: 204 })
    ),

]