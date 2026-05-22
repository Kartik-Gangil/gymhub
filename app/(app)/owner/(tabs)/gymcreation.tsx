import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    Surface,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const GymCreation = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [logoName, setLogoName] = useState<string | null>(null);
    const [logoType, setLogoType] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const STORAGE_KEY = '@gymhub_auth';
    const getUserId = async () => {
        try {
            const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedAuth) {
                const parsedData = JSON.parse(storedAuth);

                const userId = parsedData.user.id;

                // console.log('User ID:', userId);

                return userId;
            }

            return null;
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateGym = async () => {
        try {

            const id = await getUserId();

            setLoading(true);
            setError('');

            const url = `http://192.168.29.218:8000/owner/add-gym/${id}`;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('phone', phone);
            formData.append('description', description);

            if (logoUri) {
                const uri = Platform.OS === 'android' ? logoUri : logoUri.replace('file://', '');
                const filename = logoName || uri.split('/').pop() || 'photo.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = logoType || (match ? `image/${match[1]}` : 'image/jpeg');
                // @ts-ignore - React Native FormData file object
                formData.append('image', { uri, name: filename, type });
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    // NOTE: Do NOT set Content-Type header; let fetch set the multipart boundary
                },
                body: formData,
            });

            const data = await res.json();
            console.log(data);
        } catch (err) {
            setError('Failed to create gym');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access media library is required.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            // Newer SDK returns assets array
            const asset = (result as any).assets ? (result as any).assets[0] : result;

            if (!asset || asset.cancelled) return;

            const uri = asset.uri || asset.uri;
            setLogoUri(uri);

            const name = uri.split('/').pop();
            setLogoName(name || null);

            const match = /\.(\w+)$/.exec(name || '');
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            setLogoType(type);
        } catch (e) {
            console.log(e);
            setError('Image selection failed');
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons
                            name="dumbbell"
                            size={38}
                            color="#FF7A00"
                        />
                    </View>

                    <Text variant="headlineMedium" style={styles.title}>
                        Create Gym
                    </Text>

                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Setup your fitness business and manage members easily
                    </Text>
                </View>

                {/* Form Card */}
                <Surface style={styles.card} elevation={5}>
                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    <TextInput
                        label="Gym Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        left={<TextInput.Icon icon="dumbbell" />}
                        style={styles.input}
                        outlineStyle={styles.outline}
                        theme={inputTheme}
                    />

                    <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="outlined"
                        left={<TextInput.Icon icon="email-outline" />}
                        style={styles.input}
                        outlineStyle={styles.outline}
                        theme={inputTheme}
                    />

                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        left={<TextInput.Icon icon="map-marker-outline" />}
                        style={styles.input}
                        outlineStyle={styles.outline}
                        theme={inputTheme}
                    />

                    <View style={styles.row}>
                        <TextInput
                            label="City"
                            value={city}
                            onChangeText={setCity}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                            outlineStyle={styles.outline}
                            theme={inputTheme}
                        />

                        <TextInput
                            label="State"
                            value={state}
                            onChangeText={setState}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                            outlineStyle={styles.outline}
                            theme={inputTheme}
                        />
                    </View>

                    <TextInput
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        mode="outlined"
                        left={<TextInput.Icon icon="phone-outline" />}
                        style={styles.input}
                        outlineStyle={styles.outline}
                        theme={inputTheme}
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.outline}
                        theme={inputTheme}
                    />

                    <View style={styles.logoSection}>
                        {logoUri ? (
                            <Image source={{ uri: logoUri }} style={styles.logoPreview} />
                        ) : null}

                        <Button
                            mode="outlined"
                            onPress={pickImage}
                            style={styles.uploadButton}
                            labelStyle={styles.uploadButtonLabel}
                        >
                            {logoUri ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleCreateGym}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Create Gym
                    </Button>

                    <TouchableOpacity style={styles.footer}>
                        <Text style={styles.footerText}>
                            Manage members, subscriptions & workouts
                        </Text>
                    </TouchableOpacity>
                </Surface>
            </ScrollView>
        </View>
    );
};

export default GymCreation;

const inputTheme = {
    colors: {
        primary: '#FF7A00',
        background: '#1C1C1E',
        text: '#FFFFFF',
        placeholder: '#8E8E93',
    },
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0F0F10',
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },

    iconWrapper: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginBottom: 18,
    },

    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 8,
    },

    subtitle: {
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 12,
    },

    card: {
        backgroundColor: '#18181B',
        borderRadius: 28,
        padding: 22,
    },

    errorBox: {
        backgroundColor: 'rgba(255,80,80,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,80,80,0.2)',
        padding: 12,
        borderRadius: 14,
        marginBottom: 18,
    },

    errorText: {
        color: '#FF6B6B',
        textAlign: 'center',
    },

    input: {
        marginBottom: 18,
        backgroundColor: '#18181B',
    },

    outline: {
        borderRadius: 16,
        borderWidth: 1.2,
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    halfInput: {
        flex: 1,
    },

    button: {
        marginTop: 10,
        borderRadius: 18,
        backgroundColor: '#FF7A00',
    },

    buttonContent: {
        height: 58,
    },

    buttonLabel: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.4,
    },

    footer: {
        marginTop: 22,
        alignItems: 'center',
    },

    footerText: {
        color: '#71717A',
        fontSize: 13,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 8,
    },
    logoPreview: {
        width: 112,
        height: 112,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: '#111',
    },
    uploadButton: {
        borderRadius: 14,
        borderColor: '#FF7A00',
    },
    uploadButtonLabel: {
        color: '#FF7A00',
        fontWeight: '700',
    },
});