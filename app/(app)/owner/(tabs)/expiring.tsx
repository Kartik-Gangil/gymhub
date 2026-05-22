import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

interface ExpiringSubscription {
    id: string;
    member_name: string;
    plan_name: string;
    end_date: string;
    plan_price?: number;
}

const STORAGE_KEY = '@userData';

export default function ExpiringScreen() {

    const [expiring, setExpiring] = useState<ExpiringSubscription[]>([]);

    useEffect(() => {
        calculateExpiring();
    }, []);

    const calculateExpiring = async () => {
        try {

            const data = await AsyncStorage.getItem(STORAGE_KEY);

            if (!data) return;

            const parsed = JSON.parse(data);

            const currentDate = new Date();

            const members: ExpiringSubscription[] =
                parsed?.members
                    ?.filter((member: any) => {
                        return (
                            member.status === 'active' &&
                            member.endDate &&
                            new Date(member.endDate) >= currentDate
                        );
                    })
                    ?.map((member: any) => ({
                        id: member._id,
                        member_name:
                            member?.user?.username || 'Unknown Member',

                        plan_name:
                            member?.plan?.name || 'No Plan',

                        plan_price:
                            member?.plan?.price || 0,

                        // FIXED
                        end_date: member.endDate,
                    }))
                    // sort nearest expiry first
                    ?.sort(
                        (a: ExpiringSubscription, b: ExpiringSubscription) =>
                            new Date(a.end_date).getTime() -
                            new Date(b.end_date).getTime()
                    ) || [];

            setExpiring(members);

            console.log(JSON.stringify(members, null, 2));

        } catch (err) {
            console.log(err);
        }
    };

    const renderExpiring = ({
        item,
    }: {
        item: ExpiringSubscription;
    }) => (

        <Card style={styles.card}>
            <Card.Content>

                <Text variant="titleMedium">
                    {item.member_name}
                </Text>

                <Text style={styles.plan}>
                    {item.plan_name} • ₹{item.plan_price}
                </Text>

                <Text style={styles.date}>
                    Expires{' '}
                    {formatDistanceToNow(
                        new Date(item.end_date),
                        { addSuffix: true }
                    )}
                </Text>

            </Card.Content>

            <Card.Actions>
                <Button mode="contained-tonal">
                    Notify
                </Button>
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
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                        No expiring subscriptions
                    </Text>
                }
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
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#2a2a2a',
        marginBottom: 12,
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