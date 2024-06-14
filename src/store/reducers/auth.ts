import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@app/types/user';
import { User } from 'oidc-client-ts';

interface AuthState {
  authentication?: User;
  currentUser?: IUser | null;
  id_company: number | null;
}

const initialState: AuthState = {
  authentication: undefined,
  currentUser: undefined,
  id_company: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthentication: (state, action: PayloadAction<User | undefined>) => {
      state.authentication = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
    },
    setCompanyId: (state, action: PayloadAction<number | null>) => {
      state.id_company = action.payload;
    },
  },
});

export const { setAuthentication, setCurrentUser, setCompanyId } = authSlice.actions;

export default authSlice.reducer;
