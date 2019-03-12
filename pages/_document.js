import Document, { Head, Main, NextScript } from 'next/document'
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8'/>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}