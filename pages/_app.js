import App, { Container } from 'next/app'
import React from 'react'
import NProgress from "next-nprogress/component";


export default class FinalProject extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return <Container>
      <Component {...pageProps} >
        <NProgress />
      </Component>
    </Container>
  }
}

