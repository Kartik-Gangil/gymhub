import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function MemberLayout() {
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
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}