import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@beyondchats.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple demo auth - in production, verify against database
        if (
          credentials?.email === "admin@beyondchats.com" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@beyondchats.com",
            role: "admin"
          };
        }
        
        // Guest access
        if (
          credentials?.email === "guest@beyondchats.com" &&
          credentials?.password === "guest123"
        ) {
          return {
            id: "2",
            name: "Guest User",
            email: "guest@beyondchats.com",
            role: "guest"
          };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here-change-in-production",
});

export { handler as GET, handler as POST };
