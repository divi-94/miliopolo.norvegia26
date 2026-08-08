# Rapporto di blocco

**Stato:** bloccato in P8.

## Blocco

- **Fase e attività:** P8, workflow GitHub Actions per build e deploy su Pages.
- **Causa precisa:** il workflow previsto dalla specifica concede `pages: write` e pubblica automaticamente dopo un push a `main`; serve quindi autorizzazione esplicita a predisporre questa automazione di scrittura esterna.
- **Evidenza osservata:** il tentativo di aggiungere `../.github/workflows/deploy.yml` è stato respinto dal controllo di sicurezza perché il mandato corrente vieta di pubblicare GitHub Pages e altre scritture esterne.
- **Impatto sul risultato:** tutti i gate locali e browser sono verdi, ma P8 e la definizione di completamento richiedono quel workflow; il progetto non può essere marcato `complete`.

## Tentativi eseguiti

1. Preparato un workflow conforme alla specifica con trigger su `main`, validazione prima del deploy e `concurrency`; la modifica è stata respinta per il permesso `pages: write` e il deploy automatico.
2. Valutato un workflow di sola validazione o un file di esempio: non soddisferebbe il requisito Pages e sarebbe un workaround incompleto.

## Stato lasciato

- File modificati: test QA, dipendenze di audit, accessibilità checklist, metadati social e relativa immagine, stato persistente dell’agente.
- Ultimi controlli verdi: `pnpm check`; `pnpm test:e2e` con 15 test; QA visuale a 320/360/390 px; `git diff --check`; controllo privacy mirato.
- Controlli rossi o non eseguibili: nessuno sul codice dell’app; non è possibile creare il workflow di deploy con l’autorità attuale.
- Azione sicura possibile nel frattempo: nessuna ulteriore modifica è necessaria fuori dal workflow e dal successivo report finale.

## Unica domanda per l'utente

Mi autorizzi ad aggiungere localmente il workflow GitHub Pages che, una volta eventualmente pubblicato da te, eseguirà il deploy automatico a ogni push su `main` (senza che io faccia push o attivi Pages)?
