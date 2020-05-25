import React, { useCallback } from 'react'
import 'styled-components/macro'
import { useWallet } from 'use-wallet'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Button, DataView, Link, Info, useToast } from '@aragon/ui'
import { BUY_ORDER, SELL_ORDER } from '../lib/query-types.js'
import { useClaimOrder } from '../lib/web3-contracts.js'
import { formatUnits, shortenAddress } from '../lib/web3-utils.js'

const ORDER_FIELDS = ['Transaction Hash', 'Batch ID', 'Trade Type', 'Value']

const POLL_INTERVAL_MS = 30000 // 30 secs long polling

const ETHERSCAN_TX_PREFIX = 'https://etherscan.io/tx/'

const GET_ALL_ORDERS_QUERY = gql`
  query getAllOrders($address: String) {
    buyOrders(where: { buyer: $address, claimed: false }) {
      id
      batchId
      collateral
      transactionHash
      value
    }
    sellOrders(where: { seller: $address, claimed: false }) {
      id
      batchId
      collateral
      transactionHash
      value
    }
  }
`

export default function OrdersTable() {
  const { account, ethereum } = useWallet()
  const toast = useToast()
  const claimOrder = useClaimOrder()

  const { data, loading, error } = useQuery(GET_ALL_ORDERS_QUERY, {
    variables: {
      address: !account ? '0x' : account,
    },
    pollInterval: POLL_INTERVAL_MS,
  })

  const handleClaim = useCallback(
    async (orderType, batchId, collateral) => {
      if (!ethereum) {
        return
      }
      try {
        const tx = await claimOrder(orderType, batchId, collateral)
        toast('Transaction sent succesfully!')
        await tx.wait()
        toast('Transaction mined succesfully!')
      } catch (err) {
        toast('Something went wrong or you declined the transaction.')
      }
    },
    [claimOrder, ethereum, toast],
  )

  if (loading) {
    return <h2>loading...</h2>
  }

  if (error) {
    return (
      <Info mode="error">
        {' '}
        An error has ocurred. Please reload the window, or contact the
        developers for assistance if this error persists.
      </Info>
    )
  }

  const { buyOrders, sellOrders } = data
  const preparedBuyOrders = buyOrders.map(buyOrder => ({
    ...buyOrder,
    orderType: BUY_ORDER,
  }))
  const preparedSellOrders = sellOrders.map(sellOrder => ({
    ...sellOrder,
    orderType: SELL_ORDER,
  }))
  const orders = [...preparedBuyOrders, ...preparedSellOrders]

  return (
    <DataView
      fields={ORDER_FIELDS}
      entries={orders}
      renderEntry={({ batchId, orderType, transactionHash, value }) => {
        return [
          <Link
            external
            href={`${ETHERSCAN_TX_PREFIX}${transactionHash}`}
            key={transactionHash}
          >
            {shortenAddress(transactionHash)}
          </Link>,
          <p key={batchId}>{batchId}</p>,
          orderType === BUY_ORDER ? <p>ANT → ANJ</p> : <p>ANJ → ANT</p>,
          <p key={batchId}>{`${formatUnits(value, {
            truncateToDecimalPlace: 4,
          })} ${orderType === BUY_ORDER ? 'ANT' : 'ANJ'}`}</p>,
        ]
      }}
      renderEntryActions={({ batchId, collateral, orderType }) => {
        return (
          <Button
            mode="strong"
            label="Claim order"
            onClick={() => handleClaim(orderType, batchId, collateral)}
          >
            Claim order
          </Button>
        )
      }}
    />
  )
}
