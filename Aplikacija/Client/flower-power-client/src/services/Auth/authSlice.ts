import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
  token: string | null;
  photo: string | null;
}
const initialState: AuthState = { token: null, photo: null };
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = null;
    },
    setPhoto: (state, action) => {
      const { photo } = action.payload;
      state.photo = photo;
    },
  },
});
export const { logIn, logOut, setPhoto } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectCurrentPhoto = (state: { auth: AuthState }) =>
  state.auth.photo;
