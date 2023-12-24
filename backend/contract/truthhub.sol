// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// --- ATTORI E FUNZIONI ---

// READER
//  Attributi
//      - address ethereum
//      - amount di veri (token per le votazioni)
//      - amount di repu (token per calcolare la reputazione)
//      Il problema nell'utilizzo di questo secondo token è il fatto che non dovrebbe essere spendibile
//      ma solo utilizzato per calcolare la reputazione. Non credo sia ottimizzata una cosa del genere
//      soprattutto considerando che vogliamo mettere la possibilità di vendere i token come reward per chi vota
//      Si potrebbero mettere in vendita quelli per la votazione (a patto che si abbia una certa reputazione, stessa
//      cosa per lo sblocco di funzionalità per gli autori)
//      Il problema principale nel loro utilizzo è, oltre all'ottimizzazione, il fatto che se il calcolo della reputazione si basa
//      su un token che può essere venduto, allora non si capisce più se la diminuizione del token è dovuta ad un abbassamento della reputazione
//      oppure ad uno scambio con il contract (che paradossalmente significa proprio che si ha una reputazione abbastanza alta da poter recuperare
//      reward per il proprio comportamento)
//      - nft che si possiedono (forse)
//  Funzioni
//      - get_veri
//      - buy_veri (anche se secondo me sarebbe meglio darne una quatità all'inizio
//        e poi farne guadagnare altri tramite votazioni "corrette" nel senso che
//        vengono dati come reward a tutti i reader che ad esempio hanno upvotato un
//        articolo che poi è stato upvotato da altri e downvotato un articolo che era fake news oppure che hanno fatto
//        report di un autore che andava realmente reportato)
//      - get_reputation
//      - get_nft (forse)
//      - express_vote
//      - read_article (che non credo vada messa qui, si tratta di fare
//        una richiesta al nodo nostr)
//      - report_author
//      - get_reward (funzione che permette ai reader di scambiare i token -quali?- per ethereum, altro meccanismo di
//        incentivo a votare correttamente)
//      - check_author_reliability (dovrebbe essere una semplice view)
//      - check_article_reliability (come sopra)

// AUTHOR
//  Attributi
//      - address ethereum
//      - address nostr
//      *** Come si gestisce il fatto che un autore è anche un reader? Posso fare ereditarietà? ***
//      - amount di veri (token per le votazioni)
//      - amount di repu (token per calcolare la reputazione)
//      *** Fine degli attributi in comune ***
//      - id degli articoli scritti (sarebbe un array, non penso valga la pena, tanto vale creare la struttura dati Articolo
//        e mettere un mapping che mappa l'id dell'articolo con le info sull'articolo compreso l'autore)
//      - nft creati
//  Funzioni
//      *** Funzioni teoricamente ereditate dal reader ***
//      - get_veri
//      - buy_veri (stesso discorso di prima)
//      - get_reputation
//      - get_nft (forse)
//      - express_vote
//      - read_article
//      - report_author
//      - check_author_reliability
//      - check_article_reliability
//      *** Fine funzioni ereditate ***
//      - open_vote
//      - link_to_nostr (non andrebbe propriamente messa qui, o meglio, la prova crittografica viene fatta off chain ma
//        qui servirebbe comunque per inserire l'autore nella lista degi autori, nel senso nel mapping che mappa l'address ethereum
//        con l'address nostr -credo-)
//      - create_nft
//      - get_reward (qui la reward non comporta solo lo scambio di token per ethereum ma anche la possibilità di sbloccare funzionalità
//        come ad esempio la possibilità di creare nft e la possibilità di ridurre il costo per l'apertura di una votazione)

// ARTICLE
//  Attributi
//      - id nostr
//      - autore (nel senso che vorrei proprio mappare l'id dell'articolo a tutte le informazioni sull'autore)
//      - numero di upvote
//      - numero di downvote
//      - numero di copie di nft acquistabili
