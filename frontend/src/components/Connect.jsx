import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { FiChevronDown, FiLogOut, FiRadio } from "react-icons/fi";
import { useDisconnect } from "wagmi";

function Connect() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { disconnect } = useDisconnect();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <>
            <div className="hidden md:block">
              <ConnectButton
                accountStatus="full"
                showBalance
              />
            </div>

            <div className="relative md:hidden">
              {!connected ? (
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="rounded-full bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#161616] transition-colors hover:bg-[#e1bf52]"
                >
                  Connect
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
                    aria-label="Open wallet menu"
                    aria-expanded={mobileMenuOpen}
                    className="flex h-10 max-w-[112px] items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a]/80 px-2 text-white shadow-sm transition-colors hover:border-[#D4AF37]/45"
                  >
                    {account.ensAvatar ? (
                      <img
                        src={account.ensAvatar}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-black text-[#161616]">
                        {account.displayName.slice(2, 3).toUpperCase()}
                      </span>
                    )}
                    <span className="truncate text-xs font-bold">
                      {account.displayName}
                    </span>
                    <FiChevronDown
                      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                        mobileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 top-full z-50 mt-2 w-[min(260px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-200 ${
                      mobileMenuOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openChainModal();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <FiRadio className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                      <span className="flex-1">Network</span>
                      <span className="max-w-[110px] truncate text-xs font-medium text-white/55">
                        {chain.name}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        disconnect();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#ff8d8d] transition-colors hover:bg-[#ff6262]/10"
                    >
                      <FiLogOut className="h-4 w-4 shrink-0" />
                      Disconnect
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAccountModal();
                      }}
                      className="w-full rounded-xl px-3 py-2 text-xs font-semibold text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      View account
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
export default Connect;
