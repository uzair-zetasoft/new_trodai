import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from './lib/constants';

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
                role: user.role,
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
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "",
                  profileImage: user.image || "",
                  role: Role.USER, // Explicitly set role for new users
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
              });
              
              // Add role to user object
              user.role = Role.USER;
              return true;
            }
            
            // Add role to user object for Google authentication
            user.role = existingUser.role;
            
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
          // Ensure ID is set
          session.user.id = token.sub;
          
          // Add role from token to session with fallback to USER
          session.user.role = (token.role as Role) || Role.USER;
          
          console.log("Session user role:", session.user.role);
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          // Add ID and role to token
          token.id = user.id;
          token.role = user.role || Role.USER;
          
          console.log("JWT user role:", user.role);
        }
        return token;
      }
    },
    pages: {
      signIn: '/login',
      error: '/unauthorized',
    },
    session: {
      strategy: "jwt"
    }
})