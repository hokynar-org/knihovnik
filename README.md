# Knihovník

Knihovna všeho - experimentální aplikace pro [knihovní ekonomiku](https://www.youtube.com/watch?v=NOYa3YzVtyk). Napsaná ve SvelteKitu, běžící na edgi.

## Jak devit

1. nejprve se musí stáhnout balíčky pomocí `pnpm install`
2. poté se musí vytvořit `.env` soubor s potřebnými parametry (koukni do sekce [Co musí být v .env](#co-musí-být-v-env))
3. dev server se zapíná pomocí `pnpm dev`

## Co musí být v .env

Rychlý příklad:

```sh
DATABASE_URL="postgresql://user:pass@server.tech/db"
JWT_SECRET="vXInABcD4oAa06ftFC+m1FS9lU9sVfzrsuEuFOyLGRU="
MAIL_AUTH='{ "from": "kni@hovnik.cz", "host": "smtp.cz", "port": 420, "auth": { "user": "uzivatel", "pass": "heslo" } }'

BUCKET_ENDPOINT="https://kyblik.r2.cloudflarestorage.com/"
BUCKET_NAME="knihovnik"
BUCKET_ACCESS_KEY_ID="blabla"
BUCKET_SECRET_ACCESS_KEY="tajne_blabla"

ORIGIN="http://localhost:5173"
```

### Seznam proměnných

- `DATABASE_URL`: link na datázi, pro náš se musí člověk poptat 😉
- `JWT_SECRET`: tajemství sloužící k ověřování JWT tokenu, lze vygenerovat pomocí `openssl rand -base64 32`
- `MAIL_AUTH`: JSON objekt s nastavením mailu. Musí obsahovat tyto props:
  - `from`: adresa, ze které chodí systémové maily
  - `host` (a případně `port`): adresa SMTP serveru
  - `auth`: přihlašovací údaje k SMTP serveru
- `BUCKET_*`: nastavení bucketu pro statické soubory
  - `ENDPOINT`
  - `NAME`
  - `ACCESS_KEY_ID`
  - `SECRET_ACCESS_KEY`
- `ORIGIN`: protokol a hostname serveru, na kterém Knihovník běží. V debugu lze použít to co je v příkladu. Slouží k CSRF validaci a taky je součástí linků v informačních/registračních mailech
- `VITE_PORT`: (dobrovolné) alternativní port pro dev server, hodí se pokud chcete mít např uložené heslo a používáte Vite na 100 projektů takže na tom defaultním `http://localhost:5173` máte kotel hesel
