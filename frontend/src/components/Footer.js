import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

export default function Footer(){
    return(
        <div>
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Made with <FontAwesomeIcon icon={faHeart} /> by Weidong Cai, Lucia Fores and Elena Jiang</p>
                </aside>
            </footer>
        </div>
    );
}