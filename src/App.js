import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  GU,
  Header,
  IconSwap,
  Split,
  textStyle,
  useViewport,
} from '@aragon/ui'
import 'styled-components/macro'
import TopHeader from './components/Header/Header'
import OrdersTable from './components/OrdersTable'
import { BUY_ORDER, SELL_ORDER } from './lib/query-types'
import { useTokenBalance } from './lib/web3-contracts'
import { formatUnits } from './lib//web3-utils'
import { useWallet } from 'use-wallet'

function App() {
  const [type, setType] = useState(BUY_ORDER)

  const { connected } = useWallet()
  const { below } = useViewport()

  const antBalance = useTokenBalance('ANT')
  const anjBalance = useTokenBalance('ANJ')

  const handleSwitch = useCallback(() => {
    return setType(type === BUY_ORDER ? SELL_ORDER : BUY_ORDER)
  }, [type])

  return (
    <>
      <TopHeader />
      <div
        css={`
          margin-top: ${12 * GU}px;
        `}
      >
        <Header
          primary={`Pending ${
            type === BUY_ORDER ? 'ANT to ANJ' : 'ANJ to ANT'
          } orders`}
          secondary={
            <Button
              disabled={!connected}
              display={below('medium') ? 'icon' : 'all'}
              icon={<IconSwap />}
              mode="strong"
              label="Switch"
              onClick={handleSwitch}
            />
          }
        />
        <Split
          primary={<OrdersTable type={type} />}
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
