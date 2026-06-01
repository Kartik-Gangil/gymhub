import '@expo/metro-runtime';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../lib/auth-store';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme } from 'react-native-paper';
import * as Linking from "expo-linking";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6347',
    secondary: '#FF8C47',
  },
};

export default function RootLayout() {

  const {
    initialize,
    isLoading
  } = useAuthStore();

  useEffect(() => {

    const handleDeepLink =
      async ({ url }: { url: string }) => {

        try {

          // console.log(
          //   "RAW URL:",
          //   url
          // );

          const parsed =
            Linking.parse(url);

          // console.log(
          //   "PARSED:",
          //   parsed
          // );

          const token =
            parsed.queryParams?.token;

          // console.log(
          //   "TOKEN:",
          //   token
          // );

          if (!token) return;

          const res =
            await fetch(
              `${process.env.EXPO_PUBLIC_BASE_URL}/me`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          if (!res.ok) {

            // console.log(
            //   "ME FAILED"
            // );

            return;
          }

          const userData =
            await res.json();

          // console.log(
          //   "USER:",
          //   userData
          // );

          await useAuthStore
            .getState()
            .setAuth(
              {
                id: userData.user._id,
                email: userData.user.email,
                username:
                  userData.user.username,
                profile_picture:
                  userData.user.profilePicture,
                membership:
                  userData.user.membership || []
              },
              userData.user.role,
              {
                access_token:
                  token
              }
            );

          // console.log(
          //   "AUTH DONE"
          // );

        } catch (err) {

          console.log(
            "DEEP LINK ERROR:",
            err
          );

        }

      };

    const sub =
      Linking.addEventListener(
        "url",
        handleDeepLink
      );

    const bootstrap =
      async () => {

        const initialUrl =
          await Linking.getInitialURL();

        // console.log(
        //   "INITIAL:",
        //   initialUrl
        // );

        if (initialUrl) {

          await handleDeepLink(
            {
              url: initialUrl
            }
          );
         
        }

        await initialize();

      };

    bootstrap();

    return () => {

      sub.remove();

    }

  }, []);

  if (isLoading) {

    return null;

  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style="light"
        backgroundColor="#1a1a1a"
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>

    </PaperProvider>
  );
}