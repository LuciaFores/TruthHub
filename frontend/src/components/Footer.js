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
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xbC82d0C512E7Ae6BcCdC5cC71d6AeFABD1ba49d2#code">TruthHub</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xa650238d8189139C2dA3013eB4F9e273D0605C2e#code">VeriToken</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xae3aA6F03497A8c71C6C2Adc7232b1Db39e26999#code">ArticleNFT</a>
                </nav> 
                <nav>
                    <header className="footer-title">Demo Contract Clear Code</header> 
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0x7922157191d5a665dE92A899985B14eB67511dcC#code">TruthHub</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0xF945Bf08F91CC3F56C71cA6CC32AcA49F6A4F5a5#code">VeriToken</a>
                    <a className="link link-hover" href="https://sepolia.etherscan.io/address/0x659401ED0C0841f1E0460cA4b77bc51CfE466ea1#code">ArticleNFT</a>
                </nav>
            </footer>
        </div>
    );
}