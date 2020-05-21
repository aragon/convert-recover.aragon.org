import React from 'react'
import { Box, Split, GU, textStyle } from '@aragon/ui'
import 'styled-components/macro'
import Header from './components/Header/Header'
import OrdersTable from './components/OrdersTable'
import { BUY_ORDER } from './lib/query-types'
import { useTokenBalance } from './lib/web3-contracts'
import { formatUnits } from './lib//web3-utils'
import { useWallet } from 'use-wallet'

function Container({ children }) {
  return (
    <div
      css={`
        margin-top: ${12 * GU}px;
      `}
    >
      {children}
    </div>
  )
}

function App() {
  const { connected } = useWallet()
  const antBalance = useTokenBalance('ANT')
  const anjBalance = useTokenBalance('ANJ')

  return (
    <>
      <Header />
      <Container>
        <Split
          primary={<OrdersTable type={BUY_ORDER} />}
          secondary={
            <Box heading="Current Balances">
              <div
                css={`
                  ${textStyle('body2')}
                  margin-bottom: ${2 * GU}px;
                `}
              >
                ANT:{' '}
                {connected
                  ? formatUnits(antBalance.toString(), {
                      truncateToDecimalPlace: 4,
                    })
                  : 0}
              </div>
              <div
                css={`
                  ${textStyle('body2')}
                `}
              >
                ANJ:{' '}
                {connected
                  ? formatUnits(anjBalance.toString(), {
                      truncateToDecimalPlace: 4,
                    })
                  : 0}
              </div>
            </Box>
          }
        />
      </Container>
    </>
  )
}

export default App
