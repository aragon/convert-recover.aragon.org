import marketMakerAbi from './abi/MarketMaker.json'
import tokenAbi from './abi/token.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      MARKET_MAKER: '0x5D9DbF55aF65498FaA84BDD4dDe37f7F3f8c7af1',
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['MARKET_MAKER', marketMakerAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get('1') || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
