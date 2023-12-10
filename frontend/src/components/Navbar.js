import MetaMaskButton from "./MetaMaskButton";
import icon from "../images/icon.png";

export default function Navbar() {
    return(
        <div className="navbar bg-base-100 px-6 py-4 glass sticky top-0 z-40">
            <div className="flex-1">
                <button className="btn btn-ghost">
                    <img className="w-8 h-8" src={icon}/>
                    <span className="text-xl font-lexend">TruthHub</span>
                </button>
            </div>
            <div className="flex-none">
                <MetaMaskButton/>
            </div>
        </div>
    );
}