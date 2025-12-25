import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./db";
import { UserRole } from "@prisma/client";

// Role-based access control utilities
export const hasPermission = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  const roleHierarchy = {
    [UserRole.CUSTOMER]: 0,
    [UserRole.AUTHOR]: 1,
    [UserRole.EDITOR]: 2,
    [UserRole.ADMIN]: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canEditPost = (
  userRole: UserRole,
  postAuthorId?: string,
  currentUserId?: string
): boolean => {
  if (userRole === UserRole.ADMIN || userRole === UserRole.EDITOR) return true;
  if (
    userRole === UserRole.AUTHOR &&
    postAuthorId &&
    currentUserId &&
    postAuthorId === currentUserId
  )
    return true;
  return false;
};

export const canEditSpecificPost = (
  userRole: UserRole,
  postAuthorId: string,
  currentUserId: string
): boolean => {
  if (userRole === UserRole.ADMIN) return true;
  if (userRole === UserRole.EDITOR) return true;
  if (userRole === UserRole.AUTHOR && postAuthorId === currentUserId)
    return true;
  return false;
};

export const canDeletePost = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN || userRole === UserRole.EDITOR;
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN;
};

export const canManageCategories = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN || userRole === UserRole.EDITOR;
};

export const canManageMedia = (userRole: UserRole): boolean => {
  return (
    userRole === UserRole.ADMIN ||
    userRole === UserRole.EDITOR ||
    userRole === UserRole.AUTHOR
  );
};

// Middleware function for protecting CMS routes
export const requireAuth = async () => {
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized: No session found");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, role: true, name: true, email: true, image: true },
  });

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  // Use NEXTAUTH_URL for base URL configuration
  ...(process.env.NEXTAUTH_URL && { 
    url: process.env.NEXTAUTH_URL 
  }),
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("SignIn callback - User:", user); // Debug log
      console.log("SignIn callback - Account:", account); // Debug log
      console.log("SignIn callback - Profile:", profile); // Debug log

      // Handle Google OAuth image saving
      if (account?.provider === "google" && user.email && user.image) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Update existing user with new image
            await prisma.user.update({
              where: { email: user.email },
              data: { image: user.image },
            });
            console.log("Updated existing user image:", user.image); // Debug log
          } else {
            // For new users, PrismaAdapter will create them, but we need to ensure image is saved
            // We'll update the image after the adapter creates the user
            console.log("New user, will be created by adapter"); // Debug log
          }
        } catch (error) {
          console.error("Error in signIn callback:", error); // Debug log
        }
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            role: true,
            email: true,
            name: true,
            image: true,
          },
        });
        if (dbUser) {
          console.log("DB User:", dbUser); // Debug log
          console.log("DB User image value:", dbUser.image); // Debug log
          console.log("DB User image type:", typeof dbUser.image); // Debug log
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;

          // Handle both Google OAuth images and custom uploaded images
          if (dbUser.image) {
            // User has an image in database (could be Google or custom uploaded)
            session.user.image = dbUser.image;
          } else if (token?.picture) {
            // User has no image in DB but token has Google image - save it
            console.log("Saving Google image to DB:", token.picture); // Debug log
            await prisma.user.update({
              where: { id: token.sub },
              data: { image: token.picture },
            });
            session.user.image = token.picture;
          }
          console.log("Final session user image:", session.user.image); // Debug log
        } else {
          console.log("No user found in DB for token:", token.sub); // Debug log
        }
      } else {
        console.log("Session or token.sub missing:", {
          session: !!session,
          tokenSub: token?.sub,
        }); // Debug log
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        // Store the image in the token for later use
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};
