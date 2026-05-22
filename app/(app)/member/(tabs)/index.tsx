import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';

export default function GymListingScreen() {

    const [search, setSearch] = useState('');
    const [gyms, setGyms] = useState([])
    const { signOut } = useAuthStore();
    useEffect(() => {
        loadGym()
    }, [])

    const filteredGyms = gyms.filter((gyms) =>
        gyms?.name.toLowerCase().includes(search.toLowerCase())
    );

    const loadGym = async () => {
        try {
            const data = await fetch("http://72.61.226.250:6000/view", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const gym = await data.json();
            // console.log(gym.gyms)
            setGyms(gym.gyms)
        } catch (error) {
            console.log(error)
        }
    }

    const renderGymCard = ({ item, index }: any) => (
        <View style={styles.card} key={index}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.logo ? item.logo : item.cover }} style={styles.image} />

                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.gymName}>{item.name}</Text>

                <Text style={styles.city}>📍 {item.city}</Text>

                <View style={styles.bottomRow}>
                    <View>
                        <Text style={styles.memberLabel}>Members</Text>
                        <Text style={styles.memberCount}>
                            {item.members}+
                        </Text>
                    </View>


                    <TouchableOpacity style={styles.button}
                        onPress={() => router.push({
                            pathname: '/member/gymDetail',
                            params: {
                                gymId: item.id
                            }
                        })}>
                        <Text style={styles.buttonText}>View Gym</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredGyms}
                keyExtractor={(item) => item.id}
                renderItem={renderGymCard}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            {/* <Text style={styles.heading}>
                                Explore Gyms
                            </Text> */}
                            {/* <Text onPress={
                                signOut()
                            }>Logout</Text> */}
                            <Text style={styles.subHeading}>
                                Find the best gyms near you and start your
                                fitness journey.
                            </Text>
                        </View>

                        <View style={styles.searchContainer}>
                            <Ionicons
                                name="search"
                                size={20}
                                color="#9ca3af"
                            />

                            <TextInput
                                placeholder="Search gym by name..."
                                placeholderTextColor="#71717a"
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                            />
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>
                            No Gym Found
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Try searching with another gym name.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
    },

    listContent: {
        padding: 16,
        paddingBottom: 40,
    },

    header: {
        marginBottom: 24,
    },

    heading: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
    },

    subHeading: {
        color: '#a1a1aa',
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    searchContainer: {
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 58,
    },

    searchInput: {
        flex: 1,
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
    },

    card: {
        backgroundColor: '#18181b',
        borderRadius: 26,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#27272a',
    },

    imageContainer: {
        position: 'relative',
    },

    image: {
        width: '100%',
        height: 220,
    },

    ratingBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    ratingText: {
        color: 'white',
        fontWeight: '600',
    },

    cardContent: {
        padding: 18,
    },

    gymName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },

    city: {
        color: '#a1a1aa',
        marginTop: 8,
        fontSize: 15,
    },

    bottomRow: {
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    memberLabel: {
        color: '#71717a',
        fontSize: 13,
    },

    memberCount: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },

    button: {
        backgroundColor: '#f97316',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 14,
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },

    emptyTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },

    emptySubtitle: {
        color: '#71717a',
        marginTop: 10,
        fontSize: 15,
    },
});