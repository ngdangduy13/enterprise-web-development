import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import initStore from '../rematch'
import withRedux from "next-redux-wrapper";



class FinalProject extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>)
  }
}

export default withRedux(initStore)(FinalProject);