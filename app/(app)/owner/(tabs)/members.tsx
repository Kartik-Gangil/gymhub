import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Searchbar, Text, Avatar } from 'react-native-paper';

interface Member {
    id: string;
    full_name: string;
    email: string;
    phone: string;
}

const MOCK_MEMBERS: Member[] = [];

export default function MembersScreen() {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMembers(MOCK_MEMBERS);
    }, []);

    const filteredMembers = useMemo(() => {
        return members.filter(
            (m) =>
                m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, members]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
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
                    <Text style={styles.name}>{item.full_name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.phone}>{item.phone}</Text>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Members</Text> */}

            <Searchbar
                placeholder="Search members..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
                inputStyle={{ color: '#fff' }}
            />

            <FlatList
                data={filteredMembers}
                renderItem={renderMember}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {filteredMembers.length === 0 && (
                <Text style={styles.empty}>No members found</Text>
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

    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
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

    empty: {
        color: '#777',
        textAlign: 'center',
        marginTop: 30,
    },
});