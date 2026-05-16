import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function OwnerLayout() {
    return (
        <Tabs
            screenOptions={{
                headerTitleStyle: {
                    color: '#fff',
                    fontWeight: '700',
                },

                headerStyle: {
                    backgroundColor: '#121212',
                    borderBottomColor: '#222',
                    borderBottomWidth: 1,
                },

                headerTintColor: '#fff',

                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopColor: '#222',
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },

                tabBarActiveTintColor: '#FF7A00',
                tabBarInactiveTintColor: '#666',

                headerRight: () => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                            router.push('/owner/gymcreation')
                        }
                        style={{
                            marginRight: 16,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#FF7A00',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons
                            name="plus"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>
                ),
            }}
        >
            {/* DEFAULT SCREEN */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Your Gyms',
                    href: null
                }}
            />

            <Tabs.Screen
                name="members"
                options={{
                    title: 'Members',
                    tabBarLabel: 'Members',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account-group-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="dumbbell"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="subscriptions"
                options={{
                    title: 'Plans',
                    tabBarLabel: 'Plans',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="credit-card-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="expiring"
                options={{
                    title: 'Expiring',
                    tabBarLabel: 'Expiring',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="clock-alert-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="cog-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            {/* HIDDEN SCREEN */}
            <Tabs.Screen
                name="gymcreation"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}