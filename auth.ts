import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              return null;
            }

            try {
              const user = await prisma.user.findUnique({
                where: {
                  email: credentials.email
                }
              });

              if (!user || !user.password) {
                return null;
              }

              const passwordMatches = await bcrypt.compare(
                credentials.password, 
                user.password
              );

              if (!passwordMatches) {
                return null;
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            } catch (error) {
              console.error("Error during credential login:", error);
              return null;
            }
          }
        })
      ],
    callbacks: {
      async signIn({ user, account }) {
        // For credentials provider, we already verified in authorize
        if (account?.provider === "credentials") {
          return true;
        }

        // Handle Google sign in
        if (account?.provider === "google" && user.email) {
          try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
              where: {
                email: user.email,
              },
            });

            // If user doesn't exist, create a new one
            if (!existingUser) {
              await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "",
                  profileImage: user.image || "",
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
              });
            }
            
            return true;
          } catch (error) {
            console.error("Error during Google sign in:", error);
            return false;
          }
        }

        return true;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }
    },
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: "jwt"
    }
})