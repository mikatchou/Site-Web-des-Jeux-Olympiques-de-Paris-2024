import api from "../api";   

export const getCart = () => api.get("carts/cart/");

export const addItem = (offer_Id: number, quantity: number) => api.post("carts/cart/new-item/", {  offer_id: offer_Id, quantity: quantity});

export const updateItemQuantity = (item_id:number, quantity: number) => api.put(`carts/cart/item/${item_id}/`, {quantity: quantity})

export const deleteOffer = (item_id: number) => api.delete(`carts/cart/item/${item_id}/`) 

export const destroyCart = () => api.delete("carts/cart/delete/")