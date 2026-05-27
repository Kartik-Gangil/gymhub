import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OwnerDashboardScreen() {
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL || 'https://n8n.creovavteio.in';
    const { gymId } = useLocalSearchParams();
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        fetchGym()
    }, []);

    const fetchGym = async () => {
        try {

            const res = await fetch(
                `${Base_url}/owner/get-gym-detail/${gymId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const response = await res.json();

            // console.log(JSON.stringify(response, null, 2));

            // actual gym object
            const gymData = response.data;

            // store in async storage
            await AsyncStorage.setItem(
                "@userData",
                JSON.stringify(gymData)
            );

            // active subscribers
            const subscribers = gymData?.members
                ? gymData.members.filter(
                    member => member.status === "active"
                ).length
                : 0;

            setStats({
                totalMembers: gymData?.members?.length || 0,
                activeSubscriptions: subscribers,
                totalRevenue: gymData?.totalRevenue || 0,
            });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.grid}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text variant="labelSmall" style={styles.label}>Total Members</Text>
                        <Text variant="headlineMedium" style={styles.value}>{stats.totalMembers}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text variant="labelSmall" style={styles.label}>Active Subscriptions</Text>
                        <Text variant="headlineMedium" style={styles.value}>{stats.activeSubscriptions}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statCard}>
                    <Card.Content>
                        <Text variant="labelSmall" style={styles.label}>Total Revenue</Text>
                        <Text variant="headlineMedium" style={styles.value}>₹ {stats.totalRevenue}</Text>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },
    grid: {
        gap: 12,
    },
    statCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 8,
    },
    label: {
        color: '#aaa',
        marginBottom: 8,
    },
    value: {
        color: '#FF6347',
    },
});
