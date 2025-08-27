import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,
       


    CheckAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({authUser: res.data})

        } catch (error) {
            console.log("Error in auth check",error);
            set({authUser: null})
        } finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async(formData) => {
try {
    const res = await axiosInstance.post("/auth/signup", formData);
    set({authUser: res.data})
    toast.success("Account created successfully");

} catch (error) {
    toast.error(error.response.data.message)
    console.log("Error in signing up", error)
}finally{
set({isSigningUp: false})
}
    },

    login: async(formData) => {

    },

    logout: async() => {

    }
}))