# Knihovník

Knihovna všeho - experimentální aplikace pro [knihovní ekonomii](https://www.youtube.com/watch?v=NOYa3YzVtyk). Napsaná ve SvelteKitu, běžící na edgi.

## Jak devit

1. nejprve se musí stáhnout balíčky pomocí `pnpm install`
2. poté se musí vytvořit `.env` soubor s potřebnými parametry (koukni do sekce [Co musí být v .env](#co-musí-být-v-env))
3. dev server se zapíná pomocí `pnpm dev`

## Co musí být v .env

Rychlý příklad:

```sh
DATABASE_URL="postgresql://user:pass@server.tech/db"
JWT_SECRET="vXInABcD4oAa06ftFC+m1FS9lU9sVfzrsuEuFOyLGRU="
MAIL_AUTH="?"
```

### Seznam proměnných

- `DATABASE_URL`: link na datázi, pro náš se musí člověk poptat 😉
- `JWT_SECRET`: Tajemství sloužící k ověřování JWT tokenu, lze vygenerovat pomocí `openssl rand -base64 32`
- `MAIL_AUTH`: _TBD_ moderní věda zatím nedokáže určit, co sem patří
