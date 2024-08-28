import { AppUser } from "@/hooks/useAppUser";
import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: AppUser | undefined;
};

const initialState: AuthState = {
    user: undefined
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AppUser | undefined>) => {
            state.user = action.payload;
        },
    },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectAppUser = (state: RootState) => state.auth;
