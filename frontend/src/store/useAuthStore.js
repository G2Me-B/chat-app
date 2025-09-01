import {
    create
} from "zustand";
import {
    axiosInstance
} from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = "http://localhost:5001"


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,



    CheckAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({
                authUser: res.data
            })
            get().connectSocket(); // Connect socket after successful auth check

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
            get().connectSocket(); // Connect socket after successful login
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
        set({
            isLoggingIn: true
        });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({
                authUser: res.data
            })
            toast.success("Logged in successfully");

            get().connectSocket(); // Connect socket after successful login
        } catch (error) {
            toast.error(error.response?.data?.message || "Error in logging in");
            console.log("Error in logging in", error);
            return; // Prevents further execution if error
        } finally {
            set({
                isLoggingIn: false
            });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({
                authUser: null
            })
            toast.success("Logged out successfully")
            get().disconnectSocket(); // Disconnect socket on logout

        } catch (error) {
            toast.error("Error in logging out", error.response.data.message)
        }
    },

    updateProfile: async (formData) => {
        set({
            isUpdatingProfile: true
        });
        try {
            const res = await axiosInstance.put("/auth/update-profile", formData);
            set({
                authUser: res.data
            })
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Error in updating profile");
            console.log("Error in updating profile", error);
        } finally {
            set({
                isUpdatingProfile: false
            });
        }
    },

    connectSocket: () => {
        const {
            authUser
        } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        
        set({
            socket: socket
        });

        socket.on("get-online-users",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))