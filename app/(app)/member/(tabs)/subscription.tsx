import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

interface Plan {
    id: string;
    plan_name: string;
    price: number;
    duration_days: number;
}

interface MemberSubscription {
    id: string;
    plan_name: string;
    status: string;
    end_date: string;
}

const MOCK_PLANS: Plan[] = [
    { id: '1', plan_name: 'Basic', price: 29, duration_days: 30 },
    { id: '2', plan_name: 'Premium', price: 59, duration_days: 30 },
    { id: '3', plan_name: 'Elite (Annual)', price: 499, duration_days: 365 },
];

const MOCK_CURRENT_SUB: MemberSubscription = {
    id: 'sub-1',
    plan_name: 'Premium Plan',
    status: 'active',
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function SubscriptionScreen() {
    const { user } = useAuthStore();
    const [currentSub, setCurrentSub] = useState<MemberSubscription | null>(null);
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);

    useEffect(() => {
        if (user) {
            // Load mock subscription data
            setCurrentSub(MOCK_CURRENT_SUB);
            setAvailablePlans(MOCK_PLANS);
        }
    }, [user]);

    const handleSubscribe = (planId: string) => {
        const plan = MOCK_PLANS.find((p) => p.id === planId);
        if (!plan) return;

        setCurrentSub({
            id: Date.now().toString(),
            plan_name: plan.plan_name,
            status: 'active',
            end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        });
    };

    const renderPlan = ({ item }: { item: Plan }) => (
        <Card style={styles.planCard}>
            <Card.Content>
                <Text variant="titleMedium">{item.plan_name}</Text>
                <View style={styles.planDetails}>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.duration}>{item.duration_days} days</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => handleSubscribe(item.id)}>Subscribe</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <ScrollView style={styles.container}>
            {currentSub && (
                <>
                    <Text variant="headlineSmall" style={styles.title}>Current Plan</Text>
                    <Card style={styles.currentCard}>
                        <Card.Content>
                            <Text variant="titleMedium">{currentSub.plan_name}</Text>
                            <Text style={styles.status}>Status: {currentSub.status}</Text>
                            <Text style={styles.endDate}>
                                Expires: {new Date(currentSub.end_date).toLocaleDateString()}
                            </Text>
                        </Card.Content>
                    </Card>
                </>
            )}

            <Text variant="headlineSmall" style={styles.title}>Available Plans</Text>
            <FlatList
                data={availablePlans}
                renderItem={renderPlan}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
            />
        </ScrollView>
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
        marginTop: 16,
        marginBottom: 12,
    },
    currentCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 24,
    },
    status: {
        color: '#aaa',
        marginTop: 8,
    },
    endDate: {
        color: '#FF6347',
        marginTop: 4,
    },
    list: {
        gap: 8,
    },
    planCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 8,
    },
    planDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    price: {
        color: '#FF6347',
        fontSize: 16,
        fontWeight: 'bold',
    },
    duration: {
        color: '#aaa',
    },
});
