import "../styles/globals.css";
import { Auth } from "./../contexts/authContext";
import { CartProvider } from "./../contexts/cartContext";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Auth>
      <CartProvider>
        <Head>
          <script src="https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js"></script>
          <link
            href="https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css"
            rel="stylesheet"
          />
          <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"></script>
          <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.css"
            type="text/css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          />
        </Head>
        <Component {...pageProps} />
      </CartProvider>
    </Auth>
  );
}

export default MyApp;
