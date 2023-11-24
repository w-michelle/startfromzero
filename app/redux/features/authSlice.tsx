import { createSlice } from "@reduxjs/toolkit";

type initState = {
  isOpen: boolean;
};
const initialState: initState = {
  isOpen: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpen: (state) => {
      state.isOpen = true;
    },
    setClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectOpen = (state: { auth: initState }) => state.auth.isOpen;

export const { setOpen, setClose } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
