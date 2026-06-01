import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';

import { Text, Card } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

interface Membership {
    _id: string;
    status: string;
    startDate: string;
    endDate: string;

    gym: {
        name: string;
        address?: string;
        city?: string;
    };

    plan: {
        name: string;
        price: string;
        days: string;
    };
}

export default function MemberDashboardScreen() {
    const { user } = useAuthStore();

    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState('');
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL;

    useEffect(() => {
        if (user) {
            fetchMemberships();
        }
    }, []);

    const fetchMemberships = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${Base_url}/member/user/${user.id}/memberships`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            const sortedMemberships = data.memberships.sort(
                (a: Membership, b: Membership) => {
                    if (a.status === 'active' && b.status !== 'active') return -1;
                    if (a.status !== 'active' && b.status === 'active') return 1;
                    return 0;
                }
            );

            setMemberships(sortedMemberships);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmCancelMembership = (membershipId: string) => {
        Alert.alert(
            'Cancel Membership',
            'Are you sure you want to cancel your membership?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => cancelMembership(membershipId),
                },
            ]
        );
    };

    const cancelMembership = async (membershipId: string) => {
        try {
            setCancelLoading(membershipId);

            const response = await fetch(
                `${Base_url}/member/membership/${membershipId}/cancel`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                setMemberships((prev) =>
                    prev.map((membership) =>
                        membership._id === membershipId
                            ? { ...membership, status: 'cancelled' }
                            : membership
                    )
                );

                Alert.alert(
                    'Success',
                    'Membership cancelled successfully'
                );
            }
        } catch (error) {
            console.log(error);

            Alert.alert(
                'Error',
                'Failed to cancel membership'
            );
        } finally {
            setCancelLoading('');
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={{ color: '#fff', marginTop: 15 }}>
                    Loading memberships...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {memberships.map((membership) => (
                <Card key={membership._id} style={styles.card}>
                    <Card.Content>
                        <View style={styles.row}>
                            <Text variant="titleMedium" style={styles.planName}>
                                {membership.plan?.name}
                            </Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    membership.status === 'active'
                                        ? styles.activeBadge
                                        : styles.inactiveBadge,
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {membership.status}
                                </Text>
                            </View>
                        </View>

                        <Text variant="bodyMedium" style={styles.gymName}>
                            {membership.gym?.name}
                        </Text>

                        <Text variant="bodySmall" style={styles.secondaryText}>
                            ₹{membership.plan?.price}
                        </Text>

                        <Text variant="bodySmall" style={styles.secondaryText}>
                            Valid till{' '}
                            {new Date(
                                membership.endDate
                            ).toLocaleDateString()}
                        </Text>

                        {membership.status === 'active' && (
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() =>
                                    confirmCancelMembership(membership._id)
                                }
                                disabled={cancelLoading === membership._id}
                            >
                                {cancelLoading === membership._id ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.cancelButtonText}>
                                        Cancel Membership
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </Card.Content>
                </Card>
            ))}

            {memberships.length === 0 && !loading && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No memberships found
                    </Text>
                </View>
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

    loaderContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#2a2a2a',
        marginBottom: 14,
        borderRadius: 14,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    planName: {
        color: '#FF6347',
        fontWeight: '700',
    },

    gymName: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },

    secondaryText: {
        color: '#aaa',
        marginTop: 6,
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },

    activeBadge: {
        backgroundColor: '#1f7a1f',
    },

    inactiveBadge: {
        backgroundColor: '#555',
    },

    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    cancelButton: {
        marginTop: 18,
        backgroundColor: '#d11a2a',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },

    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },

    emptyText: {
        color: '#aaa',
        fontSize: 16,
    },
});