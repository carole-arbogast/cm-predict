import NextAuth from "next-auth";

const options = {
  site: process.env.VERCEL_URL || "http://localhost:3000",
  providers: [
    {
      id: "twinoid",
      name: "Twinoid",
      type: "oauth",
      version: "2.0",
      scope: "www.hordes.fr",
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://twinoid.com/oauth/token",
      authorizationUrl: "https://twinoid.com/oauth/auth?response_type=code",
      profileUrl: "https://twinoid.com/graph/me",
      clientId: process.env.TWINOID_CLIENT_ID,
      clientSecret: process.env.TWINOID_SECRET_KEY,
      profile: (profile: any) => {
        return {
          id: profile.id,
          name: profile.name,
          image: profile.picture,
        };
      },
    },
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, token) => {
      if (!session?.user || !token?.account) {
        return session;
      }

      session.user.id = token.account.id;
      session.accessToken = token.account.accessToken;

      return session;
    },
  },
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
