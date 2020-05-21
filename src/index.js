import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { UseWalletProvider } from 'use-wallet'
import { ApolloProvider } from '@apollo/react-hooks'
import { Main } from '@aragon/ui'
import App from './App'

const SUBGRAPH_HTTP_URL =
  'https://api.thegraph.com/subgraphs/name/evalir/marketsubgraph'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: SUBGRAPH_HTTP_URL,
})

const client = new ApolloClient({
  cache,
  link,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <UseWalletProvider
      chainId={1}
      // TODO: Configure portis and fortmatic connectors.
    >
      <React.StrictMode>
        <Main assets="public/aragon-ui/">
          <App />
        </Main>
      </React.StrictMode>
    </UseWalletProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
