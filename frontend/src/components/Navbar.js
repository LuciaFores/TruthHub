import MetaMaskButton from "./MetaMaskButton";

export default function Navbar() {
    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">TruthHub</a>
            </div>
            <div className="flex-none">
                <MetaMaskButton/>
            </div>
        </div>
    );
}