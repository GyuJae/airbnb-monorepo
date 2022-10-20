import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default CustomApp;
