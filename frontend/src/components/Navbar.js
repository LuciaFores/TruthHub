import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar({ updateWalletData }) {
    return(
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <a class="btn btn-ghost text-xl">TruthHub</a>
            </div>
            <div class="flex-none">
                <ConnectWalletButton updateWalletData={updateWalletData}/>
            </div>
        </div>
    );
}