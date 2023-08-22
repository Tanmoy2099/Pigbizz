import {
    configureStore,
    // ThunkAction, Action 
} from '@reduxjs/toolkit';
import { userSlice } from './Slices/userSlice';
// import { createWrapper } from "next-redux-wrapper";

// config the store 
const store = configureStore({
    reducer: {
        user: userSlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})

// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore["getState"]>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//     ReturnType,
//     AppState,
//     unknown,
//     Action
// >;

// export default the store 
// export const wrapper = createWrapper<AppStore>(makeStore)

export default store;
