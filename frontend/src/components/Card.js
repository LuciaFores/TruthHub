export default function Card({src, title, description, button_text, link}){
    return(
        <div className="card w-96 bg-purple-500 shadow-xl card-bordered">
            <figure><img src={src} className="pt-4 w-72 h-72"/></figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    {/* da modificare con il bottone specifico di routing verso la pagina specifica */}
                    <a href={link}>
                        <button className="btn btn-primary">{button_text}</button>
                    </a>
                </div>
            </div>
        </div>
    );
}