import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { db, firebaseConfig } from '../../../../firebase-config'
import { addDoc, collection, setDoc } from "firebase/firestore";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
    adapter: FirestoreAdapter(firebaseConfig),
    theme: {
        logo: "/logo.png",
        brandColor: "#fb8304",
        colorScheme: "light",
    },
    events: {
        async signIn(message) {
            if (message.isNewUser) {
                const newUser = await addDoc(collection(db, "profile"), {
                    "name": message.user.name,
                    "email": message.user.email,
                    "image": message.user.image,
                    "u_id": message.user.id,
                    "orders": [],
                })

            }
        },
    }
})