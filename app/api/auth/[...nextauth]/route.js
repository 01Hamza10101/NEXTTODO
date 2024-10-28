// app/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectMongoDB from "../../db/connectdb";
import User from "../../models/user.model";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;

        try {
          await connectMongoDB();
          const userExists = await User.findOne({ Email: email });

          // Create a new user if they don't exist
          if (!userExists) {
            await User.create({
              Name: name,
              Email: email,
              Provider: account.provider,
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // If it's the first time the user signs in, add user info to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Add accessToken if available
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Attach token info to session
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken; // Add accessToken to session

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
