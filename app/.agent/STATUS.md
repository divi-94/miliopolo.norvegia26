# Stato del lavoro

```yaml
project_status: in_progress
active_phase: P8
last_completed_item: "P7 - Meteo"
next_action: "Completare CI, test no-JS, audit mobile e report finale"
last_green_checks:
  - "pnpm check (2026-08-08)"
  - "pnpm test:e2e (8 test, inclusi offline ed errore meteo, 2026-08-08)"
current_blocker: null
last_updated: "2026-08-08"
```

## Regole di aggiornamento

- Aggiorna il blocco YAML dopo ogni ciclo.
- `project_status` ammette soltanto `ready`, `in_progress`, `blocked`, `complete`.
- Riporta soltanto controlli realmente eseguiti in `last_green_checks`.
- Mantieni `next_action` concreta e singola.
- Se lo stato è `blocked`, compila anche `BLOCKED.md`.
- Se lo stato è `complete`, compila anche `FINAL_REPORT.md`.

## Diario sintetico dei cicli

| Ciclo | Risultato | Verifiche | Esito |
|---|---|---|---|
| 0 | Workspace autonomo predisposto | struttura e istruzioni revisionate | ready |
| 1 | Astro statico, schemi, validatore, test e layout base | `pnpm check` | verde |
| 2 | Importate 15 giornate e 74 luoghi senza codici sensibili | `pnpm check`, controllo privacy | verde |
| 3 | Home, stati Oslo, badge, TODO e navigazione mobile | `pnpm check`, `pnpm test:e2e`, QA 320/360/390 | verde |
| 4 | Dettagli giorno, checklist, 74 pagine luogo e azioni esterne | `pnpm check`, 93 pagine e 4 test e2e | verde |
| 5 | Inventario integrale di 51 curiosità, indice filtrabile e relazioni | `pnpm check`, 159 pagine, 5 test e2e e QA 320/390 | verde |
| 6 | Modalità editor persistente, URL GitHub e metadati di build | `pnpm check`, 10 test unitari, 6 test e2e e QA 360 | verde |
| 7 | PWA base-aware, 159 contenuti precache, stato offline e aggiornamenti | `pnpm check`, 7 test e2e incluso offline e verifica endpoint | verde |
| 8 | Meteo Open-Meteo per 11 punti, cache, fasce orarie e fallback | `pnpm check`, 13 test unitari, 8 test e2e e QA API reale 360 | verde |

Limitare ogni nuova riga a una frase breve. I dettagli appartengono al codice, ai test o al report finale.
