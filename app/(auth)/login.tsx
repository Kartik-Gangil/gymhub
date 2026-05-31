import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../lib/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL;
    const router = useRouter();
    const { signIn } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const STORAGE_KEY = '@gymhub_auth';
    // const getUserData = async () => {
    //     try {
    //         const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

    //         if (storedAuth) {
    //             const parsedData = JSON.parse(storedAuth);

    //             const data = parsedData;

    //             // console.log('User ID:', userId);

    //             return data;
    //         }

    //         return null;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };



    useEffect(() => {

        const handleDeepLink = async (url: string) => {

            if (!url) return;

            // console.log("RAW URL:", url);

            const data = Linking.parse(url);

            // console.log("PARSED:", data);

            const token = data.queryParams?.token as string;

            // console.log("TOKEN:", token);

            if (!token) return;

            try {

                const res = await fetch(
                    `${Base_url}/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const userData = await res.json();

                // console.log(
                //     "USER DATA:",
                //     userData
                // );

                const user = {
                    id: userData.user._id,
                    email: userData.user.email,
                    username: userData.user.username,
                    profile_picture: userData.user.profilePicture,
                    membership: userData.user.membership || []
                };

                const role =
                    userData.user.role;

                const session = {
                    access_token: token
                };

                // SAVE TO ZUSTAND + ASYNC STORAGE
                await useAuthStore
                    .getState()
                    .setAuth(
                        user,
                        role,
                        session
                    );

                // REDIRECT
                if (role === "owner") {

                    router.replace(
                        "/(app)/owner"
                    );

                } else {

                    router.replace(
                        "/(app)/member"
                    );
                }

            } catch (error) {

                console.log(
                    "AUTH ERROR:",
                    error
                );
            }
        };

        // App opened from link

        Linking.getInitialURL()
            .then((url) => {

                if (url) {

                    handleDeepLink(url);
                }
            });

        // App already running

        const subscription =
            Linking.addEventListener(
                "url",
                ({ url }) => {

                    handleDeepLink(url);
                }
            );

        return () => {

            subscription.remove();
        };

    }, []);

    const handleGoogleLogin = async () => {
        await Linking.openURL(
            `${Base_url}/auth/google`
        );
    };

    const handleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signIn(email, password);
            const { role } = useAuthStore.getState();

            if (role === 'owner') {
                router.replace('/(app)/owner/');
            } else {
                router.replace('/(app)/member/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text variant="headlineMedium" style={styles.title}>Welcome back</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Sign in to your gym account</Text>

                {error && <Text style={styles.error}>{error}</Text>}

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    disabled={loading}
                />

                <Button
                    mode="contained"
                    onPress={handleSignIn}
                    loading={loading}
                    disabled={loading || !email || !password}
                    style={styles.button}
                >
                    Sign in
                </Button>
                <View style={styles.footer}>
                    <Text variant="bodySmall">Don't have an account? </Text>
                    <Button
                        mode="text"
                        onPress={() => router.push('/(auth)/register')}
                        disabled={loading}
                    >
                        Sign up
                    </Button>
                </View>
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8, color: '#aaa' }}> OR </Text>
                <View style={styles.googleContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleGoogleLogin}
                        style={styles.googleButton}
                    >
                        <View>
                            <Image
                                source={require('../../assets/images/image-removebg-preview.png')}
                                style={styles.googleLogo}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.googleText}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a1a',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 24,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
        color: '#fff',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#aaa',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#FF6347',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',
    },
    error: {
        color: '#FF6347',
        marginBottom: 12,
        textAlign: 'center',
    },
    googleContainer: {
        width: '100%',
        marginTop: 20,
    },

    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#111827',

        paddingVertical: 14,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: '#374151',

        elevation: 4,
    },

    googleLogo: {
        width: 22,
        height: 22,
        marginRight: 12,
    },

    googleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
