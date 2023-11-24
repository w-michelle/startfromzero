import { Payload } from "@prisma/client/runtime/library";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Image = {
  id: string;
  url: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  quantity?: number | 1;
  images: Image[];
};
interface initState {
  cart: CartItem[];
  isCartOpen: boolean;
  paymentIntent: string;
  checkout: boolean;
}

const initialState: initState = {
  cart: [],
  isCartOpen: false,
  checkout: false,
  paymentIntent: "",
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      //find item , if item exist -> add quantity else add the quantity
      const findItem = state.cart.find((item) => item.id === action.payload.id);

      if (findItem) {
        const updatedCart = state.cart.map((item: CartItem) => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity! + 1 };
          }
          return item;
        });
        state.cart = updatedCart;
      } else {
        state.cart = [...state.cart, action.payload];
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const filteredCart = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      state.cart = filteredCart;
    },
    increaseQty: (state, action: PayloadAction<CartItem>) => {
      const updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: item.quantity! + 1 };
        }
        return item;
      });
      state.cart = updatedCart;
    },
    decreaseQty: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cart.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        if (quantity === 1) {
          state.cart.splice(itemIndex, 1);
        } else if (quantity > 1) {
          state.cart[itemIndex].quantity! -= 1;
        }
      }
    },
    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    setPaymentIntent: (state, action: PayloadAction<string>) => {
      state.paymentIntent = action.payload;
    },
    setCheckout: (state) => {
      state.checkout = !state.checkout;
    },
  },
});

export const selectCart = (state: { cart: initState }) => state.cart.cart;
export const selectCartOpen = (state: { cart: initState }) =>
  state.cart.isCartOpen;

export const selectCheckout = (state: { cart: initState }) =>
  state.cart.checkout;

export const selectPaymentIntent = (state: { cart: initState }) =>
  state.cart.paymentIntent;
export const {
  addToCart,
  setIsCartOpen,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  setCart,
  setPaymentIntent,
  setCheckout,
} = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;
