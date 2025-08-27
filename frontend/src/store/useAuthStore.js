import {create} from "zustand";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    isCheckingAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/me')
        } catch (error) {
            
        }
    }
}))