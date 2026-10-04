// chains.js
const { arcTestnet } = require("viem/chains");
const { createPublicClient, http } = require("viem");

// const arcTestnet = {
//   id: 5042002,
//   name: "Arc Testnet",
//   nativeCurrency: {
//     name: "USDC",
//     symbol: "USDC",
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://rpc.testnet.arc.io"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Arc Explorer",
//       url: "https://explorer.testnet.arc.io",
//     },
//   },
//   testnet: true,
// };

const arcMainnet = {
  id: 5042,
  name: "Arc",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.arc.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: "https://explorer.arc.io",
    },
  },
  testnet: false,
};

const CHAINS = {
  5042002: {
    chain: arcTestnet,
  },
  5042: {
    chain: arcMainnet,
  },
};

const getPublicClient = (chainId) => {
  const normalized = Number(chainId);
  const config = CHAINS[normalized];

  if (!config) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }

  return createPublicClient({
    chain: config.chain,
    transport: http(config.rpc ?? config.chain.rpcUrls.default.http[0]),
  });
};

module.exports = { CHAINS, getPublicClient };
