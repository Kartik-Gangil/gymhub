import React, { useEffect, useState } from 'react';
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

const UpdateGym = () => {
    const Base_url = process.env.EXPO_PUBLIC_BASE_URL;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [gymState, setGymState] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    // Logo states
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [logoName, setLogoName] = useState<string | null>(null);
    const [logoType, setLogoType] = useState<string | null>(null);

    // Cover states
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [coverName, setCoverName] = useState<string | null>(null);
    const [coverType, setCoverType] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const STORAGE_KEY = '@userData';

    const getUserId = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);

            if (data) {
                const parsedData = JSON.parse(data);
                // console.log('Parsed User Data:', parsedData);
                return parsedData;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    useEffect(() => {
        const fetchGymData = async () => {
            const userData = await getUserId();
            if (userData) {
                setName(userData.name || '');
                setEmail(userData.email || '');
                setAddress(userData.address || '');
                setCity(userData.city || '');
                setGymState(userData.state || '');
                setPhone(userData.phone || '');
                setDescription(userData.description || '');
            }
        };
        fetchGymData();
    }, [])
    const pickImage = async (type: 'logo' | 'cover') => {
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                setError('Permission denied');
                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.7,
                });

            if (result.canceled) return;

            const asset = result.assets[0];

            const uri = asset.uri;
            const filename = uri.split('/').pop() || 'photo.jpg';

            const match = /\.(\w+)$/.exec(filename);

            const imageType = match
                ? `image/${match[1]}`
                : 'image/jpeg';

            if (type === 'logo') {
                setLogoUri(uri);
                setLogoName(filename);
                setLogoType(imageType);
            } else {
                setCoverUri(uri);
                setCoverName(filename);
                setCoverType(imageType);
            }
        } catch (error) {
            console.log(error);
            setError('Failed to pick image');
        }
    };

    const handleUpdateGym = async () => {
        try {
            setLoading(true);
            setError('');

            const id = await getUserId();

            if (!id) {
                setError('User not found');
                return;
            }

            const url = `${Base_url}/owner/updateGym/${id._id}`;
            const formData = new FormData();

            formData.append('name', name);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('state', gymState);
            formData.append('phone', phone);
            formData.append('description', description);

            // Cover Image
            if (coverUri) {
                const uri =
                    Platform.OS === 'android'
                        ? coverUri
                        : coverUri.replace('file://', '');

                const filename =
                    coverName ||
                    uri.split('/').pop() ||
                    'photo.jpg';

                const match = /\.(\w+)$/.exec(filename);

                const type =
                    coverType ||
                    (match
                        ? `image/${match[1]}`
                        : 'image/jpeg');

                // @ts-ignore
                formData.append('image', {
                    uri,
                    name: filename,
                    type,
                });
            }

            // Logo Image
            if (logoUri) {
                const uri =
                    Platform.OS === 'android'
                        ? logoUri
                        : logoUri.replace('file://', '');

                const filename =
                    logoName ||
                    uri.split('/').pop() ||
                    'photo.jpg';

                const match = /\.(\w+)$/.exec(filename);

                const type =
                    logoType ||
                    (match
                        ? `image/${match[1]}`
                        : 'image/jpeg');

                // @ts-ignore
                formData.append('logo', {
                    uri,
                    name: filename,
                    type,
                });
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            alert('Gym updated successfully');
        } catch (error) {
            console.log(error);
            setError('Failed to update gym');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons
                            name="dumbbell"
                            size={38}
                            color="#FF7A00"
                        />
                    </View>

                    <Text
                        variant="headlineMedium"
                        style={styles.title}
                    >
                        Update Gym
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={styles.subtitle}
                    >
                        Update your gym information
                    </Text>
                </View>

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
                        style={styles.input}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <TextInput
                            label="City"
                            value={city}
                            onChangeText={setCity}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                        />

                        <TextInput
                            label="State"
                            value={gymState}
                            onChangeText={setGymState}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                        />
                    </View>

                    <TextInput
                        label="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        mode="outlined"
                        style={styles.input}
                    />

                    {/* Logo */}
                    <View style={styles.logoSection}>
                        {logoUri && (
                            <Image
                                source={{ uri: logoUri }}
                                style={styles.logoPreview}
                            />
                        )}

                        <Button
                            mode="outlined"
                            onPress={() => pickImage('logo')}
                            style={styles.uploadButton}
                        >
                            {logoUri
                                ? 'Change Logo'
                                : 'Upload Logo'}
                        </Button>
                    </View>

                    {/* Cover */}
                    <View style={styles.logoSection}>
                        {coverUri && (
                            <Image
                                source={{ uri: coverUri }}
                                style={styles.coverPreview}
                            />
                        )}

                        <Button
                            mode="outlined"
                            onPress={() => pickImage('cover')}
                            style={styles.uploadButton}
                        >
                            {coverUri
                                ? 'Change Cover'
                                : 'Upload Cover'}
                        </Button>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleUpdateGym}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                    >
                        Update Gym
                    </Button>

                    <TouchableOpacity style={styles.footer}>
                        <Text style={styles.footerText}>
                            Manage members & subscriptions
                        </Text>
                    </TouchableOpacity>
                </Surface>
            </ScrollView>
        </View>
    );
};

export default UpdateGym;

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
        marginBottom: 18,
    },

    title: {
        color: '#fff',
        fontWeight: '700',
    },

    subtitle: {
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
    },

    card: {
        backgroundColor: '#18181B',
        borderRadius: 28,
        padding: 22,
    },

    input: {
        marginBottom: 18,
        backgroundColor: '#18181B',
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    halfInput: {
        flex: 1,
    },

    button: {
        marginTop: 12,
        backgroundColor: '#FF7A00',
        borderRadius: 16,
    },

    errorBox: {
        marginBottom: 18,
    },

    errorText: {
        color: 'red',
        textAlign: 'center',
    },

    logoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },

    logoPreview: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginBottom: 10,
    },

    coverPreview: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 10,
    },

    uploadButton: {
        borderColor: '#FF7A00',
    },

    footer: {
        marginTop: 20,
        alignItems: 'center',
    },

    footerText: {
        color: '#71717A',
    },
});