import {create} from "zustand";
import axiosInstance from "../lib/axios";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    isCheckingAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({authUser: res.data.user})

        } catch (error) {
            console.log("Error in auth check",error.message);
            set({authUser: null})
        } finally{
            set({isCheckingAuth: false})
        }
    }
}))