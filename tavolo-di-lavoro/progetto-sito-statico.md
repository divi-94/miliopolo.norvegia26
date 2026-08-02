# Progetto futuro - sito mobile del viaggio

**Stato:** raccolta di idee, non ancora in progettazione  
**Destinazione prevista:** sito statico pubblicato con GitHub Pages

## Visione

Creare uno strumento mobile-first da usare durante il viaggio, capace di mostrare immediatamente:

- cosa è previsto oggi;
- cosa viene dopo;
- cosa è già passato;
- quali alternative sono disponibili;
- dove trovare l'approfondimento operativo della giornata o dell'area.

Non deve essere soltanto la trasposizione online del documento condiviso: deve privilegiare la consultazione rapida dal telefono.

## Pagina principale

Overview cronologica del viaggio che tenga conto dello scorrere del tempo:

- giornate passate visivamente attenuate;
- giornata corrente in massima evidenza;
- prossime giornate più visibili delle tappe lontane;
- attività principale, base e stato operativo leggibili a colpo d'occhio;
- accesso rapido a piano migliore e piani di riserva.

## Pagine giorno o area

Ogni pagina dovrebbe poter contenere:

- piano migliore;
- sequenza e orari indicativi;
- base/pernotto e spostamenti;
- link a navigazione, Wikiloc, parcheggi e prenotazioni;
- condizioni meteo che cambiano la decisione;
- piani B con una condizione di attivazione chiara;
- note pratiche e decisioni ancora aperte.

## Aggiornamento da telefono

Idea iniziale: contenuti mantenuti in file semplici nel repository e modificabili dall'interfaccia mobile di GitHub. Un commit o push aggiorna il sito tramite il normale flusso di pubblicazione di GitHub Pages.

La forma esatta dei contenuti è da decidere più avanti. I tavoli di lavoro vengono già preparati distinguendo campi stabili e testo narrativo, così sarà possibile convertirli in Markdown con front matter, YAML o JSON senza riscrivere tutte le informazioni.

## Aspetti da valutare in seguito

- disponibilità offline o cache delle pagine essenziali;
- comportamento del sito rispetto al fuso orario e al cambio di data;
- modalità semplice per segnare una decisione presa durante il viaggio;
- gestione di link esterni quando la connessione è debole;
- separazione tra contenuti stabili, aggiornamenti sul posto e informazioni sensibili;
- eventuale installazione come PWA;
- processo per trasformare i tavoli approvati nei contenuti pubblicati.

## Principio editoriale già applicabile

Ogni giornata deve avere una struttura distinguibile anche da una macchina:

- identificativo e data;
- area e base;
- stato della decisione;
- piano migliore;
- alternative/piani B;
- condizioni di attivazione;
- orari indicativi;
- link operativi;
- note libere.

Questo principio guiderà i prossimi tavoli senza vincolare prematuramente tecnologia o design del sito.
