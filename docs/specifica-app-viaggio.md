# Norvegia 2026 - specifica funzionale e tecnica dell'app

**Stato:** handoff pronto per l'implementazione  
**Data della specifica:** 8 agosto 2026  
**Destinazione:** sito statico mobile-first pubblicato con GitHub Pages  
**Pubblico:** il gruppo di sette persone durante il viaggio  
**Lingua:** italiano

## 1. Mandato per l'agente che implementerà

Realizzare un'app web statica, estremamente comoda da telefono, che aiuti il gruppo a capire in pochi secondi:

1. cosa succede oggi;
2. dove si va e quanto sono impegnativi guida e trekking;
3. quali decisioni o attività sono ancora aperte;
4. quali link servono sul posto;
5. quali storie e curiosità riguardano i luoghi attraversati;
6. quale meteo è previsto, senza trattarlo come una valutazione di sicurezza.

L'app non deve sembrare la versione web di un documento lungo. Deve essere un cruscotto operativo da viaggio, leggibile con una mano e con connessione debole.

L'implementazione deve essere completa, verificata e pronta per GitHub Pages. Non lasciare mock, placeholder, rotte vuote o funzionalità dichiarate ma non collegate.

## 2. Fonti e regole di precedenza

### 2.1 Fonti editoriali ammesse

- Programma, decisioni, orari, spostamenti e note operative: `starting-point/FINALE_norvegia-2026.md`.
- Storie e curiosità: `starting-point/norvegia-2026-storie.pdf`.
- Questa specifica definisce struttura, comportamento e architettura dell'app.

I file precedenti in `tavolo-di-lavoro/` non sono fonti del contenuto del viaggio e non devono reintrodurre programmi superati.

### 2.2 Migrazione iniziale e fonte di verità successiva

`FINALE_norvegia-2026.md` è la fonte editoriale dell'import iniziale. Durante l'implementazione il contenuto deve essere suddiviso, senza reinterpretarlo, in piccoli file Markdown per giornata.

Dopo questa migrazione:

- i file Markdown dell'app diventano la fonte operativa pubblicata;
- il documento finale resta il riferimento storico da cui l'import è partito;
- gli aggiornamenti fatti durante il viaggio si applicano ai file giornalieri, senza dover modificare il documento monolitico;
- non è richiesto un sincronismo bidirezionale con il documento finale.

Ogni correzione editoriale introdotta durante la migrazione deve essere minima e tracciabile. Non inventare orari, coordinate, prenotazioni o decisioni mancanti.

### 2.3 Privacy

Assumere che repository e GitHub Pages possano essere pubblici. Non inserire nei contenuti dell'app:

- codici di prenotazione;
- nominativi, telefoni personali o documenti;
- dati di pagamento;
- indirizzi privati non necessari;
- segreti o chiavi API.

In particolare, il riferimento della prenotazione Galdhøpiggen presente nel documento sorgente non deve finire né nel sito né nei file versionati dell'app. I link commerciali e gli indirizzi pubblici delle strutture sono ammessi.

## 3. Obiettivi di prodotto

### 3.1 Obiettivi primari

- Dare priorità automatica alla giornata corrente.
- Rendere confrontabili le giornate tramite schede e badge.
- Mostrare il dettaglio operativo senza perdere il testo utile del documento finale.
- Rendere immediatamente azionabili navigazione, prenotazioni, parcheggi, telefonate e siti esterni.
- Evidenziare attività aperte e verifiche ancora da chiudere.
- Collegare programma, luoghi e curiosità.
- Consentire aggiornamenti rapidi da telefono tramite Markdown e GitHub.
- Continuare a offrire i contenuti essenziali dopo una prima visita anche con rete assente o instabile.

### 3.2 Non-obiettivi

- Non è un social network né una chat di gruppo.
- Non gestisce pagamenti o prenotazioni.
- Non sostituisce mappe, Wikiloc, siti ufficiali o bollettini di sicurezza.
- Non decide automaticamente se effettuare un trekking.
- Non richiede account all'utente che consulta il sito.
- Non include un CMS con autenticazione dentro al sito nella prima versione.
- Non deve riprodurre il PDF delle curiosità come PDF incorporato: il contenuto va trasformato in pagine web.

