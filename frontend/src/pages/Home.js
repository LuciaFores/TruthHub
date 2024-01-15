import placeholder from "../images/placeholder.jpeg";
import Card from "../components/Card";
import { author_src, author_title, author_description, author_button_text } from "../cards_constants/author_functionalities_card";
import { reader_src, reader_title, reader_description, reader_button_text } from "../cards_constants/reader_functionalities_card";
import { nft_src, nft_title, nft_description, nft_button_text } from "../cards_constants/nft_functionalities_card";

export default function Home() {
    return(
        <div>
            <div className="container grid grid-cols-2 mt-24 lg:mt-32 mx-20">
                <div className="grid grid-rows-2"> 
                    <p className="text-7xl lg:text-8xl font-medium">Your place to 
                        <span className="bg-gradient-to-r from-teal-300 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent"> speak freely</span> and
                        <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 bg-clip-text text-transparent"> seek truth</span>
                    </p>
                    <p className="text-xl my-10 font-light">
                        By combining the stregths of Ethereum and Nostr, TruthHub will provide a censorship resitant solution in which the community will help to idenitfy fake news.
                    </p>
                </div>
                <div className="grid mx-auto my-8">
                    <img className="mask mask-squircle w-96 h-96" src={placeholder} />
                </div>
            </div>
            <div className="my-8 mx-20">
                <p className="text-4xl font-medium">What will you be able to do?</p>
                <div className="container grid grid-cols-3 py-8">
                    <Card src={author_src} title={author_title} description={author_description} button_text={author_button_text}/>
                    <Card src={reader_src} title={reader_title} description={reader_description} button_text={reader_button_text}/>
                    <Card src={nft_src} title={nft_title} description={nft_description} button_text={nft_button_text}/>
                </div>
            </div>
            
        </div>
    );
}