import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Image } from 'expo-image';
import asychronicStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function MemberLayout() {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  function handleGetUserName() {
    asychronicStorage.getItem('@gymhub_auth').then((user) => {
      if (user) {
        // console.log('User data retrieved:', JSON.parse(user));
        setName(JSON.parse(user).user.username);
        setProfilePicture(JSON.parse(user).user.profile_picture);
      }
    }).catch((error) => {
      console.error('Error retrieving user name:', error);
    });
  }
  useEffect(() => {
    handleGetUserName()
  }, [])
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: {
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#1a1a1a',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore Gyms',
          headerLeft: () => (
            <MaterialCommunityIcons
              name="compass"
              size={24}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Image
              source={profilePicture ? { uri: profilePicture } : `https://placehold.co/250/FFBF00/050203?text=${name ? name.charAt(0).toUpperCase() : 'U'}`}
              contentFit="cover"
              placeholder="blurhash"
              transition={300}
              style={{
                width: 40,
                height: 40,
                marginRight: 15,
                borderRadius: 50
              }}
            />
          ),

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="compass" size={24} color={color} />
          ),
        }}

      />
      <Tabs.Screen
        name="gymDetail"
        options={{
          title: 'Gym Detail',
          href: null,
          headerShown: false,
        }}

      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          headerLeft: () => (
            <MaterialCommunityIcons
              name="home"
              size={24}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Image
              source={profilePicture ? { uri: profilePicture } : `https://placehold.co/250/FFBF00/050203?text=${name ? name.charAt(0).toUpperCase() : 'U'}`}
              contentFit="cover"
              placeholder="blurhash"
              transition={300}
              style={{
                width: 40,
                height: 40,
                marginRight: 15,
                borderRadius: 50
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="subscription"
        options={{
          title: 'Subscription',
          tabBarLabel: 'Subscription',
          // headerLeft: () => (
          //   <MaterialCommunityIcons
          //     name="credit-card"
          //     size={24}
          //     color="#fff"
          //     style={{ marginLeft: 15 }}
          //   />
          // ),
          headerShown: false,
          href: null,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="credit-card" size={24} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="workout"
        options={{
          title: 'Workouts',
          tabBarLabel: 'Workouts',
          headerLeft: () => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dumbbell" size={24} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workouts',
          href: null
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          href: null
        }}
      />

      {/* <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
          headerLeft: () => (
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" size={24} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerLeft: () => (
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color="#fff"
              style={{ marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Image
              source={profilePicture ? { uri: profilePicture } : `https://placehold.co/250/FFBF00/050203?text=${name ? name.charAt(0).toUpperCase() : 'U'}`}
              contentFit="cover"
              placeholder="blurhash"
              transition={300}
              style={{
                width: 40,
                height: 40,
                marginRight: 15,
                borderRadius: 50
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}