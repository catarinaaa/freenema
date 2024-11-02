import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import Content from '../public/Content.js';
//import { server } from '../config';
import { fetchData } from '../public/fetch.js';

export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: {
      dataList: data,
    },
  };
}

export default function Home({ dataList }) {
  return (
    <div>
      <div>
        <Head>
          <title>Freenema</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </Head>
      </div>
      <Content data={dataList} />
    </div>
  );
}
