import {
    create
} from "zustand";
import {
    axiosInstance
} from "../lib/axios.js";
import toast from "react-hot-toast";



export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,



    CheckAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({
                authUser: res.data
            })

        } catch (error) {
            console.log("Error in auth check", error);
            set({
                authUser: null
            })
        } finally {
            set({
                isCheckingAuth: false
            })
        }
    },

    signup: async (formData) => {
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({
                authUser: res.data
            })
            toast.success("Account created successfully");

        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signing up", error)
        } finally {
            set({
                isSigningUp: false
            })
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({authUser: res.data})
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error in logging in");
            console.log("Error in logging in", error);
        }finally{
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({
                authUser: null
            })
            toast.success("Logged out successfully")
            
        } catch (error) {
            toast.error("Error in logging out", error.response.data.message)
        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", formData);
            set({authUser: res.data})
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error in updating profile");
            console.log("Error in updating profile", error);
        }finally{
            set({ isUpdatingProfile: false });
        }
    }
}))