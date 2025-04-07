import React, { createContext, use, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
        
            const token = localStorage.getItem("token");
        
            if (token) {
                console.log("Token found:", token);
                // If the user is logged in, fetch their data
                const userResponse = await fetch(`${BACKEND_URL}/users/me`, {
                    method: "GET",
                });
                if (!userResponse.ok) {
                    console.error("Failed to fetch user data:", data.error);
                    return data.error;
                }
                const userData = await userResponse.json();
                setUser(userData.user);

            } else {
                console.log("No token found");
                // If the user is not logged in, set user to null
                setUser(null);
            }
        }
        console.log("Fetching user data...");
        fetchUser();
        // Run this when the component mounts
        // Check if the user is logged in
        
    }, []);

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {

        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            console.error("Login failed:", data.error);
            return data.error;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log(localStorage.getItem("token"));
        console.log("Login successful:", data);
        
        // Now fetch the user data
        console.log("Fetching user data...");
        const userResponse = await fetch(`${BACKEND_URL}/user/me`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (!userResponse.ok) {
            console.log("Failed");
            console.error("Failed to fetch user data:", data.error);
            return data.error;
        }
        console.log("Success");
        const userData = await userResponse.json();


        setUser(userData.user);
        
        navigate("/profile");
        return "We should never reach here";
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("Registration failed:", data.error);
            return data.error;
        }

        const data = await response.json();
        console.log("Registration successful:", data);
        navigate("/success");
        return "TODO: complete me";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