## 4. Utenti e scenari principali

### Consultazione rapida

Una persona apre il sito in macchina o appena sveglia e deve vedere subito la scheda di oggi, l'orario di partenza, il percorso, gli alert e i link principali.

### Pianificazione della sera precedente

Il gruppo apre la giornata successiva, controlla meteo, attività da chiudere, attrezzatura e piano B.

### Aggiornamento sul posto

Una persona autorizzata apre il file Markdown della giornata su GitHub dal telefono, cambia programma o checklist e fa commit su `main`. La build valida i dati e pubblica automaticamente il nuovo sito. Se la build fallisce, la versione precedente deve restare online.

### Lettura durante i tempi morti

Una persona apre Curiosità, sceglie un luogo oppure segue il collegamento dalla giornata e legge una storia breve pertinente.

## 5. Architettura dell'informazione

### 5.1 Rotte minime

- `/`: home con tutte le giornate.
- `/giorni/<data>/`: dettaglio di una singola giornata.
- `/curiosita/`: indice delle curiosità raggruppate per area o luogo.
- `/curiosita/<slug>/`: dettaglio di una storia.
- `/luoghi/<slug>/`: luogo con giorni collegati, curiosità e azioni esterne.
- `/info/`: uso dell'app, significato dei badge, fonte meteo, ultimo aggiornamento e disclaimer.
- `404.html`: pagina di errore coerente e con ritorno alla home.

Usare URL statici, stabili e compatibili con il sottopercorso di un project site GitHub Pages.

### 5.2 Navigazione mobile

Usare una barra inferiore compatta con tre destinazioni:

- **Viaggio**: home;
- **Oggi**: apre la giornata corrente o, fuori dalle date del viaggio, la giornata più sensata secondo le regole del paragrafo 7;
- **Curiosità**: indice narrativo.

Nel dettaglio giorno inserire anche navigazione precedente/successivo. Il comando indietro del browser deve funzionare normalmente.

## 6. Home page

### 6.1 Testata

La testata deve mostrare:

- nome del viaggio;
- intervallo `9-23 agosto 2026`;
- indicatore sintetico di avanzamento, per esempio `Giorno 5 di 15`;
- scorciatoia evidente alla giornata corrente;
- stato offline quando applicabile.

Evitare hero fotografiche pesanti: il primo contenuto utile deve comparire subito.

### 6.2 Elenco a schede

Mostrare **15 schede separate**, una per ogni data dal 9 al 23 agosto. Anche Bergen, accorpata nel documento finale, deve diventare due giornate distinte, 21 e 22 agosto, senza duplicare inutilmente il testo condiviso.

La sensazione visiva desiderata è quella di una lista “tipo fantacalcio”: densa ma leggibile, con identità forte, gerarchia chiara e una riga di indicatori immediati.

Ogni scheda contiene almeno:

- numero del giorno, giorno della settimana e data;
- titolo breve;
- sottotitolo con lo spostamento, per esempio `Oslo → Bessheim`;
- base o pernottamento;
- badge guida;
- badge trekking;
- stato della giornata;
- numero di attività aperte, solo se maggiore di zero;
- badge meteo quando disponibile;
- affordance evidente per aprire il dettaglio.

### 6.3 Stati temporali

Calcolare la data in `Europe/Oslo`, non affidarsi implicitamente al fuso del dispositivo.

- Giornata passata: visivamente attenuata ma sempre leggibile e cliccabile.
- Oggi: massima evidenza, bordo/colore dedicato e posizione facilmente raggiungibile.
- Giornata futura: aspetto normale.
- Prima del 9 agosto: nessuna giornata passata; mostrare il conto alla rovescia e mettere in evidenza il 9 agosto.
- Dopo il 23 agosto: tutte le giornate passate; mostrare una modalità ricordo/viaggio concluso senza rendere il sito inutilizzabile.

All'apertura della home durante il viaggio, portare la scheda di oggi nella parte visibile della pagina senza produrre salti fastidiosi. Non riordinare cronologicamente le schede.

