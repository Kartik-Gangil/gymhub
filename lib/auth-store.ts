import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    username?: string;
    phone?: string;
    profile_picture?: string;
    membership?: []
}
const Base_url = process.env.EXPO_PUBLIC_BASE_URL || 'https://n8n.creovavteio.in';
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
        role: 'owner' | 'member',
        otp?: string
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
        role: 'owner' | 'member',
        otp?: string
    ) => {
        try {

            // FIRST REQUEST -> SEND OTP
            // SECOND REQUEST -> VERIFY OTP + CREATE USER

            const body: any = {
                email,
            };

            // IF OTP EXISTS -> VERIFY OTP FLOW
            if (otp) {
                body.otp = otp;
            } else {
                // SEND OTP FLOW
                body.name = fullName;
                body.phone = phone;
                body.password = password;
                body.role = role;
            }

            const res = await fetch(
                `${Base_url}/signup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // OTP SENT SUCCESSFULLY
            if (!otp) {
                return {
                    otpSent: true,
                    message: data.message,
                };
            }

            // OTP VERIFIED -> USER CREATED
            const user: User = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata.full_name,
                phone: data.user.user_metadata.phone,
                membership: data.user.membership || []
            };

            const session = {
                access_token: data.token,
            };

            const authData = {
                user,
                role: data.role,
                session,
            };

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(authData)
            );

            set({
                user,
                role: data.role,
                session,
            });

            return {
                success: true,
            };

        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    },

    signIn: async (email: string, password: string) => {
        try {

            const res = await fetch(
                `${Base_url}/login`,
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
                id: data.user._id,
                email: data.user.email,
                username: data.user.username,
                profile_picture: data.user.profilePicture,
                phone: data.user.phone,
                membership: data.user.membership || []
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