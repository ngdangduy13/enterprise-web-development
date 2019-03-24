import App, { Container } from "next/app";
import React from "react";
import NProgress from "next-nprogress/component";
import Head from "next/head";
import "../static/css/index.css";
import "braft-editor/dist/index.css";
import "antd/dist/antd.css";
import withNProgress from "next-nprogress";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>G7 - Enterprise Web Development</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default withNProgress(1000, { showSpinner: false })(MyApp);