Prevedere un parametro di sviluppo, per esempio `?date=2026-08-17`, utilizzabile solo per testare gli stati temporali. Non mostrarlo nell'interfaccia normale.

### 6.4 Badge

I badge non devono affidarsi soltanto al colore: icona, testo breve e `aria-label` devono comunicare lo stesso significato.

#### Guida

Il contenuto memorizza i minuti di guida stimati; il livello visuale è derivato:

- `0`: fino a 30 minuti complessivi;
- `poca`: 31-120 minuti;
- `media`: 121-240 minuti;
- `molta`: oltre 240 minuti.

Mostrare quando possibile anche il tempo, per esempio `Auto 3h 45m`, non soltanto l'icona.

#### Trekking

Il contenuto memorizza durata, distanza e dislivello quando disponibili. La scheda mostra una sintesi, per esempio `Scarponi 7h · 1.830 m+`. Il livello deve essere derivato con una funzione centralizzata e documentata, tenendo conto almeno di durata e dislivello. In assenza di dati, mostrare `variabile` oppure omettere il badge; non inventare uno zero.

#### Stato

Valori ammessi:

- `confermato`;
- `aperto`;
- `da-verificare`;
- `problema`.

#### Attività aperte

Contare le checkbox Markdown non selezionate della giornata. Mostrare il badge soltanto con conteggio positivo, per esempio `3 da chiudere`.

#### Cultura

Non fa parte della prima versione. L'architettura dei badge deve però permettere di aggiungere in seguito nuove categorie senza ridisegnare la scheda.

## 7. Dettaglio della giornata

La pagina deve privilegiare questo ordine:

1. titolo, data, tragitto e stato;
2. alert ad alta priorità;
3. riepilogo con guida, trekking, base e meteo;
4. programma/timeline;
5. attività da chiudere;
6. piano B e condizioni che lo attivano;
7. note operative e attrezzatura;
8. luoghi collegati;
9. link utili;
10. curiosità pertinenti.

Le sezioni prive di contenuto non devono essere renderizzate.

### 7.1 Luoghi cliccabili

Ogni attività strutturata può riferirsi a un luogo tramite uno slug. Nome e chip del luogo devono aprire `/luoghi/<slug>/`.

La pagina luogo aggrega:

- nome e area;
- coordinate e pulsante `Apri nelle mappe`;
- giornate che lo includono;
- curiosità associate;
- eventuali link ufficiali.

Nel testo Markdown sono ammessi normali collegamenti interni. Non introdurre una sintassi proprietaria difficile da modificare da telefono.

### 7.2 Link azionabili

Distinguere visivamente almeno:

- navigazione/mappe;
- sito ufficiale o prenotazione;
- traccia escursionistica;
- telefono (`tel:`);
- email (`mailto:`).

I link esterni devono aprirsi in modo sicuro. Rendere evidente quando richiedono connessione. Non nascondere l'URL dietro azioni JavaScript irreversibili.

### 7.3 Checklist

Le checklist sono scritte come normali task Markdown:

```md
## Da chiudere

- [ ] Prenotare il bus P1 → P2
- [x] Preparare il pranzo al sacco
```

Nel sito sono inizialmente in sola lettura. Il click su una checkbox non deve fingere un salvataggio condiviso. Il comando `Modifica questa giornata` porta al file corretto nell'editor web di GitHub.

Un eventuale completamento locale tramite `localStorage` è fuori dall'MVP: rischia di mostrare stati diversi ai membri del gruppo.

## 8. Curiosità e luoghi

### 8.1 Modello narrativo

Ogni curiosità è un file Markdown autonomo, con:

- titolo;
- slug stabile;
- uno o più luoghi associati;
- una o più giornate associate;
- tipo `storia`, `fatto` o `leggenda`;
- breve estratto opzionale;
- corpo Markdown.

Il tipo `leggenda` deve essere mostrato chiaramente quando il PDF la presenta come tale. Non trasformare aneddoti dichiarati incerti in fatti.

### 8.2 Indice

L'indice Curiosità deve poter essere consultato:

