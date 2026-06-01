import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";

export default function Index() {

    const router =
        useRouter();

    const {
        user,
        role,
        isLoading
    } =
        useAuthStore();

    useEffect(() => {

        // console.log(
        //     "STATE:",
        //     {
        //         user,
        //         role,
        //         isLoading
        //     }
        // );

        if (
            isLoading
        ) return;

        if (
            !user
        ) {

            router.replace(
                "/login"
            );

            return;

        }

        router.replace(

            role === "owner"

                ?

                "/(app)/owner"

                :

                "/(app)/member"

        );

    }, [

        user,

        role,

        isLoading

    ]);

    return null;

}