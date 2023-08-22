import { createSlice } from '@reduxjs/toolkit';
// import { AppState } from '../store';
// import { HYDRATE } from "next-redux-wrapper";
// create a slice 

const initialState = {
    name: "",
    isAdmin: false,
    email: "",
    phone: ""
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.name = action.payload.name
            state.isAdmin = action.payload.isAdmin
            state.email = action.payload.email
            state.phone = action.payload.phone
        },
        removeUser: (state) => {
            state = initialState
        },
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //     [HYDRATE]: (state, action) => {
    //         return {
    //             ...state,
    //             ...action.payload,
    //         };
    //     },
    // },
});



// export the action
export const { saveUser, removeUser } = userSlice.actions
// export const getUser = (state: AppState) => state;
export default userSlice.reducer;