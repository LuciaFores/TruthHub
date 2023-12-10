import MetaMaskButton from "./MetaMaskButton";

export default function Navbar() {
    return(
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <a class="btn btn-ghost text-xl">TruthHub</a>
            </div>
            <div class="flex-none">
                <MetaMaskButton/>
            </div>
        </div>
    );
}