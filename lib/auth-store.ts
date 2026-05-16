import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        phone?: string;
    };
}

interface AuthStore {
    user: User | null;
    session: any | null;
    role: 'owner' | 'member' | null;
    isLoading: boolean;

    initialize: () => Promise<void>;

    signUp: (
        email: string,
        password: string,
        fullName: string,
        phone: string,
        role: 'owner' | 'member'
    ) => Promise<void>;

    signIn: (email: string, password: string) => Promise<void>;

    signOut: () => Promise<void>;
}

const STORAGE_KEY = '@gymhub_auth';

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    role: null,
    isLoading: true,

    initialize: async () => {
        try {
            const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedAuth) {
                const { user, role, session } = JSON.parse(storedAuth);

                set({
                    user,
                    role,
                    session,
                });
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    signUp: async (
        email: string,
        password: string,
        fullName: string,
        phone: string,
        role: 'owner' | 'member'
    ) => {
        try {
            const res = await fetch(
                'http://192.168.29.218:8000/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName,
                        email,
                        phone,
                        password,
                        role,
                    }),
                }
            );

            const data = await res.json();

            // console.log('Signup Response:', data);

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            const user: User = {
                id: data.user._id,
                email: data.user.email,
                user_metadata: {
                    full_name: data.user.name,
                    phone: data.user.phone,
                },
            };

            const session = {
                access_token: data.token,
            };

            const authData = {
                user,
                role: data.user.role,
                session,
            };

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(authData)
            );

            set({
                user,
                role: data.user.role,
                session,
            });
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    },

    signIn: async (email: string, password: string) => {
        try {

            const res = await fetch(
                'http://192.168.29.218:8000/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email, password
                    }),
                }
            );

            const data = await res.json();

            // console.log('Signup Response:', data);

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }


            // MOCK LOGIN
            const user: User = {
                id: data.user.id,
                email,
                user_metadata: {
                    full_name: data.user.fullName,
                    phone: data.user.phone,
                },
            };

            const role = data.role;

            const session = {
                access_token: data.token,
            };

            const authData = {
                user,
                role,
                session,
            };

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(authData)
            );

            set({
                user,
                role,
                session,
            });
        } catch (error) {
            console.error('Signin Error:', error);
            throw error;
        }
    },

    signOut: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem("@userData");

            set({
                user: null,
                session: null,
                role: null,
            });
        } catch (error) {
            console.error('Signout Error:', error);
        }
    },
}));