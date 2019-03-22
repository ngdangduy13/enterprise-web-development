import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          {/* <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          /> */}

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <body
          className="custom_class"
        >
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
