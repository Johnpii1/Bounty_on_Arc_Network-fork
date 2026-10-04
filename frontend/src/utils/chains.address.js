export const CHAIN_IDS = {
  ARC: 5042002,
  ARC_MAINNET: 5042,
};

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.ARC]: {
    bounty: "0x498482e334269a10d0621D3AC5e726734B01DDCe",
  },
};

export const NATIVE_TOKENS = {
  [CHAIN_IDS.ARC]: {
    symbol: "USDC",
    decimals: 18,
  },
};


/**
 * Resolve the bounty contract address for a chain.
 * Accepts number or string; returns undefined if not deployed.
 */
export const getBountyContract = (chainId) => {
  if (chainId == null) return undefined;
  const normalized = Number(chainId);
  if (!Number.isFinite(normalized)) return undefined;
  return CONTRACT_ADDRESSES[normalized]?.bounty;
};

/**
 * Resolve the native token config for a chain.
 */
export const getNativeToken = (chainId) => {
  if (chainId == null) return undefined;
  const normalized = Number(chainId);
  if (!Number.isFinite(normalized)) return undefined;
  return NATIVE_TOKENS[normalized];
};