- per area/luogo;
- per giornata;
- tramite ricerca testuale client-side semplice, se implementabile senza appesantire sensibilmente il bundle.

La visualizzazione predefinita è per luogo, come richiesto. Le schede mostrano titolo, luogo, tipo e tempo di lettura indicativo.

### 8.3 Inventario minimo da importare

Il PDF contiene 15 pagine e copre tutto il viaggio. L'import deve includere, senza omissioni, le seguenti sezioni narrative:

| Giorno | Area | Storie presenti |
|---|---|---|
| 1 | Oslo | Vigeland; Opera; Linie aquavit; Akershus |
| 2 | MUNCH e Jotunheimen | furti dell'Urlo; casa dei giganti; colore del Gjende; Peer Gynt e Besseggen |
| 3 | Galdhøpiggen | primato con Glittertind; prima salita; Styggebrean/Juvasshytta |
| 4 | Skåla e Fjærland | sanatorio dello Skåla; disastri del Lovatnet; città dei libri |
| 5 | Aurlandsdalen | Lærdalstunnelen; antica via di Aurlandsdalen; Undredal; Flåmsbana |
| 6 | Nærøyfjord | Njord e il fiordo; Stalheimskleiva; Gudvangen/Njardarheimr; leggenda di Tvindefossen |
| 7 | Hardanger | Fossli Hotel e Grieg; ponte del Vøringsfossen; frutteti e sidro; Hardingfele |
| 8 | Folgefonna e Odda | Isvegen e commercio del ghiaccio; Folgefonntunnelen; Odda/Ragnarok; Låtefossen |
| 9 | Trolltunga | Mågelibanen; crescita dei visitatori; formazione della lingua; Ringedalsdammen |
| 10 | Hardangervidda | Hoth; operazione Gunnerside; Amundsen; renne selvatiche |
| 11 | Ryfylke | leggenda di Skomakarnibbå; lord del salmone; strada di Sauda |
| 12 | Preikestolen | Hyvlatonnå; la crepa; Lysefjord/Flørli/Mission Impossible |
| 13-14 | Bergen | Lega Anseatica; incendi; pioggia; sette monti; black metal; Grieg e museo della lebbra |
| 15 | Ritorno | epilogo del viaggio |

Conservare il tono narrativo italiano del PDF. Non riassumere aggressivamente i testi: su mobile si possono presentare in schede o sezioni espandibili, ma il contenuto deve restare disponibile integralmente.

## 9. Aggiornamento da telefono e pubblicazione

### 9.1 Flusso scelto per la prima versione

Non costruire un CMS custom. Usare il file editor web di GitHub:

1. dall'app, l'autore attiva una modalità editor tramite `?edit=1` oppure un'impostazione locale;
2. compare `Modifica questa giornata`;
3. il link apre direttamente il corrispondente file Markdown su GitHub in modalità modifica;
4. l'autore modifica e fa commit direttamente su `main`;
5. GitHub Actions esegue validazione, build e deploy;
6. se la validazione fallisce, la pubblicazione non sostituisce l'ultima versione funzionante.

Il repository deve consentire ai soli membri autorizzati di scrivere. Per mantenere il flusso rapido durante il viaggio, evitare una protezione di `main` che impedisca l'editing web diretto, a meno che il gruppo preferisca esplicitamente le pull request.

GitHub supporta la modifica diretta dei file dal browser e il commit dall'editor web. GitHub Mobile è utile per consultare repository e pull request, ma il percorso più prevedibile per modificare un normale file resta il browser mobile.

### 9.2 Sicurezza editoriale

- Validare tutti i frontmatter in fase di build.
- Fallire la build con messaggio leggibile se data, slug o riferimenti a luoghi non sono validi.
- Verificare duplicati di slug e date.
- Verificare che tutte le 15 date esistano.
- Verificare link interni e relazioni giorno-luogo-curiosità.
- Non pubblicare mai direttamente dal browser tramite token GitHub incorporato.
- Mostrare nell'app data/ora dell'ultima build e, se disponibile a build time, hash breve del commit.
- Inserire nell'Info un link alla pagina Actions del repository per controllare lo stato del deploy.

### 9.3 Tempi attesi

