import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

interface ExpiringSubscription {
    id: string;
    member_name: string;
    plan_name: string;
    end_date: string;
}

const MOCK_EXPIRING: ExpiringSubscription[] = [
    {
        id: '1',
        member_name: 'Alice Johnson',
        plan_name: 'Premium',
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        member_name: 'Bob Smith',
        plan_name: 'Basic',
        end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        member_name: 'Carol White',
        plan_name: 'Elite (Annual)',
        end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export default function ExpiringScreen() {
    const [expiring, setExpiring] = useState<ExpiringSubscription[]>([]);

    useEffect(() => {
        // Load mock expiring subscriptions — replace with real backend when ready
        setExpiring(MOCK_EXPIRING);
    }, []);

    const renderExpiring = ({ item }: { item: ExpiringSubscription }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium">{item.member_name}</Text>
                <Text style={styles.plan}>{item.plan_name}</Text>
                <Text style={styles.date}>
                    Expires in {formatDistanceToNow(new Date(item.end_date))}
                </Text>
            </Card.Content>
            <Card.Actions>
                <Button>Notify</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={expiring}
                renderItem={renderExpiring}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },
    list: {
        gap: 8,
    },
    card: {
        backgroundColor: '#2a2a2a',
        marginBottom: 8,
    },
    plan: {
        color: '#aaa',
        marginTop: 4,
    },
    date: {
        color: '#FF6347',
        marginTop: 8,
    },
});
