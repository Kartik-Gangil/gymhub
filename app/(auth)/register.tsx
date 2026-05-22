import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../lib/auth-store';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp } = useAuthStore();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'owner' | 'member'>('member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        try {
            setError('');
            setLoading(true);
            await signUp(email, password, fullName, phone, role);
            router.replace('/(app)/member');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
});
