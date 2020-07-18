import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <>
      <div className="container">
        <Head>
          <title>CM - Predict</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">
            Camping Predict Clone{" "}
            <Link href="/predict">
              <a>Predict V2</a>
            </Link>
          </h1>
          <h2>Camping Massif Predict - Under construction</h2>
        </main>
      </div>
    </>
  );
}
