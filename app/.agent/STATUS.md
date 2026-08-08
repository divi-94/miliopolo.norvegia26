# Stato del lavoro

```yaml
project_status: in_progress
active_phase: P1
last_completed_item: "P0 - Bootstrap e fondamenta"
next_action: "Migrare e validare le 15 giornate dal documento finale"
last_green_checks:
  - "pnpm check (2026-08-08)"
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

Limitare ogni nuova riga a una frase breve. I dettagli appartengono al codice, ai test o al report finale.
