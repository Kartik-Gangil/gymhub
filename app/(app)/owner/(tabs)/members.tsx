import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Searchbar, Text, Avatar } from 'react-native-paper';

interface Member {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    plan_price: number;
    status: string;
}

const STORAGE_KEY = '@userData';

export default function MembersScreen() {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);

            if (data) {
                const parsed = JSON.parse(data);

                const members =
                    parsed?.members.map((member: any) => ({
                        id: member._id,
                        full_name: member.user.username,
                        email: member.user.email,
                        phone: member.user.phone,
                        plan_price: member.plan?.price || 0,
                        status: member.status || 'inactive',
                    })) || [];

                setMembers(members);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const filteredMembers = useMemo(() => {
        return members.filter(
            (m) =>
                m.full_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                m.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, members]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('');
    };

    const renderMember = ({ item }: { item: Member }) => (
        <Card style={styles.card}>
            <View style={styles.row}>
                <Avatar.Text
                    size={46}
                    label={getInitials(item.full_name)}
                    style={styles.avatar}
                />

                <View style={styles.info}>
                    <Text style={styles.name}>
                        {item.full_name}
                    </Text>

                    <Text style={styles.email}>
                        {item.email}
                    </Text>

                    <Text style={styles.phone}>
                        {item.phone}
                    </Text>

                    <Text style={styles.planPrice}>
                        ₹{item.plan_price}
                    </Text>
                </View>

                {/* STATUS BADGE */}
                <View
                    style={[
                        styles.statusBadge,
                        item.status === 'active'
                            ? styles.activeBadge
                            : item.status === 'inactive'
                                ? styles.inactiveBadge
                                : styles.cancelledBadge,
                    ]}
                >
                    <Text style={styles.statusText}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search members..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
                inputStyle={{ color: '#fff' }}
                placeholderTextColor="#777"
            />

            <FlatList
                data={filteredMembers}
                renderItem={renderMember}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {filteredMembers.length === 0 && (
                <Text style={styles.empty}>
                    No members found
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F10',
        padding: 16,
    },

    searchbar: {
        backgroundColor: '#1C1C1E',
        marginBottom: 16,
        borderRadius: 12,
    },

    list: {
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#18181B',
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        backgroundColor: '#FF7A00',
    },

    info: {
        marginLeft: 12,
        flex: 1,
    },

    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    email: {
        color: '#9CA3AF',
        marginTop: 2,
        fontSize: 13,
    },

    phone: {
        color: '#6B7280',
        marginTop: 2,
        fontSize: 12,
    },

    planPrice: {
        color: '#FF7A00',
        marginTop: 6,
        fontSize: 14,
        fontWeight: '700',
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },

    activeBadge: {
        backgroundColor: '#16A34A',
    },

    inactiveBadge: {
        backgroundColor: '#CA8A04',
    },

    cancelledBadge: {
        backgroundColor: '#DC2626',
    },

    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    empty: {
        color: '#777',
        textAlign: 'center',
        marginTop: 30,
    },
});