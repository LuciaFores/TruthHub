import MetaMaskButton from "./MetaMaskButton";
import navbar_icon from "../images/navbar_icon.png";

export default function Navbar() {
    return(
        <div className="navbar bg-base-100 px-6 py-4 glass sticky top-0 z-40">
            <div className="flex-1">
                <a href="/">
                    <button className="btn btn-ghost">
                        <img className="w-14 h-14" src={navbar_icon}/>
                        <span className="text-xl font-lexend">TruthHub</span>
                    </button>
                </a>
                <a href="register">
                    <button className="btn btn-ghost">
                        <span className="text-l font-lexend">Author Registration</span>
                    </button>
                </a>
                <a href="articles">
                    <button className="btn btn-ghost">
                        <span className="text-l font-lexend">Articles</span>
                    </button>
                </a>
                <a href="profile">
                    <button className="btn btn-ghost">
                        <span className="text-l font-lexend">User Profile</span>
                    </button>
                </a>
                <a href="publish">
                    <button className="btn btn-ghost">
                        <span className="text-l font-lexend">Publish Article</span>
                    </button>
                </a>
                <a href="nft">
                    <button className="btn btn-ghost">
                        <span className="text-l font-lexend">NFTs</span>
                    </button>
                </a>
            </div>
            <div className="flex-none">
                <MetaMaskButton/>
            </div>
        </div>
    );
}