Il requisito non è un deploy istantaneo: dopo il commit l'interfaccia deve spiegare che l'aggiornamento richiede normalmente il tempo della GitHub Action. Non mostrare una conferma `pubblicato` prima che il nuovo build sia effettivamente quello servito.

## 10. Meteo - funzionalità bonus da implementare dopo il nucleo

### 10.1 Servizio raccomandato

Usare Open-Meteo dal browser:

- non richiede API key per uso non commerciale;
- espone JSON tramite richieste GET;
- offre previsioni fino a 16 giorni;
- consente più coordinate nella stessa richiesta;
- richiede attribuzione;
- il piano gratuito non offre garanzia di disponibilità.

Non inserire provider che richiedano una chiave privata in un sito statico: qualsiasi segreto incluso nel JavaScript sarebbe pubblico.

### 10.2 Dati

Ogni giornata può definire uno o più punti meteo con coordinate e quota. Uno è marcato `primary` per il badge della home; nel dettaglio si possono distinguere base, punto di partenza e meta montana.

Richiedere soltanto dati utili, per esempio:

- codice meteo;
- temperatura minima e massima;
- probabilità massima di precipitazione;
- quantità di precipitazione;
- vento e raffiche massime;
- alba e tramonto;
- dati orari essenziali nel dettaglio della giornata.

Usare `timezone=Europe/Oslo`. Non usare la geolocalizzazione del telefono: il meteo deve riferirsi alla destinazione della giornata, non alla posizione momentanea dell'utente.

### 10.3 Comportamento

- Home: caricare in una singola richiesta, quando possibile, il punto primario di oggi e dei prossimi due giorni.
- Dettaglio: caricare i punti definiti per quella giornata.
- Cache in `localStorage` con timestamp; TTL indicativo 30 minuti.
- In assenza di rete mostrare l'ultima risposta disponibile con etichetta `aggiornato alle …` e `dato non aggiornato`.
- Se non esiste una previsione per una data troppo lontana, mostrare `non ancora disponibile`.
- Se l'API fallisce, il resto della pagina deve continuare a funzionare senza spazi vuoti o errori JavaScript.
- Mappare i codici meteo in un unico modulo testato.
- Attribuire chiaramente Open-Meteo nella pagina Info e vicino al dettaglio.

### 10.4 Limite di responsabilità

Il meteo è informativo. Per Galdhøpiggen, Skåla, Trolltunga, Skomakarnibbå, Preikestolen e Vidden mostrare un richiamo ai bollettini/fonti ufficiali quando presenti. Non attivare automaticamente il piano B e non mostrare etichette come `sicuro` o `vai`.

## 11. Offline e PWA

L'uso con connettività intermittente è un requisito importante.

- Generare pagine statiche prerenderizzate per tutti i giorni, luoghi e curiosità.
- Rendere il sito installabile come PWA con manifest, nome, icone e colore tema.
- Precaricare app shell e contenuti editoriali essenziali.
- Usare strategia network-first con fallback in cache per HTML, così gli aggiornamenti arrivano quando c'è rete.
- Usare cache-first per asset versionati.
- Conservare l'ultima risposta meteo separatamente con timestamp.
- Mostrare chiaramente lo stato offline.
- Non garantire l'apertura offline dei link esterni.
- Gestire correttamente il `base path` GitHub Pages anche per manifest e service worker.

Un aggiornamento del service worker non deve lasciare l'utente bloccato su una versione vecchia senza indicazione: quando una nuova versione è pronta, mostrare un comando discreto `Aggiornamento disponibile`.

## 12. Tecnologia raccomandata

### 12.1 Stack

- **Astro**, output completamente statico.
- **TypeScript** in modalità strict.
- **Astro Content Collections** con schema per giorni e curiosità.
- Markdown standard con frontmatter YAML.
- CSS nativo con custom properties; evitare un framework UI pesante.
- JavaScript client-side limitato a data corrente, meteo, modalità editor e service worker.
- `pnpm` con lockfile versionato.
- Test unitari con Vitest e test browser essenziali con Playwright.

