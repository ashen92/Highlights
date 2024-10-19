import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppUser } from ".";

interface AuthState {
    user: AppUser | undefined;
    googleAccessToken: string | undefined;
};

const initialState: AuthState = {
    user: undefined,
    googleAccessToken: undefined,
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AppUser | undefined>) => {
            state.user = action.payload;
        },
        setGoogleAccessToken: (state, action: PayloadAction<string | undefined>) => {
            state.googleAccessToken = action.payload;
        },
    },
});

export const { setCredentials, setGoogleAccessToken } = slice.actions;

export default slice.reducer;

export const selectAppUser = (state: RootState) => state.auth.user;
export const selectGoogleAccessToken = (state: RootState) => state.auth.googleAccessToken;
