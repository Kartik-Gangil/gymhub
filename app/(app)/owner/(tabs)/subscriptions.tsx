import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Text,
    TextInput,
    Portal,
    Modal,
} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Subscription {
    _id: string;
    name: string;
    price: number;
    duration: string;
}

const STORAGE_KEY = '@userData';

export default function SubscriptionsScreen() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [visible, setVisible] = useState(false);
    const [Updatevisible, setUpdateVisible] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL || 'https://n8n.creovavteio.in';
    const [planName, setPlanName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    // ✅ Load from AsyncStorage
    const loadPlans = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);

            if (data) {
                const parsed = JSON.parse(data);

                const plans = parsed?.plans || [];
                // console.log(plans);
                setSubscriptions(plans.map((p: any) => ({
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    duration: p.days,
                })));

                // console.log(plans);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadPlans();
        // console.log(planName)
    }, []);

    // ✅ Save back to storage
    const savePlans = async (newPlans: Subscription[]) => {
        const data = await AsyncStorage.getItem(STORAGE_KEY);

        if (!data) return;

        const parsed = JSON.parse(data);

        const updated = {
            ...parsed,
            plans: newPlans,
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };
    const getUserData = async () => {
        try {
            const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedAuth) {
                const parsedData = JSON.parse(storedAuth);

                const data = parsedData;

                console.log('User ID:', data._id); // Log the user ID

                return data;
            }

            return null;
        } catch (error) {
            console.log(error);
        }
    };
    // ✅ Add Plan
    const handleAddPlan = async () => {

        try {
            const data = await getUserData();
            // console.log(data.user.id)
            const res = await fetch(`${Base_url}/owner/addPlan/${data._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: planName, price, days: duration
                })
            })
            const response = await res.json();
            const newPlan = {
                _id: response.id,
                name: planName,
                price: Number(price),
                duration: Number(duration),
            };

            const updated: Subscription[] = [...subscriptions, newPlan];

            setSubscriptions(updated);
            await savePlans(updated);

        } catch (error) {
            console.log(error)
        }


        setVisible(false);
        setPlanName('');
        setPrice('');
        setDuration('');
    };

    // ✅ Update Plan
    const handleUpdatePlan = async () => {
        if (!selectedPlanId) return;

        try {
            const res = await fetch(`${Base_url}/owner/update-plan/${selectedPlanId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: planName, price, days: duration }),
            });

            const response = await res.json();

            // Update local state
            const updated: Subscription[] = subscriptions.map((s) =>
                s._id === selectedPlanId
                    ? { ...s, name: planName, price: Number(price), duration: Number(duration) }
                    : s
            );

            setSubscriptions(updated);
            await savePlans(updated);
        } catch (error) {
            console.log(error);
        }

        setUpdateVisible(false);
        setSelectedPlanId(null);
        setPlanName('');
        setPrice('');
        setDuration('');
    };

    // ✅ Delete Plan
    const handleDelete = async (id: string) => {
        try {
            const data = await getUserData();

            const res = await fetch(`${Base_url}/owner/delete-plan/${data._id}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const updated = subscriptions.filter((s) => s._id !== id);
            setSubscriptions(updated);
            await savePlans(updated);
        } catch (error) {
            console.log(error)
        }
    };

    const renderSubscription = ({ item }: { item: Subscription }) => (
        <Card style={styles.subCard}>
            <Card.Content>

                <View style={styles.head}>
                    <Text variant="titleMedium">{item.name}</Text>
                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color="white"
                        onPress={() => {
                            setSelectedPlanId(item._id);
                            setPlanName(item.name);
                            setPrice(String(item.price));
                            setDuration(String(item.duration));
                            // console.log(item)
                            setUpdateVisible(true);
                        }}
                    />
                </View>

                <View style={styles.details}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.duration}>{item.duration} days</Text>

                </View>
            </Card.Content>

            <Card.Actions>
                <Button onPress={() => handleDelete(item._id)}>Delete</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* ADD BUTTON */}
            <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => {
                    setVisible(true)
                    setPlanName('');
                    setPrice('');
                    setDuration('');
                }
                }
            >
                Add Plan
            </Button>

            {/* LIST */}
            <FlatList
                data={subscriptions}
                renderItem={renderSubscription}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
            />

            {/* MODAL FORM */}
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Text style={styles.modalTitle}>Create Plan</Text>

                    <TextInput
                        label="Plan Name"
                        value={planName}
                        onChangeText={setPlanName}
                        style={styles.input}
                    />

                    <TextInput
                        label="Price"
                        value={price}
                        keyboardType="numeric"
                        onChangeText={setPrice}
                        style={styles.input}
                    />

                    <TextInput
                        label="Duration (days)"
                        value={duration}
                        keyboardType="numeric"
                        onChangeText={setDuration}
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleAddPlan}
                        style={styles.saveBtn}
                    >
                        Save Plan
                    </Button>
                </Modal>
            </Portal>


            {/* UPDATE MODAL */}
            <Portal>
                <Modal
                    visible={Updatevisible}
                    onDismiss={() => setUpdateVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Text style={styles.modalTitle}>Update Plan</Text>

                    <TextInput
                        label="Plan Name"
                        value={planName}
                        onChangeText={setPlanName}
                        style={styles.input}
                    />

                    <TextInput
                        label="Price"
                        value={price}
                        keyboardType="numeric"
                        onChangeText={setPrice}
                        style={styles.input}
                    />

                    <TextInput
                        label="Duration (days)"
                        value={duration}
                        keyboardType="numeric"
                        onChangeText={setDuration}
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleUpdatePlan}
                        style={styles.saveBtn}
                    >
                        Save Plan
                    </Button>
                </Modal>
            </Portal>

        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
    },

    addButton: {
        marginBottom: 16,
        backgroundColor: '#FF6347',
    },

    list: {
        paddingBottom: 20,
    },

    subCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 12,
    },

    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    price: {
        color: '#FF6347',
        fontSize: 16,
        fontWeight: 'bold',
    },

    duration: {
        color: '#aaa',
    },

    modal: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },

    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },

    input: {
        marginBottom: 12,
        backgroundColor: '#2a2a2a',
    },

    saveBtn: {
        marginTop: 8,
        backgroundColor: '#FF6347',
    },
});