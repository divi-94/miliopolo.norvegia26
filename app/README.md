# App Norvegia 2026 - workspace autonomo

Questa cartella è predisposta per essere affidata a un agente Codex in una sessione lunga, con più cicli di implementazione e verifica senza supervisione continua.

## Avvio consigliato

1. Apri questa cartella `app/` come directory di lavoro della nuova sessione, oppure avvia Codex con `--cd app`.
2. Seleziona il modello SOL con reasoning `high`.
3. Avvia Goal mode con `/goal`, se disponibile.
4. Incolla integralmente il testo di [`START_PROMPT.md`](START_PROMPT.md).
5. Lascia lavorare l'agente finché dichiara `complete` oppure `blocked`.

Non serve rilanciare manualmente ogni fase. L'agente aggiornerà lo stato dopo ogni ciclo e continuerà da solo quando i gate sono verdi.

## Dove guardare al ritorno

- [`.agent/STATUS.md`](.agent/STATUS.md): stato corrente e ultima evidenza.
- [`.agent/PLAN.md`](.agent/PLAN.md): fasi completate e lavoro residuo.
- [`.agent/BLOCKED.md`](.agent/BLOCKED.md): compilato soltanto se serve davvero il tuo intervento.
- [`.agent/FINAL_REPORT.md`](.agent/FINAL_REPORT.md): resoconto finale e istruzioni per pubblicare.

## Cosa non farà autonomamente

- push su GitHub;
- attivazione o modifica di GitHub Pages;
- pubblicazione esterna;
- inserimento di credenziali;
- decisioni di prodotto che cambiano materialmente la specifica.

I commit locali di checkpoint sono autorizzati dal prompt fornito, ma devono riguardare soltanto l'app e il workflow collegato.

## Fonti

- Specifica: [`../docs/specifica-app-viaggio.md`](../docs/specifica-app-viaggio.md)
- Itinerario finale: `../starting-point/FINALE_norvegia-2026.md`
- Curiosità: `../starting-point/norvegia-2026-storie.pdf`

