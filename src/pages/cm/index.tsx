import React from "react";
import { getSession, signin, signout } from "next-auth/client";
import hordesApi from "../../lib/hordesAPI";
import { GetServerSideProps } from "next";

interface Props {
  session?: any;
  info?: any;
}

export function CampingMassifIndex(props: Props) {
  const { session, info } = props;

  React.useEffect(() => {
    if (info?.error === "invalid_token") {
      signout();
    }
  }, [info?.error]);

  if (!session) {
    return <button onClick={() => signin("twinoid")}>Sign in</button>;
  }

  return (
    <>
      <h1>CM</h1>
      <>
        <p>Signed in as {session.name}</p>
        <button onClick={signout}>Sign out</button>
      </>
      <code>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </code>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const token = session?.accessToken;
  const info =
    token &&
    (await hordesApi.info(token, {
      fields: [
        {
          map: [
            "city",
            {
              citizens: ["x", "y", "name", "job", "out", "hero"],
              cadavers: ["name", "day", "comment", "cleanup", "id"],
              zones: ["building", "details"],
            },
          ],
        },
      ],
    }));

  return {
    props: {
      session: session?.user || null,
      info: info || null,
    },
  };
};

export default CampingMassifIndex;
