import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import { Text, Card } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';
import { router } from 'expo-router';

interface Membership {
    _id: string;
    status: string;
    endDate: string;

    gym: {
        _id: string;
        name: string;
    };

    plan: {
        name: string;
        price: string;
        days: string;
    };
}

interface Gym {
    _id: string;
    name: string;

    plans: {
        _id: string;
        name: string;
        price: string;
        days: string;
    }[];
}

export default function SubscriptionScreen() {
    const { user } = useAuthStore();
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL;
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch memberships
            const membershipResponse = await fetch(
                `${Base_url}/member/user/${user.id}/memberships`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const membershipData = await membershipResponse.json();

            // Only active memberships
            const activeMemberships =
                membershipData.memberships.filter(
                    (item: Membership) => item.status === 'active'
                );

            setMemberships(activeMemberships);

            // Fetch gyms
            const gymResponse = await fetch(
                `${Base_url}/view/get-all-gyms`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const gymData = await gymResponse.json();

            setGyms(gymData.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF6347" />

                <Text style={styles.loadingText}>
                    Loading subscriptions...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* ACTIVE MEMBERSHIPS */}
            <Text style={styles.sectionTitle}>
                Active Memberships
            </Text>

            {memberships.length > 0 ? (
                memberships.map((membership) => (
                    <Card
                        key={membership._id}
                        style={styles.membershipCard}
                    >
                        <Card.Content>
                            <Text style={styles.planName}>
                                {membership.plan?.name}
                            </Text>

                            <Text style={styles.gymName}>
                                {membership.gym?.name}
                            </Text>

                            <Text style={styles.secondaryText}>
                                ₹{membership.plan?.price}
                            </Text>

                            <Text style={styles.secondaryText}>
                                Valid till{' '}
                                {new Date(
                                    membership.endDate
                                ).toLocaleDateString()}
                            </Text>

                            <View style={styles.activeBadge}>
                                <Text style={styles.badgeText}>
                                    ACTIVE
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                ))
            ) : (
                <Text style={styles.emptyText}>
                    No active memberships
                </Text>
            )}

            {/* AVAILABLE PLANS */}
            <Text
                style={[
                    styles.sectionTitle,
                    { marginTop: 30 },
                ]}
            >
                Available Plans
            </Text>

            {gyms.map((gym) => (
                <View key={gym._id} style={styles.gymSection}>
                    <Text style={styles.gymHeading}>
                        {gym.name}
                    </Text>

                    {gym.plans?.map((plan) => (
                        <Card
                            key={plan._id}
                            style={styles.planCard}
                        >
                            <Card.Content>
                                <View style={styles.row}>
                                    <View>
                                        <Text style={styles.planName}>
                                            {plan.name}
                                        </Text>

                                        <Text style={styles.secondaryText}>
                                            {plan.days} Days
                                        </Text>
                                    </View>

                                    <Text style={styles.price}>
                                        ₹{plan.price}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.joinButton}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                '/(app)/member/(tabs)/gymDetail',
                                            params: {
                                                gymId: gym._id,
                                            },
                                        })
                                    }
                                >
                                    <Text style={styles.joinButtonText}>
                                        View Gym
                                    </Text>
                                </TouchableOpacity>
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },

    loaderContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        color: '#fff',
        marginTop: 15,
    },

    sectionTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
    },

    membershipCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 14,
        borderRadius: 14,
    },

    planCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 12,
        borderRadius: 14,
    },

    gymSection: {
        marginBottom: 25,
    },

    gymHeading: {
        color: '#FF6347',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },

    planName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    gymName: {
        color: '#aaa',
        marginTop: 5,
    },

    secondaryText: {
        color: '#aaa',
        marginTop: 5,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    price: {
        color: '#FF6347',
        fontSize: 22,
        fontWeight: '700',
    },

    activeBadge: {
        marginTop: 14,
        backgroundColor: '#1f7a1f',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },

    badgeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },

    joinButton: {
        marginTop: 18,
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    joinButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },

    emptyText: {
        color: '#aaa',
        marginBottom: 20,
    },
});