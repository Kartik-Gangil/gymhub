import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../lib/auth-store';
import { Image } from 'react-native';
import {
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterScreen() {
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL || 'https://n8n.creovavteio.in';
    const router = useRouter();
    const { signUp } = useAuthStore();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'owner' | 'member'>('member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpModalVisible, setOtpModalVisible] = useState(false);

    const [otp1, setOtp1] = useState('');
    const [otp2, setOtp2] = useState('');
    const [otp3, setOtp3] = useState('');
    const [otp4, setOtp4] = useState('');

    const [otpLoading, setOtpLoading] = useState(false);

    const handleSignUp = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await signUp(email, password, fullName, phone, role);

            // OPEN OTP MODAL
            if (result?.otpSent) {
                setOtpModalVisible(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setError('');
            setOtpLoading(true);

            const otp = otp1 + otp2 + otp3 + otp4;

            await signUp(
                email,
                password,
                fullName,
                phone,
                role,
                otp
            );

            setOtpModalVisible(false);

            router.replace('/(app)/member');

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'OTP verification failed'
            );
        } finally {
            setOtpLoading(false);
        }
    };

    useEffect(() => {

        const handleDeepLink = async (url: string) => {

            if (!url) return;

            console.log("RAW URL:", url);

            const data = Linking.parse(url);

            console.log("PARSED:", data);

            const token = data.queryParams?.token as string;

            console.log("TOKEN:", token);

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

                console.log(
                    "USER DATA:",
                    userData
                );

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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Modal
                visible={otpModalVisible}
                transparent
                animationType="slide"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.otpTitle}>
                            Verify OTP
                        </Text>

                        <Text style={styles.otpSubtitle}>
                            Enter the 4 digit OTP sent to your email
                        </Text>

                        <View style={styles.otpRow}>
                            <TextInput
                                value={otp1}
                                onChangeText={setOtp1}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={styles.otpInput}
                            />

                            <TextInput
                                value={otp2}
                                onChangeText={setOtp2}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={styles.otpInput}
                            />

                            <TextInput
                                value={otp3}
                                onChangeText={setOtp3}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={styles.otpInput}
                            />

                            <TextInput
                                value={otp4}
                                onChangeText={setOtp4}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={styles.otpInput}
                            />
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleVerifyOtp}
                            loading={otpLoading}
                            disabled={otpLoading}
                            style={styles.verifyButton}
                        >
                            Verify OTP
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => setOtpModalVisible(false)}
                        >
                            Cancel
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            <View style={styles.card}>
                <Text variant="headlineMedium" style={styles.title}>Create an account</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Join the gym community</Text>

                {error && <Text style={styles.error}>{error}</Text>}

                <TextInput
                    label="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                    disabled={loading}
                />

                <TextInput
                    label="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                    keyboardType="phone-pad"
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

                <Text variant="labelMedium" style={styles.roleLabel}>Role</Text>
                <SegmentedButtons
                    value={role}
                    onValueChange={(value) => setRole(value as 'owner' | 'member')}
                    buttons={[
                        { value: 'member', label: 'Member' },
                        { value: 'owner', label: 'Owner' },
                    ]}
                    style={styles.segmented}
                />

                <Button
                    mode="contained"
                    onPress={handleSignUp}
                    loading={loading}
                    disabled={loading || !email || !password || !fullName}
                    style={styles.button}
                >
                    Create account
                </Button>

                <View style={styles.footer}>
                    <Text variant="bodySmall">Already have an account? </Text>
                    <Button
                        mode="text"
                        onPress={() => router.push('/(auth)/login')}
                        disabled={loading}
                    >
                        Sign in
                    </Button>
                </View>
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

                    <Text style={styles.googleText} >
                        Continue with Google
                    </Text>
                </TouchableOpacity>
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
    roleLabel: {
        marginBottom: 8,
        color: '#aaa',
    },
    segmented: {
        marginBottom: 24,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    modalContent: {
        width: '85%',
        backgroundColor: '#2a2a2a',
        padding: 24,
        borderRadius: 20,
    },

    otpTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },

    otpSubtitle: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },

    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    otpInput: {
        width: 55,
        textAlign: 'center',
        fontSize: 22,
    },

    verifyButton: {
        backgroundColor: '#FF6347',
    },
});
