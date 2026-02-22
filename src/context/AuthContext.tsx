"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string; // Simulated
    safetySettings: {
        emergencyNumber: string;
        safeWord: string;
        safeUrl: string;
        autoCall: boolean;
        locationSharing: boolean;
        shakeDetection: boolean;
        ghostMode: boolean;
        psychologicalLock: boolean;
        emergencyMessage?: string;
    };
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const session = localStorage.getItem("echo_exit_session");
        if (session) {
            try {
                const userId = JSON.parse(session).id;
                const users = JSON.parse(localStorage.getItem("echo_exit_users") || "[]");
                const foundUser = users.find((u: User) => u.id === userId);
                if (foundUser) {
                    setUser(foundUser);
                }
            } catch (e) {
                console.error("Failed to parse auth session", e);
            }
        }
        setIsLoading(false);
    }, []);

    const signup = async (name: string, email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem("echo_exit_users") || "[]");
        if (users.find((u: User) => u.email === email)) return false;

        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            passwordHash: btoa(password), // Very basic simulation
            safetySettings: {
                emergencyNumber: "+917871411065", // Default
                safeWord: "safety first",
                safeUrl: "https://www.google.com/search?q=weather+update",
                autoCall: true,
                locationSharing: true,
                shakeDetection: true,
                ghostMode: false,
                psychologicalLock: false,
                emergencyMessage: "Emergency triggered. Please check on me.",
            },
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem("echo_exit_users", JSON.stringify(updatedUsers));

        // Auto-login after signup
        setUser(newUser);
        localStorage.setItem("echo_exit_session", JSON.stringify({ id: newUser.id }));
        return true;
    };

    const login = async (email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem("echo_exit_users") || "[]");
        const foundUser = users.find((u: User) => u.email === email && u.passwordHash === btoa(password));

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("echo_exit_session", JSON.stringify({ id: foundUser.id }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("echo_exit_session");
        router.push("/login");
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        const users = JSON.parse(localStorage.getItem("echo_exit_users") || "[]");
        const updatedUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
        localStorage.setItem("echo_exit_users", JSON.stringify(updatedUsers));
    };

    if (!mounted) return null;

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
