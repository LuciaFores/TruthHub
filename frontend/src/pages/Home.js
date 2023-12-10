import placeholder from "../images/placeholder.jpeg";

export default function Home() {
    return(
        <div className="container grid grid-cols-2 py-24 lg:py-32 px-20">
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
    );
}