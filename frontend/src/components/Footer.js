import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

export default function Footer(){
    return(
        <div>
            <footer className="footer p-10 bg-base-300 text-base-content mt-auto">
                <aside>
                    <p>Made with <FontAwesomeIcon icon={faHeart} /> by Weidong Cai, Lucia Fores and Elena Jiang</p>
                </aside>
                <nav>
                    <header className="footer-title">Contract Clear Code</header> 
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xbCbB612746AcbD35EA9762465d3406e64D8268c6#code">TruthHub</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xf7026BF58464683F5e56D51Be02664D832662a4f#code">VeriToken</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0x6eAB4fB9aB67F74800Be8DF15f08982889Bcdb32#code">ArticleNFT</a>
                </nav> 
                <nav>
                    <header className="footer-title">Demo Contract Clear Code</header> 
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xbCbB612746AcbD35EA9762465d3406e64D8268c6#code">TruthHub</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xf7026BF58464683F5e56D51Be02664D832662a4f#code">VeriToken</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0x6eAB4fB9aB67F74800Be8DF15f08982889Bcdb32#code">ArticleNFT</a>
                </nav>
            </footer>
        </div>
    );
}