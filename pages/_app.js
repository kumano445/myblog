import Layout from '../components/Layout';
import '../app/globals.css';
import '../app/blog/[slug]/content.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;