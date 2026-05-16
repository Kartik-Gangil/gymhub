import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

export default function MemberDashboardScreen() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        currentSubscription: null as any,
        workoutsCompleted: 0,
        latestWeight: null as number | null,
    });

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = () => {
        // Mock data - replace with real backend calls when ready
        setStats({
            currentSubscription: {
                plan_name: 'Premium Plan',
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
            },
            workoutsCompleted: 12,
            latestWeight: 185,
        });
    };

    return (
        <ScrollView style={styles.container}>
            {stats.currentSubscription && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="labelSmall" style={styles.label}>Current Plan</Text>
                        <Text variant="titleMedium" style={styles.planName}>
                            {stats.currentSubscription.plan_name}
                        </Text>
                        <Text variant="bodySmall" style={styles.secondaryText}>
                            Valid until {new Date(stats.currentSubscription.end_date).toLocaleDateString()}
                        </Text>
                    </Card.Content>
                </Card>
            )}

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="labelSmall" style={styles.label}>Workouts Completed</Text>
                    <Text variant="headlineMedium" style={styles.value}>{stats.workoutsCompleted}</Text>
                </Card.Content>
            </Card>

            {stats.latestWeight && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="labelSmall" style={styles.label}>Latest Weight</Text>
                        <Text variant="headlineMedium" style={styles.value}>{stats.latestWeight} lbs</Text>
                    </Card.Content>
                </Card>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },
    card: {
        backgroundColor: '#2a2a2a',
        marginBottom: 12,
    },
    label: {
        color: '#aaa',
        marginBottom: 8,
    },
    planName: {
        color: '#FF6347',
    },
    value: {
        color: '#FF6347',
    },
    secondaryText: {
        color: '#aaa',
        marginTop: 8,
    },
});
