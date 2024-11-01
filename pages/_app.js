import { ChakraProvider } from '@chakra-ui/react';
import Content from '../public/Content.js';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
