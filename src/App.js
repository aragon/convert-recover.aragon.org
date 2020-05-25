import React from 'react'
import { Box, GU, Header, Split, textStyle } from '@aragon/ui'
import 'styled-components/macro'
import TopHeader from './components/Header/Header'
import OrdersTable from './components/OrdersTable'
import { useTokenBalance } from './lib/web3-contracts'
import { formatUnits } from './lib//web3-utils'
import { useWallet } from 'use-wallet'

function App() {
  const { connected } = useWallet()

  const antBalance = useTokenBalance('ANT')
  const anjBalance = useTokenBalance('ANJ')

  return (
    <>
      <TopHeader />
      <div
        css={`
          margin-top: ${12 * GU}px;
        `}
      >
        <Header primary="Pending orders" />
        <Split
          primary={<OrdersTable />}
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
      </div>
    </>
  )
}

export default App
