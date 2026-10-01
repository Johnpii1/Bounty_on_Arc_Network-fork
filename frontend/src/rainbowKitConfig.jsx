import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { supportedChains } from "./rainbowChains";

// Environment Variables
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Arc bounty contract Address
export const CONTRACT_ADDRESS = "0x498482e334269a10d0621D3AC5e726734B01DDCe";

// RainbowKit Configuration
export default getDefaultConfig({
  appName: "Fresh Bounty",
  projectId: projectId,
  chains: supportedChains,
});
