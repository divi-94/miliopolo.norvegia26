# Registro delle decisioni

Registrare soltanto decisioni durevoli non già ovvie dalla specifica. Ogni voce deve spiegare il motivo e l'impatto; non usare questo file come diario.

## D-001 - Fonte operativa dopo la migrazione

**Decisione:** il documento finale alimenta l'import iniziale; successivamente i Markdown in `src/content/` sono la fonte pubblicata.

**Motivo:** file piccoli sono modificabili da telefono e non richiedono il parsing fragile del documento monolitico a ogni build.

## D-002 - Nessun CMS custom

**Decisione:** la prima versione usa link diretti all'editor web GitHub.

**Motivo:** un CMS autenticato richiederebbe backend/OAuth e sarebbe sproporzionato per un progetto di vacanza.

## D-003 - Checklist condivise tramite Markdown

**Decisione:** le checkbox mostrate nel sito non salvano localmente uno stato condiviso.

**Motivo:** `localStorage` produrrebbe stati divergenti fra i sette utenti; il file versionato resta l'unica fonte comune.

## D-004 - Un solo agente scrittore

**Decisione:** il flusso base usa un solo agente sul working tree.

**Motivo:** il progetto è piccolo e non giustifica coordinamento multi-agent o worktree paralleli; si evita la sovrapposizione di modifiche.

## D-005 - Punti meteo fissi verificati

**Decisione:** le coordinate delle undici destinazioni meteo sono state verificate il 2026-08-08 con OpenStreetMap Nominatim e restano dati editoriali versionati in `places.yml`.

**Motivo:** il meteo deve descrivere la destinazione del giorno, non la posizione del telefono; punti fissi rendono la richiesta riproducibile e autorivedibile.
