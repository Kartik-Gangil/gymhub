import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { useAuthStore } from '../../../../lib/auth-store';

interface ProgressEntry {
    id: string;
    weight: number;
    body_fat: number | null;
    created_at: string;
}

const MOCK_ENTRIES: ProgressEntry[] = [
    { id: '1', weight: 190, body_fat: 18.5, created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', weight: 188, body_fat: 18.0, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', weight: 185, body_fat: 17.2, created_at: new Date().toISOString() },
];

export default function ProgressScreen() {
    const { user } = useAuthStore();
    const [entries, setEntries] = useState<ProgressEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ weight: '', body_fat: '' });

    useEffect(() => {
        if (user) {
            setEntries(MOCK_ENTRIES);
        }
    }, [user]);

    const handleAddEntry = () => {
        if (!formData.weight) return;

        const newEntry: ProgressEntry = {
            id: Date.now().toString(),
            weight: parseFloat(formData.weight),
            body_fat: formData.body_fat ? parseFloat(formData.body_fat) : null,
            created_at: new Date().toISOString(),
        };

        setEntries((prev) => [newEntry, ...prev]);
        setFormData({ weight: '', body_fat: '' });
        setShowForm(false);
    };

    const renderEntry = ({ item }: { item: ProgressEntry }) => (
        <Card style={styles.entryCard}>
            <Card.Content>
                <View style={styles.entryRow}>
                    <View>
                        <Text variant="labelSmall" style={styles.label}>Weight</Text>
                        <Text variant="titleMedium" style={styles.value}>{item.weight} lbs</Text>
                    </View>
                    {item.body_fat && (
                        <View>
                            <Text variant="labelSmall" style={styles.label}>Body Fat</Text>
                            <Text variant="titleMedium" style={styles.value}>{item.body_fat}%</Text>
                        </View>
                    )}
                    <Text style={styles.date}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <ScrollView style={styles.container}>
            {!showForm ? (
                <Button mode="contained" onPress={() => setShowForm(true)} style={styles.addButton}>
                    Log Progress
                </Button>
            ) : (
                <Card style={styles.formCard}>
                    <Card.Content>
                        <TextInput
                            label="Weight (lbs)"
                            value={formData.weight}
                            onChangeText={(text) => setFormData({ ...formData, weight: text })}
                            keyboardType="decimal-pad"
                            style={styles.input}
                        />
                        <TextInput
                            label="Body Fat % (optional)"
                            value={formData.body_fat}
                            onChangeText={(text) => setFormData({ ...formData, body_fat: text })}
                            keyboardType="decimal-pad"
                            style={styles.input}
                        />
                        <View style={styles.buttonGroup}>
                            <Button mode="contained" onPress={handleAddEntry} style={{ flex: 1 }}>
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
                data={entries}
                renderItem={renderEntry}
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
    entryCard: {
        backgroundColor: '#2a2a2a',
        marginBottom: 8,
    },
    entryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#aaa',
    },
    value: {
        color: '#FF6347',
    },
    date: {
        color: '#aaa',
        fontSize: 12,
    },
});