Usare le versioni stabili correnti al momento dell'implementazione e fissarle nel lockfile. Preferire API ufficiali correnti di Astro; non copiare esempi di versioni obsolete.

### 12.2 Perché Astro

- produce HTML statico ideale per GitHub Pages;
- supporta Markdown e frontmatter senza un CMS;
- consente contenuti tipizzati e validati;
- richiede poco JavaScript al telefono;
- permette di aggiungere piccole isole interattive solo dove servono;
- mantiene semplice la modifica dei contenuti dal repository.

Non serve React per il nucleo. Se una singola funzionalità interattiva lo richiedesse, motivarne l'uso; non trasformare l'intero sito in una SPA.

### 12.3 Deployment

Usare GitHub Actions e l'azione ufficiale Astro/GitHub Pages. Il workflow deve:

1. attivarsi su push a `main` e manualmente con `workflow_dispatch`;
2. installare dipendenze da lockfile;
3. eseguire validazione contenuti, test e build;
4. caricare l'artefatto Pages;
5. eseguire il deploy solo dopo il successo del job di build;
6. usare `concurrency` per evitare deploy concorrenti obsoleti.

Configurare `site` e `base` in Astro. Tutti i link, asset, manifest e service worker devono funzionare sia localmente sia sotto `/<nome-repository>/`.

Riferimenti ufficiali verificati alla data della specifica:

