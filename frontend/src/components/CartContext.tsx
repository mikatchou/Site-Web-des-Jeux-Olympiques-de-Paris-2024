import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as cartService from "../services/cartService"
import axios from "axios";
import type { CartType } from "../types/CartType";
import { AuthContext } from "./AuthProvider";

type contextType = {
    cart: CartType | null;
    stockVersion: number;
    isCartOpen: boolean;
    loading: boolean;
    errorMessage: string | null;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addOffer: (offer_id: number, quantity: number) => Promise<string | null>;
    updateItem: (item_id: number, quantity: number) => Promise<void>;
    deleteItem: (item_id: number) => Promise<void>;
    deleteCart: () => Promise<void>;
}

const CartContext = createContext<contextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {

    const [cart, setCart] = useState<null | CartType>(null)
    const [stockVersion, setStockVersion] = useState(0)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const { isAuthenticated } = useContext(AuthContext)
    const [isCartOpen, setIsCartOpen] = useState(false);


    useEffect(() => {
        async function loadcart() {
            setLoading(true)
            try {
                const response = await cartService.getCart();
                setCart(response.data);
                setErrorMessage(null)
            } catch (error: unknown) {
                if (axios.isAxiosError<{ detail?: string }>(error)) {
                    if (error.response?.status === 404) {
                        setCart(null);
                        setErrorMessage(null);
                    } else {
                        setErrorMessage(
                            error.response?.data?.detail ??
                            "Impossible de charger le panier."
                        );
                    }
                } else {
                    setErrorMessage("Impossible de charger le panier.");
                }
            } finally {
                setLoading(false);
            }
        }
        if (isAuthenticated) {
            loadcart()
        }
    }, [isAuthenticated])

    async function addOffer(offer_id: number, quantity: number): Promise<string | null> {
        setLoading(true)
        try {
            const response = await cartService.addItem(offer_id, quantity);
            setCart(response.data);
            setStockVersion(version => version + 1);
            setErrorMessage(null);
            return null;
        } catch (error: unknown) {
            let message: string;

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;

                if (status === 404) {
                    message = data?.detail ?? "Offre introuvable";
                } else if (status === 400) {
                    const validationMessage =
                        data?.quantity ??
                        data?.detail ??
                        data?.non_field_errors?.[0] ??
                        "Quantité invalide";
                    message = Array.isArray(validationMessage) ? validationMessage[0] : validationMessage;
                } else {
                    message = "une erreur est survenue, veuillez réessayer ultérieurement";
                }
            } else {
                message = "une erreur est survenue, veuillez réessayer ultérieurement";
            }
            setErrorMessage(message);
            return message;
        } finally {
            setLoading(false)
        }
    }

    async function updateItem(item_id: number, quantity: number) {
        setLoading(true)
        try {
            const response = await cartService.updateItemQuantity(item_id, quantity);
            if (response.status === 204) {
                try {
                    const cartResponse = await cartService.getCart();
                    setCart(cartResponse.data);
                } catch (refreshError: unknown) {
                    if (axios.isAxiosError(refreshError) && refreshError.response?.status === 404) {
                        setCart(null);
                    } else {
                        throw refreshError;
                    }
                }
            } else {
                setCart(response.data);
            }
            setStockVersion(version => version + 1);
            setErrorMessage(null)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;

                if (status === 404) {
                    setErrorMessage(data?.detail ?? "Produit introuvable");
                } else if (status === 400) {
                    const message =
                        data?.quantity ??
                        data?.detail ??
                        data?.non_field_errors?.[0] ??
                        "Quantité invalide";
                    setErrorMessage(Array.isArray(message) ? message[0] : message);
                } else {
                    setErrorMessage("une erreur est survenue, veuillez réessayer ultérieurement");
                }
            } else {
                setErrorMessage("une erreur est survenue, veuillez réessayer ultérieurement");
            }
        } finally {
            setLoading(false);
        }

    }

    async function deleteItem(item_id: number) {
        setLoading(true)
        try {
            await cartService.deleteOffer(item_id)
            try {
                const response = await cartService.getCart();
                setCart(response.data);
            } catch (refreshError: unknown) {
                if (axios.isAxiosError(refreshError) && refreshError.response?.status === 404) {
                    setCart(null);
                } else {
                    throw refreshError;
                }
            }
            setStockVersion(version => version + 1);
            setErrorMessage(null)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;

                if (status === 404) {
                    setErrorMessage(data?.detail ?? "article du panier introuvable.");
                } else {
                    setErrorMessage(
                        data?.detail ??
                        data?.non_field_errors?.[0] ??
                        "Une erreur est survenue lors de la suppression."
                    );
                }
            } else {
                setErrorMessage("Une erreur est survenue lors de la suppression.");
            }
        } finally {
            setLoading(false)
        }
    }

    async function deleteCart() {
        setLoading(true)
        try {
            await cartService.destroyCart()
            setCart(null)
            setStockVersion(version => version + 1);
            setErrorMessage(null)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;

                if (status === 404) {
                    setErrorMessage(data?.detail ?? "panier introuvable.");
                } else {
                    setErrorMessage(
                        data?.detail ??
                        data?.non_field_errors?.[0] ??
                        "Une erreur est survenue lors de la suppression."
                    );
                }
            } else {
                setErrorMessage("Une erreur est survenue lors de la suppression.");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                stockVersion,
                loading,
                errorMessage,
                addOffer,
                updateItem,
                deleteItem,
                deleteCart,
                isCartOpen,
                setIsCartOpen
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {

    const context = useContext(CartContext)

    if (!context) {
        throw new Error(
            "useCart doit être utilisé dans un CartProvider"
        )
    }
    return context;
}
