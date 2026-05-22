import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import {
    Text,
    TextInput,
    Card,
    Chip,
    Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';


const GymListPage = () => {
    const [search, setSearch] = useState('');
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { signOut } = useAuthStore()
    const STORAGE_KEY = '@gymhub_auth';
    const getUserId = async () => {
        try {
            const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedAuth) {
                const parsedData = JSON.parse(storedAuth);

                const userId = parsedData.user.id;

                // console.log(parsedData);
                // console.log('User ID:', userId);

                return userId;
            }

            return null;
        } catch (error) {
            console.log(error);
        }
    };


    const fetchGym = async () => {
        try {
            setLoading(true);
            const id = await getUserId();

            const res = await fetch(
                `http://72.61.226.250:6000/owner/fetchGym/${id}`
            );

            const data = await res.json();

            const formatted = data.gym.map((gym: any) => ({
                id: gym._id,
                name: gym.name,
                city: gym.city,
                members: gym.members?.length || 0,
                plans: gym.plans?.length || 0,
                logo: gym.logo || null,
                cover: gym.coverImage || null,
            }));

            setGyms(formatted);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGym();
        // signOut();
    }, [])


    const filteredGyms = useMemo(() => {
        return gyms.filter((gym) =>
            gym.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, gyms]);

    const renderGymCard = ({ item }: any) => {
        return (
            <TouchableOpacity activeOpacity={0.9}>
                <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                        {item.logo ? (
                            <Avatar.Image
                                size={58}
                                source={{ uri: item.logo }}
                                style={styles.avatar}
                            />
                        ) : (
                            <Avatar.Icon
                                size={58}
                                icon="dumbbell"
                                style={styles.avatar}
                            />
                        )}

                        <View style={styles.infoContainer}>
                            <Text
                                variant="titleMedium"
                                style={styles.gymName}
                            >
                                {item.name}
                            </Text>

                            <View style={styles.locationRow}>
                                <MaterialCommunityIcons
                                    name="map-marker-outline"
                                    size={16}
                                    color="#9CA3AF"
                                />

                                <Text style={styles.locationText}>
                                    {item.city}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.moreButton}>
                            <MaterialCommunityIcons
                                name="dots-vertical"
                                size={22}
                                color="#A1A1AA"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>
                                {item.members}
                            </Text>

                            <Text style={styles.statLabel}>
                                Members
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>
                                {item.plans}
                            </Text>

                            <Text style={styles.statLabel}>
                                Plans
                            </Text>
                        </View>
                    </View>

                    <View style={styles.bottomRow}>
                        <Chip
                            icon="check-circle"
                            style={styles.activeChip}
                            textStyle={{
                                color: '#22C55E',
                            }}
                        >
                            Active
                        </Chip>

                        <TouchableOpacity style={styles.manageButton}
                            onPress={() => router.push({
                                pathname: '/owner/(tabs)/dashboard',
                                params: {
                                    gymId: item.id
                                }
                            })}>
                            <Text style={styles.manageButtonText}>
                                Manage
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />



            {/* Search */}
            <TextInput
                mode="outlined"
                placeholder="Search gyms..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                left={<TextInput.Icon icon="magnify" />}
                theme={{
                    colors: {
                        primary: '#FF7A00',
                        background: '#1C1C1E',
                    },
                }}
            />

            {/* Gym List */}
            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => <SkeletonCard />}
                />
            ) : (
                <FlatList
                    data={filteredGyms.length ? filteredGyms : gyms}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGymCard}
                />
            )}
        </View>
    );
};

export default GymListPage;


const SkeletonCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.skeletonHeader}>
                <View style={styles.skeletonAvatar} />

                <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
                </View>
            </View>

            <View style={styles.skeletonStats}>
                <View style={styles.skeletonBox} />
                <View style={styles.skeletonBox} />
            </View>

            <View style={styles.skeletonFooter} />
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F10',
        paddingHorizontal: 18,
        paddingTop: 60,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },

    title: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    subtitle: {
        color: '#9CA3AF',
        marginTop: 4,
    },

    addButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FF7A00',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },

    searchInput: {
        marginBottom: 22,
        backgroundColor: '#18181B',
    },

    card: {
        backgroundColor: '#18181B',
        borderRadius: 24,
        padding: 18,
        marginBottom: 18,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        backgroundColor: '#FF7A00',
    },

    infoContainer: {
        flex: 1,
        marginLeft: 14,
    },

    gymName: {
        color: '#fff',
        fontWeight: '700',
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    locationText: {
        color: '#9CA3AF',
        marginLeft: 4,
    },

    moreButton: {
        padding: 4,
    },

    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#111112',
        borderRadius: 18,
        marginTop: 20,
        paddingVertical: 18,
    },

    statBox: {
        flex: 1,
        alignItems: 'center',
    },

    statValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },

    statLabel: {
        color: '#71717A',
        marginTop: 4,
    },

    divider: {
        width: 1,
        backgroundColor: '#27272A',
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },

    activeChip: {
        backgroundColor: 'rgba(34,197,94,0.12)',
    },

    manageButton: {
        backgroundColor: '#FF7A00',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
    },

    manageButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    skeletonAvatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#2a2a2a',
    },

    skeletonLine: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2a2a2a',
        width: '80%',
    },

    skeletonStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    skeletonBox: {
        width: '45%',
        height: 60,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
    },

    skeletonFooter: {
        height: 40,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        marginTop: 20,
    },
});