- [Astro - deployment su GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro - Markdown](https://docs.astro.build/en/guides/markdown-content/)
- [GitHub - workflow personalizzati per Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub - modifica dei file dal browser](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)
- [Open-Meteo - Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo - termini del servizio gratuito](https://open-meteo.com/en/terms)

## 13. Struttura del repository proposta

```text
/ 
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ docs/
│  └─ specifica-app-viaggio.md
├─ starting-point/
│  ├─ FINALE_norvegia-2026.md
│  └─ norvegia-2026-storie.pdf
├─ app/
│  ├─ public/
│  │  ├─ icons/
│  │  └─ manifest.webmanifest
│  ├─ src/
│  │  ├─ components/
│  │  ├─ content/
│  │  │  ├─ days/
│  │  │  └─ curiosities/
│  │  ├─ data/
│  │  │  └─ places.yml
│  │  ├─ layouts/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  └─ styles/
│  ├─ tests/
│  ├─ astro.config.mjs
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  └─ tsconfig.json
└─ README.md
```

Il workflow GitHub Actions deve trovarsi nella directory `.github/workflows/` della root e deve configurare l'azione con `path: app`. Non creare un repository annidato dentro `app/`.

## 14. Modello contenuti

### 14.1 Esempio di giornata

Il frontmatter deve restare breve e comprensibile. Il testo lungo rimane Markdown.

```md
---
dayNumber: 9
date: "2026-08-17"
title: "Trolltunga"
route: "Røldal → P1 Tyssohallen → P3 Mågelitopp → Trolltunga"
base: "Røldal"
status: "da-verificare"
drivingMinutes: 130
hike:
  durationHours: 9
  distanceKm: 20
  elevationGainM: 800
places:
  - roldal
  - p1-tyssohallen
  - magelitopp
  - trolltunga
weatherPrimary: trolltunga
---

## Alert

> Verificare l'ultima navetta P3 → P2 e il collegamento con il bus delle 19:15.

## Programma

- **04:30** — partenza da Røldal
- **05:20-05:30** — arrivo al [P1 Tyssohallen](../../luoghi/p1-tyssohallen/)
- **06:05** — bus P1 → P2
- **06:45-07:15** — inizio trekking dal P3

## Da chiudere

- [ ] Prenotare bus P1 → P2 per sette persone
- [ ] Prenotare la navetta mattutina P2 → P3

## Piano B

Se le condizioni del 17 sono sfavorevoli, spostare l'escursione al 18 tenendo conto dell'ultima corsa anticipata.

## Link utili

- [Parcheggi ufficiali Trolltunga](https://www.trolltunga.com/en/parking-and-transport/parking)
- [Orari P1-P2](https://www.trolltunga-shuttle.com/route-info/)
```

Il collegamento interno dell'esempio è relativo e deve essere validato in build. Non codificare nei contenuti URL assoluti incompatibili con il sottopercorso GitHub Pages e non introdurre shortcode proprietari difficili da modificare da telefono.

### 14.2 Schema della giornata

Campi obbligatori:

- `dayNumber`: intero 1-15, univoco;
- `date`: data ISO univoca;
- `title`;
- `route`;
- `base`, ammesso `null` per il rientro;
- `status`;
- `drivingMinutes`, ammesso `null` quando non stimabile;
- `places`: array di slug esistenti.

Campi opzionali:

- `hike` con durata, distanza e dislivello;
- `weatherPrimary`;
- `featured` o altri attributi puramente editoriali, soltanto se realmente usati.

Non memorizzare nel frontmatter valori derivabili come `isPast`, conteggio TODO o livello del badge.

### 14.3 Esempio curiosità

```md
---
title: "Il parcheggio si chiama così per una funivia scomparsa"
slug: "magelitopp-funivia-scomparsa"
type: "storia"
days:
  - "2026-08-17"
places:
  - magelitopp
excerpt: "Mågelitopp prende il nome dalla Mågelibanen del 1922."
---

Mågelitopp, il nome del P3, viene dalla Mågelibanen: una funicolare...
```

### 14.4 Luoghi

`places.yml` contiene dati stabili, non testo narrativo:

```yaml
- slug: trolltunga
  name: Trolltunga
  area: Hardanger
  coordinates:
    latitude: 60.124
    longitude: 6.740
  elevationM: 1100
  mapUrl: "https://..."
  officialUrl: "https://..."
```

Le coordinate dell'esempio sono illustrative finché non vengono verificate. L'implementazione deve ricavare coordinate e URL da fonti attendibili oppure omettere il dato; non copiare valori di esempio come se fossero confermati.

## 15. Design e accessibilità

### 15.1 Direzione visiva

Un'estetica energica e compatta, più “tabellone di viaggio” che guida turistica. Palette suggerita:

- blu profondo da fiordo per struttura e navigazione;
- azzurro ghiaccio per informazioni;
- ruggine/arancio caldo, coerente con il PDF delle storie, per evidenza e curiosità;
- verde soltanto per stati positivi;
- rosso riservato a problemi reali.

Evitare bandiere, fiocchi di neve decorativi, montagne stock e fotografie pesanti. Le icone devono provenire da un unico set coerente oppure essere SVG locali essenziali.

### 15.2 Requisiti mobile

- Progettare prima a 360 px di larghezza.
- Target tattili di almeno 44×44 CSS px.
- Nessuno scroll orizzontale a 320 px.
- Tipografia leggibile al sole e con testo ingrandito al 200%.
- Informazione primaria raggiungibile senza accordion obbligatori.
- Barre sticky che non coprano contenuto né rispettivi anchor.
- Supportare safe areas iOS.

### 15.3 Accessibilità

- HTML semantico e gerarchia corretta dei titoli.
- Contrasto WCAG AA.
- Focus visibile e navigazione da tastiera.
- Badge con testo accessibile, non solo icone/colore.
- `aria-current` per oggi e per la sezione attiva.
- Animazioni ridotte con `prefers-reduced-motion`.
- Icone decorative nascoste alle tecnologie assistive.
- Date e orari comprensibili anche senza layout visuale.

## 16. Prestazioni e robustezza

- HTML statico come percorso principale.
- JavaScript iniziale della home indicativamente sotto 100 kB compresso, escluso service worker; motivare eventuali eccezioni.
- Nessun font remoto bloccante: preferire system font o asset locali ottimizzati.
- Nessun contenuto essenziale dipendente dal meteo o da JavaScript.
- Riservare spazio ai badge meteo per evitare layout shift.
- Lazy-load soltanto elementi non essenziali sotto la piega.
- Nessun errore console nelle rotte principali.
- Error boundary o gestione esplicita per fetch meteo e storage non disponibile.

## 17. Criteri di accettazione

### Contenuti

- Esistono 15 schede, una per ciascuna data dal 9 al 23 agosto.
- Ogni dettaglio deriva dal documento finale e non reintroduce programmi superati.
- Tutte le curiosità dell'inventario sono presenti e collegate ad almeno un luogo e una giornata.
- Bergen è divisa correttamente fra 21 e 22 agosto.
- Nessun codice di prenotazione o dato personale è versionato nell'app.

### Comportamento

- Prima, durante e dopo il viaggio gli stati temporali sono corretti nel fuso `Europe/Oslo`.
- Le giornate passate sono attenuate, non nascoste.
- La home apre il dettaglio corretto e il comando Oggi funziona.
- TODO aperti e badge corrispondono alle checkbox Markdown.
- Tutti i luoghi e link operativi sono cliccabili.
- Il sito funziona sotto il base path GitHub Pages, incluse navigazione diretta e 404.
- Dopo una prima visita i contenuti editoriali essenziali sono disponibili offline.
- Il fallimento del meteo non compromette l'app.

### Qualità

- `pnpm build`, validazione contenuti e test sono verdi.
- Test unitari coprono logica delle date, livelli dei badge, conteggio TODO e codici meteo.
- Test Playwright coprono almeno home, giornata, luogo, curiosità e navigazione mobile a 360×800.
- Un test usa una data simulata durante il viaggio e uno una data successiva.
- Un test verifica il sito con JavaScript disabilitato: i contenuti editoriali devono restare leggibili.
- Un test o script segnala link interni rotti e riferimenti a slug inesistenti.
- Nessuno scroll orizzontale a 320, 360 e 390 px.
- Lighthouse mobile indicativo: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, salvo limiti documentati dell'ambiente CI.

## 18. Sequenza di implementazione consigliata

1. Inizializzare Astro statico e configurare correttamente il base path.
2. Definire schema dei contenuti e validatori.
3. Migrare tutte le 15 giornate dal documento finale.
4. Estrarre dal PDF curiosità e relazioni con i luoghi.
5. Implementare home, scheda giorno e stati temporali.
6. Implementare dettaglio giorno, luoghi, link e conteggio TODO.
7. Implementare Curiosità e collegamenti incrociati.
8. Aggiungere modalità editor e link diretti a GitHub.
9. Aggiungere PWA/offline.
10. Aggiungere meteo Open-Meteo e relativi fallback.
11. Implementare test, controllo contenuti e workflow Pages.
12. Eseguire QA reale su telefono o emulazioni mobile, rete lenta e modalità offline.

## 19. Decisioni deliberate e punti aperti

### Già deciso

- Mobile-first.
- GitHub Pages.
- Astro statico con Markdown e TypeScript.
- Una scheda per ogni giorno.
- Giorni passati attenuati automaticamente.
- Badge guida, trekking, stato, TODO e meteo.
- Curiosità per luogo e collegate alle giornate.
- Editing tramite GitHub, senza CMS custom.
- PWA/offline.
- Open-Meteo come bonus senza chiavi.

### Da valorizzare durante l'implementazione

- Username/organizzazione GitHub e URL finale, necessari per `site`, `base` e link di modifica.
- Nome definitivo del repository, se diverso da quello attuale.
- Elenco e coordinate precise dei punti meteo.
- Link esterni ancora mancanti nel documento finale.
- Suddivisione esatta del testo condiviso di Bergen fra 21 e 22 agosto.
- Icona e nome breve installabile della PWA.

Questi punti non bloccano la costruzione del nucleo: devono essere isolati in configurazione e accompagnati da valori chiaramente marcati come da confermare, mai da dati inventati.

## 20. Definizione di “finito”

Il lavoro è finito quando un membro del gruppo può:

1. aprire il link GitHub Pages dal telefono;
2. capire immediatamente cosa succede oggi;
3. entrare nel giorno e usare programma, luoghi, alert e link;
4. vedere quante cose sono ancora da chiudere;
5. leggere le curiosità del luogo;
6. riaprire le informazioni essenziali senza rete;
7. modificare il file del giorno su GitHub e ottenere, dopo una build verde, il sito aggiornato;
8. usare tutto ciò senza incontrare placeholder, dati sensibili, link rotti o istruzioni tecniche nell'interfaccia ordinaria.
