import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {

    const router = useRouter();

    const {
        initialize,
        isLoading,
        user,
        role
    } = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        // console.log({
        //     user,
        //     role,
        //     isLoading
        // })
        if (isLoading) return;

        if (!user) {

            router.replace("/login");
            return;

        }

        if (role === "owner") {

            router.replace("/(app)/owner");

        } else {

            router.replace("/(app)/member");

        }

    }, [
        isLoading,
        user,
        role
    ])

    return null;

}