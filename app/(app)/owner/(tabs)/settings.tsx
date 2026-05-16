import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineSmall" style={styles.title}>Settings</Text>
            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                textColor="#fff"
            >
                Logout
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },
    title: {
        color: '#fff',
        marginBottom: 24,
    },
    logoutButton: {
        backgroundColor: '#FF6347',
    },
});
