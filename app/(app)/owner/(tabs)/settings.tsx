import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

interface Option {
    id: number;
    label: string;
    value: string;
}
export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useAuthStore();
    const options: Option[] = [
        { id: 1, label: 'Switch Gym', value: '/(app)/owner/' },
        { id: 2, label: 'Edit Gym Details', value: '/(app)/owner/updateGym' },
    ];

    const handleLogout = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            {/* <Text variant="headlineSmall" style={styles.title}>Settings</Text> */}
            {options.map((option) => (
                <Button
                    mode='outlined'
                    key={option.id}
                    onPress={() => router.push(option.value)}
                    style={styles.optionButton}
                    textColor="#fff"
                    
                >
                    {option.label}
                </Button>
            ))}
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
    optionButton: {
        marginBottom: 12,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
    }
});
