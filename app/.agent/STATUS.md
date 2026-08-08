# Stato del lavoro

```yaml
project_status: complete
active_phase: P8
last_completed_item: "P8 - CI, QA e consegna"
next_action: "Integrare i commit locali su main e attivare Pages quando autorizzato"
last_green_checks:
  - "pnpm check (15 giornate, 89 luoghi, 51 curiosità, 13 test, 159 pagine e link, 2026-08-08 17:27)"
  - "pnpm test:e2e (15 test inclusi no-JS, offline, axe e Lighthouse, 2026-08-08 17:27)"
  - "QA visuale browser a 320, 360 e 390 px (2026-08-08)"
  - "Workflow Pages validato localmente: trigger, permessi, gate, artifact, dependency e concurrency (2026-08-08)"
  - "pnpm install --frozen-lockfile --force e pnpm check con allowBuilds/esbuild (2026-08-08 17:44)"
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
| 9 | QA finale no-JS, axe, Lighthouse, console, social card e viewport mobili | `pnpm check`, 15 test e2e e QA 320/360/390 | verde; workflow bloccato |
| 10 | Workflow Pages autorizzato, report e consegna completati | YAML validato, `pnpm check`, 15 test e2e e diff finale | verde |
| 11 | Allowlist script migrata da `onlyBuiltDependencies` a `allowBuilds` per pnpm 11 | installazione forzata da lockfile e `pnpm check` | verde |

Limitare ogni nuova riga a una frase breve. I dettagli appartengono al codice, ai test o al report finale.
