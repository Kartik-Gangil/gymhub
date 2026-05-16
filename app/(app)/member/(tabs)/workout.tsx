import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Button, TextInput, IconButton } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

interface Workout {
    id: string;
    exercise_name: string;
    sets: number;
    reps: number;
    day_of_week: string;
    completed: boolean;
}

const MOCK_WORKOUTS: Workout[] = [
    { id: '1', exercise_name: 'Bench Press', sets: 3, reps: 10, day_of_week: 'Monday', completed: false },
    { id: '2', exercise_name: 'Squat', sets: 4, reps: 8, day_of_week: 'Wednesday', completed: true },
    { id: '3', exercise_name: 'Deadlift', sets: 3, reps: 6, day_of_week: 'Friday', completed: false },
];

export default function WorkoutsScreen() {
    const { user } = useAuthStore();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        exercise_name: '',
        sets: '',
        reps: '',
        day_of_week: 'Monday',
    });

    useEffect(() => {
        if (user) {
            // Load mock workouts
            setWorkouts(MOCK_WORKOUTS);
        }
    }, [user]);

    const handleAddWorkout = () => {
        if (!formData.exercise_name) return;

        const newWorkout: Workout = {
            id: Date.now().toString(),
            exercise_name: formData.exercise_name,
            sets: parseInt(formData.sets) || 0,
            reps: parseInt(formData.reps) || 0,
            day_of_week: formData.day_of_week,
            completed: false,
        };

        setWorkouts((prev) => [...prev, newWorkout]);
        setFormData({ exercise_name: '', sets: '', reps: '', day_of_week: 'Monday' });
        setShowForm(false);
    };

    const toggleWorkout = (id: string) => {
        setWorkouts((prev) =>
            prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
        );
    };

    const renderWorkout = ({ item }: { item: Workout }) => (
        <Card style={styles.workoutCard}>
            <Card.Content>
                <Text variant="titleMedium">{item.exercise_name}</Text>
                <View style={styles.workoutDetails}>
                    <Text style={styles.detail}>{item.sets} sets × {item.reps} reps</Text>
                    <Text style={styles.detail}>{item.day_of_week}</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon={item.completed ? 'check-circle' : 'circle-outline'}
                    iconColor={item.completed ? '#FF6347' : '#666'}
                    onPress={() => toggleWorkout(item.id)}
                />
            </Card.Actions>
        </Card>
    );

    return (
        <ScrollView style={styles.container}>
            {!showForm ? (
                <Button mode="contained" onPress={() => setShowForm(true)} style={styles.addButton}>
                    Add Workout
                </Button>
            ) : (
                <Card style={styles.formCard}>
                    <Card.Content>
                        <TextInput
                            label="Exercise Name"
                            value={formData.exercise_name}
                            onChangeText={(text) => setFormData({ ...formData, exercise_name: text })}
                            style={styles.input}
                        />
                        <TextInput
                            label="Sets"
                            value={formData.sets}
                            onChangeText={(text) => setFormData({ ...formData, sets: text })}
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                        <TextInput
                            label="Reps"
                            value={formData.reps}
                            onChangeText={(text) => setFormData({ ...formData, reps: text })}
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                        <View style={styles.buttonGroup}>
                            <Button mode="contained" onPress={handleAddWorkout} style={{ flex: 1 }}>
                                Save
                            </Button>
                            <Button onPress={() => setShowForm(false)} style={{ flex: 1 }}>
                                Cancel
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            )}

            <FlatList
                data={workouts}
                renderItem={renderWorkout}
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
    addButton: {
        marginBottom: 16,
        backgroundColor: '#FF6347',
    },
    formCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    list: {
        gap: 8,
    },
    workoutCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 8,
    },
    workoutDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    detail: {
        color: '#aaa',
        fontSize: 12,
    },
});
