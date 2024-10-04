import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
	setAuthState: (state, action) => {
	  state.isLoggedIn = action.payload.isLoggedIn;
	  state.user = action.payload.user;
	},
	// other reducers...
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;