# Istruzioni per l'agente - Norvegia 2026

## Missione

Implementare e verificare l'app mobile-first descritta in `../docs/specifica-app-viaggio.md` fino a quando è completa secondo i suoi criteri di accettazione, oppure fermarsi in stato `blocked` secondo le regole di questo file.

Lavora autonomamente in cicli piccoli e verificabili. Non aspettare conferme fra un ciclo e il successivo quando esiste una scelta sicura, reversibile e già coperta dalla specifica.

## Contesto obbligatorio

Prima di modificare codice, leggi nell'ordine:

1. questo file;
2. `.agent/STATUS.md`;
3. `.agent/PLAN.md`;
4. `../docs/specifica-app-viaggio.md`;
5. le sole parti delle fonti editoriali necessarie al ciclo corrente:
   - `../starting-point/FINALE_norvegia-2026.md`;
   - `../starting-point/norvegia-2026-storie.pdf`.

Consulta `.agent/DECISIONS.md` prima di cambiare una scelta architetturale già registrata.

Non usare i file in `../tavolo-di-lavoro/` come fonte del programma: possono contenere ipotesi superate.

## Ambito delle modifiche

Puoi modificare autonomamente:

- tutto ciò che si trova in questa cartella `app/`;
- `../.github/workflows/` per CI e GitHub Pages;
- documentazione strettamente necessaria a eseguire o distribuire l'app.

Non modificare i documenti in `../starting-point/`. Non aggiungere al repository pubblico codici di prenotazione, dati personali, chiavi, token o altri segreti.

Conserva le modifiche preesistenti dell'utente. Non usare `git add -A`, reset distruttivi o comandi che cancellano modifiche non tue.

## Ciclo autonomo

Ripeti senza attendere l'utente:

1. **Orientamento:** controlla stato Git, `STATUS.md`, fase attiva e dipendenze già disponibili.
2. **Scelta:** seleziona il più piccolo risultato verticale non bloccato dalla fase corrente.
3. **Piano breve:** definisci mentalmente o nel piano massimo 3-5 passi concreti; non riscrivere tutta la roadmap.
4. **Implementazione:** completa il risultato scelto senza lasciare placeholder o codice morto.
5. **Verifica mirata:** esegui test, typecheck, lint o build pertinenti alla modifica.
6. **Autorevisione:** ispeziona il diff e cerca regressioni, contenuti mancanti, link errati, problemi mobile, accessibilità e dati sensibili.
7. **Riparazione:** correggi ciò che emerge e ripeti i controlli interessati.
8. **Checkpoint:** aggiorna `.agent/STATUS.md`, spunta `PLAN.md` soltanto con evidenza verde e registra in `DECISIONS.md` solo decisioni durevoli.
9. **Prosecuzione:** passa automaticamente al risultato successivo finché il progetto è completo o si verifica una condizione di arresto.

Ogni ciclo deve produrre codice/contenuto verificabile oppure una diagnosi nuova. Non ripetere lo stesso tentativo senza cambiare ipotesi.

## Condizioni di arresto

Fermati e non improvvisare quando si verifica almeno una di queste condizioni:

- serve una decisione di prodotto che cambierebbe materialmente comportamento, contenuti o privacy;
- servono credenziali, permessi, un account o una pubblicazione esterna non già autorizzati;
- un'azione sarebbe distruttiva o coinvolgerebbe dati fuori dall'ambito;
- le fonti sono in conflitto e la scelta non è risolvibile con evidenza;
- modifiche dell'utente si sovrappongono alle tue e non possono essere preservate con sicurezza;
- la stessa causa di errore resta dopo **tre tentativi mirati**, ciascuno basato su una diversa ipotesi o correzione;
- non è possibile eseguire una verifica essenziale e non esiste un sostituto attendibile;
- il lavoro richiederebbe ampliare materialmente lo scope della specifica.

Quando ti fermi:

1. imposta `project_status: blocked` in `.agent/STATUS.md`;
2. compila `.agent/BLOCKED.md` con evidenza, tentativi, impatto e una sola domanda minima per l'utente;
3. lascia il repository in uno stato sicuro e comprensibile;
4. non continuare con workaround fragili e non dichiarare il progetto completo.

