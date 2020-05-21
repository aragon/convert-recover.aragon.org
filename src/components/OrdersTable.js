import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import 'styled-components/macro'
import { useWallet } from 'use-wallet'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Button, DataView, Link, Info, useToast } from '@aragon/ui'
import { BUY_ORDER } from '../lib/query-types.js'
import { useClaimOrder } from '../lib/web3-contracts.js'
import { formatUnits, shortenAddress } from '../lib/web3-utils.js'

const ORDER_FIELDS = ['Transaction Hash', 'Batch ID', 'Value']

const POLL_INTERVAL_MS = 30000 // 30 secs long polling

const GET_BUY_ORDERS_QUERY = gql`
  query getBuyOrders($address: String) {
    buyOrders(where: { buyer: $address, claimed: false }) {
      id
      batchId
      collateral
      transactionHash
      value
    }
  }
`

const GET_SELL_ORDERS_QUERY = gql`
  query getSellOrders($address: String) {
    sellOrders(where: { seller: $address, claimed: false }) {
      id
      batchId
      collateral
      transactionHash
      value
    }
  }
`

export default function OrdersTable({ type }) {
  const { account, ethereum } = useWallet()
  const toast = useToast()
  const claimOrder = useClaimOrder()

  const { data, loading, error } = useQuery(
    type === BUY_ORDER ? GET_BUY_ORDERS_QUERY : GET_SELL_ORDERS_QUERY,
    {
      variables: {
        address: !account ? '0x' : account,
      },
      pollInterval: POLL_INTERVAL_MS,
    },
  )

  const handleClaim = useCallback(
    async (batchId, collateral) => {
      // do stuff here.
      if (!ethereum) {
        return
      }
      try {
        const tx = await claimOrder(type, batchId, collateral)
        toast('Transaction sent succesfully!')
        await tx.wait()
        toast('Transaction mined succesfully!')
      } catch (err) {
        // do something with err, hopefully sentry
        console.log(err)
        toast('Something went wrong or you declined the transaction.')
      }
    },
    [claimOrder, ethereum, toast, type],
  )

  if (loading) {
    return <h2>loading...</h2>
  }

  if (error) {
    return (
      <Info mode="error">
        {' '}
        An error has ocurred. Please reload the window.{' '}
      </Info>
    )
  }

  let orders
  if (type === BUY_ORDER) {
    orders = data.buyOrders
  } else {
    orders = data.sellOrders
  }

  return (
    <DataView
      fields={ORDER_FIELDS}
      entries={orders}
      renderEntry={data => {
        return [
          <Link
            href={`https://etherscan.io/tx/${data.transactionHash}`}
            external
            key={data.transactionHash}
          >
            {shortenAddress(data.transactionHash)}
          </Link>,
          <p key={data.batchId}>{data.batchId}</p>,
          <p key={data.batchId}>{`${formatUnits(data.value, {
            truncateToDecimalPlace: 4,
          })} ${type === BUY_ORDER ? 'ANT' : 'ANJ'}`}</p>,
        ]
      }}
      renderEntryActions={({ batchId, collateral }) => {
        return (
          <Button
            onClick={() => handleClaim(batchId, collateral)}
            label="Claim order"
            mode="strong"
          >
            Claim order
          </Button>
        )
      }}
    />
  )
}

OrdersTable.propTypes = {
  type: PropTypes.symbol,
}
