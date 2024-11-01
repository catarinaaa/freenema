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
          <title>Passatempos App</title>
        </Head>
      </div>
      <h1>freenema</h1>
      <main className={styles.main}></main>
      <Content data={dataList} />
    </div>
  );
}
