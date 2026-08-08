# Report finale

**Stato:** completo l’8 agosto 2026.

## Risultato consegnato

È stata realizzata un’app Astro completamente statica e mobile-first per il viaggio Norvegia 2026. Il sito contiene il programma operativo delle 15 giornate, 89 luoghi, 51 curiosità, navigazione temporale nel fuso di Oslo, modalità editor GitHub, meteo Open-Meteo, installazione PWA e consultazione offline. Tutte le rotte sono prerenderizzate e funzionano sotto il base path `/miliopolo.norvegia26/`.

## Funzionalità completate

- Dashboard cronologica con stati prima/durante/dopo il viaggio, giorno corrente, badge guida, trekking, stato, TODO e meteo.
- Dettagli giornalieri con alert, programma, checklist in sola lettura, piano B, attrezzatura, luoghi, link e storie correlate.
- Pagine luogo con mappe, giornate, curiosità e azioni esterne sicure.
- Inventario integrale delle 51 storie, fatti e leggende ricavati dal PDF e collegati a giorni e luoghi.
- Modalità editor persistente con collegamenti esatti ai file Markdown su GitHub, senza token nel browser.
- PWA base-aware con manifest, icona, precache delle 159 rotte editoriali, fallback offline e aggiornamenti non bloccanti.
- Meteo Open-Meteo per 11 destinazioni verificate, cache locale, fasce orarie, attribuzione e fallback espliciti.
- Metadati canonical/Open Graph e social card locale generata per il viaggio.
- Workflow GitHub Pages in `.github/workflows/deploy.yml`, con `pnpm check` prima dell’artefatto e deploy dipendente dal job verde.

## Verifiche eseguite

| Comando o controllo | Esito | Note |
|---|---|---|
| `pnpm check` | verde | 15 giornate, 89 luoghi, 51 curiosità, typecheck senza diagnostiche, 13 test unitari, build di 159 pagine e link interni validi. |
| `pnpm test:e2e` | verde | 15 test Chromium: home, date simulate, giorno, luogo, curiosità, editor, no-JS, offline, errore meteo, axe, console e Lighthouse. |
| QA mobile 320/360/390 px | verde | Ispezione reale nel browser e test automatico senza overflow sulle rotte rappresentative. |
| Accessibilità e performance | verde | Nessuna violazione axe WCAG A/AA nelle pagine campione; soglie Lighthouse mobile Performance ≥90, Accessibility ≥95 e Best Practices ≥95 superate. |
| Offline/PWA | verde | Una giornata visitata è stata riaperta offline; manifest, service worker e scope verificati sotto il base path. |
| Link, privacy e console | verde | 159 pagine controllate, validatore privacy attivo, nessun errore console nelle rotte principali. |
| Workflow Pages | verde localmente | YAML parsato e contratto verificato: trigger, permessi, `pnpm check`, artefatto, dipendenza del deploy e concurrency. |

## Limiti residui

- Open-Meteo e i link esterni dipendono dalla rete e non hanno garanzia di disponibilità; l’app mantiene comunque leggibili i contenuti statici.
- Le previsioni sono informative e non sostituiscono bollettini, gestori o valutazioni di sicurezza.
- Il deploy live non è stato eseguito, come richiesto. Il primo run del workflow e il dominio pubblico potranno essere verificati solo dopo il push su `main` e l’attivazione di Pages da parte dell’utente.

## Come eseguire

Da `app/`, con Node 24 e pnpm 11.16.0:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:e2e
pnpm astro preview --host 127.0.0.1
```

La preview è disponibile sotto `http://127.0.0.1:4321/miliopolo.norvegia26/`.

## Come pubblicare

1. Integrare i commit locali nel ramo `main`.
2. Su GitHub aprire **Settings → Pages** e selezionare **GitHub Actions** come sorgente.
3. Eseguire il push di `main` oppure avviare manualmente **Deploy Norvegia 2026 to GitHub Pages**.
4. Attendere che i job `build` e `deploy` siano verdi e verificare l’URL pubblicato.

Nessun push, deploy o cambio delle impostazioni GitHub è stato eseguito durante questa implementazione.
