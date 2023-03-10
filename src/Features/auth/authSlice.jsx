import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      localStorage.setItem('access_token', payload.token);
      localStorage.setItem('refresh_token', payload.refreshToken);
      localStorage.setItem('id_user', payload.data.id);

      state.user = payload.data;
      state.accessToken = payload.token;
      state.refreshToken = payload.refreshToken;
    },

    logout: (state, action) => {
      localStorage.clear();
      state.user = undefined;
      state.refreshToken = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
