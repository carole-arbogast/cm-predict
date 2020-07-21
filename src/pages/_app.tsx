import React from "react";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import { Provider } from "next-auth/client";

const site = process.env.VERCEL_URL || "http://localhost:3000";

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;

  return (
    <Provider options={{ site }} session={session}>
      <GlobalStyle /> <Component {...pageProps} />
    </Provider>
  );
}

const GlobalStyle = createGlobalStyle`

  html{
  margin: 0
  }
  body {
    padding: 0;
    margin: 0;
    font-family: "Raleway";
    padding-bottom: 1.5rem;
    background: url("/images/bg_big.jpg");
    background-color: #040001;
    color:#faf7f7;
    background-position: top;
    background-repeat: no-repeat;
    user-select: none;
  }
  * {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  } 

  h2{
    margin: 0;
  }

`;

export default MyApp;
