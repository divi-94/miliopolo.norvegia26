# Piano di esecuzione

Questa è la roadmap persistente. Spunta un elemento solo dopo avere eseguito il gate indicato e annotato l'evidenza in `STATUS.md`.

## P0 - Bootstrap e fondamenta

- [x] Inizializzare Astro statico con TypeScript strict e pnpm.
- [x] Configurare `site`/`base` senza hardcode fragile.
- [x] Creare gli script `validate`, `typecheck`, `test`, `build`, `test:e2e`, `check`.
- [x] Definire Content Collections e validazione incrociata di date/slug.
- [x] Aggiungere struttura CSS mobile-first e layout base accessibile.

**Gate:** installazione riproducibile da lockfile, pagina minima renderizzata e `pnpm check` verde.

## P1 - Migrazione delle 15 giornate

- [x] Importare una giornata campione e validarne la struttura.
- [x] Migrare tutte le date dal 9 al 23 agosto dal documento finale.
- [x] Separare Bergen in 21 e 22 agosto senza duplicazioni incoerenti.
- [x] Rimuovere codici di prenotazione e dati sensibili.
- [x] Verificare fedeltà al documento finale e assenza di contenuti dai tavoli superati.

**Gate:** esattamente 15 date valide, nessun riferimento rotto, controllo privacy verde e `pnpm check` verde.

## P2 - Home e navigazione temporale

- [x] Implementare testata, avanzamento e lista cronologica a schede.
- [x] Implementare badge guida, trekking, stato e TODO.
- [x] Implementare passato/oggi/futuro in `Europe/Oslo`.
- [x] Gestire prima e dopo il viaggio e il parametro di test della data.
- [x] Implementare barra mobile Viaggio/Oggi/Curiosità.

**Gate:** test unitari delle date e dei badge, test mobile della home e `pnpm check` verde.

## P3 - Dettaglio giorno, luoghi e azioni

- [x] Implementare dettaglio con sezioni condizionali nell'ordine richiesto.
- [x] Implementare checklist in sola lettura e conteggio TODO.
- [x] Modellare luoghi e relazioni con le giornate.
- [x] Rendere luoghi, mappe, siti, tracce, telefono ed email azionabili.
- [x] Implementare precedente/successivo e collegamenti interni base-aware.

**Gate:** nessun link/slug rotto, test delle rotte principali e controllo visuale mobile verde.

## P4 - Curiosità

- [x] Estrarre integralmente le storie dal PDF secondo l'inventario della specifica.
- [x] Conservare distinzione fra storia, fatto e leggenda.
- [x] Collegare ogni curiosità ad almeno un luogo e una giornata.
- [x] Implementare indice per luogo, filtro per giornata e pagine di dettaglio.
- [x] Collegare curiosità pertinenti dalle pagine giorno e luogo.

**Gate:** inventario completo, relazioni valide, testi leggibili su mobile e `pnpm check` verde.

## P5 - Editing da telefono

- [x] Implementare modalità editor non invasiva.
- [x] Generare link esatti all'editor GitHub per ogni giornata.
- [x] Mostrare ultimo aggiornamento e hash breve build quando disponibile.
- [x] Documentare flusso commit → Actions → Pages senza promettere immediatezza.

**Gate:** URL di modifica verificati in configurazione e nessun token/segreto lato client.

## P6 - PWA e offline

- [x] Creare manifest e icone locali.
- [x] Implementare caching dei contenuti editoriali e degli asset versionati.
- [x] Implementare stato offline e aggiornamento disponibile.
- [x] Verificare manifest/service worker sotto il base path.

**Gate:** contenuti essenziali riapribili offline dopo la prima visita e aggiornamento non bloccante.

## P7 - Meteo

- [x] Definire punti meteo verificati e punto primario per giornata pertinente.
- [x] Implementare client Open-Meteo, mapping codici e attribuzione.
- [x] Implementare home oggi+2, dettaglio, cache e timestamp.
- [x] Gestire fuori finestra, offline, errore API e dati vecchi.
- [x] Inserire disclaimer e link ufficiali per escursioni sensibili.

**Gate:** test unitari del mapping, errori di rete gestiti e nessun blocco del contenuto statico.

## P8 - CI, QA e consegna

- [ ] Creare workflow GitHub Pages con test prima del deploy e concurrency.
- [x] Completare Playwright per home, giorno, luogo, curiosità, date simulate e no-JS.
- [x] Verificare 320, 360 e 390 px senza scroll orizzontale.
- [x] Eseguire controllo accessibilità, performance, link e console.
- [x] Autorivedere tutto il diff rispetto alla specifica.
- [ ] Compilare `FINAL_REPORT.md` e marcare il progetto completo.

**Gate finale:** `pnpm check` e `pnpm test:e2e` verdi, QA visuale documentata e tutti i criteri di accettazione soddisfatti.