Un test rosso, da solo, non è un blocco: diagnosticalo e prova a correggerlo. La soglia dei tre tentativi vale per la stessa causa, non per tre errori diversi incontrati durante il normale sviluppo.

## Fonte di verità e contenuti

- Programma operativo iniziale: `../starting-point/FINALE_norvegia-2026.md`.
- Curiosità: `../starting-point/norvegia-2026-storie.pdf`.
- Requisiti e decisioni di prodotto: `../docs/specifica-app-viaggio.md`.
- Stato di esecuzione: `.agent/STATUS.md` e `.agent/PLAN.md`.

Dopo l'import iniziale, i file Markdown in `src/content/` sono la fonte operativa dell'app. Non creare sincronizzazione bidirezionale con i documenti sorgente.

Non inventare coordinate, URL, orari o fatti mancanti. Se un dato non essenziale non è verificabile, omettilo e annotalo nello stato; se è essenziale, applica le condizioni di arresto.

## Vincoli tecnici

- Astro statico, TypeScript strict, Content Collections e Markdown con frontmatter.
- `pnpm` con lockfile versionato.
- HTML prerenderizzato; JavaScript client-side solo dove necessario.
- Funzionamento sotto il `base path` di GitHub Pages.
- Nessun backend e nessun segreto nel browser.
- Nessun framework UI pesante senza giustificazione misurabile.
- Meteo non bloccante e senza API key privata.
- Mobile-first da 360 px; verificare anche 320 e 390 px.
- PWA/offline soltanto dopo che il nucleo editoriale funziona.

Usa versioni stabili correnti e documentazione primaria quando una API o libreria potrebbe essere cambiata. Mantieni il numero di dipendenze proporzionato a un piccolo progetto personale.

## Contratto dei comandi

La fase di bootstrap deve creare questi script in `package.json`:

- `pnpm validate`: schemi e integrità dei contenuti;
- `pnpm typecheck`: controlli TypeScript/Astro;
- `pnpm test`: test unitari;
- `pnpm build`: build di produzione;
- `pnpm test:e2e`: test browser principali;
- `pnpm check`: gate locale composto da validate, typecheck, test e build.

Durante i primi cicli esegui i controlli disponibili. Prima di chiudere una fase esegui almeno `pnpm check`. Prima di dichiarare il progetto completo esegui anche `pnpm test:e2e` e il controllo visivo mobile.

Non mascherare errori con `|| true`, skip permanenti o soglie abbassate senza una motivazione registrata.

## Controllo qualità

Per ogni modifica sostanziale verifica:

- comportamento con e senza JavaScript;
- link e slug interni;
- nessuna esposizione di dati sensibili;
- resa mobile e assenza di scroll orizzontale;
- accessibilità di navigazione, focus, badge e contrasto;
- fallback offline e meteo quando pertinenti;
- nessun errore console nelle rotte toccate.

Quando l'ambiente consente un browser, usa screenshot o ispezione reale delle pagine principali. Non considerare una build verde equivalente a una UI verificata.

## Git e azioni esterne

- Sono ammessi commit **locali** soltanto se il prompt di avvio li autorizza.
- Un commit di checkpoint richiede gate verde e deve includere file esplicitamente selezionati.
- Non includere automaticamente `../starting-point/` nei commit.
- Non fare push, non abilitare GitHub Pages, non pubblicare e non creare pull request senza autorizzazione esplicita.
- Non introdurre token GitHub per rendere modificabili le checkbox dal sito.

## Definizione di completamento

Il progetto è completo solo quando:

1. tutti gli elementi P0-P8 di `.agent/PLAN.md` sono spuntati con evidenza;
2. i criteri di accettazione della specifica sono soddisfatti;
3. `pnpm check` e `pnpm test:e2e` sono verdi;
4. la UI è stata ispezionata alle larghezze richieste;
5. il diff finale è stato autorivisto;
6. `.agent/FINAL_REPORT.md` contiene cosa è stato fatto, verifiche, limiti residui e istruzioni di pubblicazione;
7. `project_status` in `.agent/STATUS.md` è `complete`.

Non usare “quasi completo”, test non eseguiti o feature simulate come equivalenti.

