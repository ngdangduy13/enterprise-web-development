import App, { Container } from "next/app";
import React from "react";
import NProgress from "next-nprogress/component";
import Head from "next/head";
import "../static/css/index.css";

export default class FinalProject extends App {
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
