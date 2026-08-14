# Nadácia Good Boy — darovací formulár

Trojkrokový darovací formulár pre fiktívnu nadáciu Good Boy, ktorá podporuje slovenské útulky pre psov. Riešenie zadania pre GoodRequest — plné znenie a stav rozpracovanosti nájdeš v [assignment.md](assignment.md).

## Spustenie

```bash
pnpm install
pnpm dev
```

Aplikácia beží na `http://localhost:3000`. Ďalšie príkazy:

```bash
pnpm build   # produkčný build, zároveň slúži ako typecheck
pnpm lint    # ESLint
```

Projekt používa **pnpm**. API beží na verejnom endpointe bez autentifikácie, takže nie je potrebná žiadna konfigurácia. Adresu sa dá prepísať cez `NEXT_PUBLIC_API_URL` v `.env.local`.

## Technológie

| Vrstva | Voľba |
| --- | --- |
| Framework | Next.js 16, App Router, React 19 |
| Jazyk | TypeScript |
| Server state | TanStack Query |
| Client state | zustand |
| Formuláre | react-hook-form |
| Validácia | Zod |
| Štýlovanie | Tailwind CSS v4 |

## Štruktúra

```
src/
├── api/                     HTTP klient a typy endpointov
├── app/
│   ├── (donation)/          formulár — spoločný layout so stepperom
│   │   ├── page.tsx             krok 1: výber útulku
│   │   ├── osobne-udaje/        krok 2: osobné údaje
│   │   └── potvrdenie/          krok 3: zhrnutie a odoslanie
│   ├── kontakt/
│   ├── o-projekte/          text nadácie + vyzbieraná suma a počet darcov
│   ├── layout.tsx
│   └── providers.tsx        QueryClientProvider
├── components/              zdieľané UI — polia formulára, pätička, notifikácie
├── features/donation/       doména daru: schémy, store, kroky, dopyty
└── store/                   globálne notifikácie
```

Kód je členený podľa domény, nie podľa typu súboru. Všetko, čo sa týka daru, žije v `features/donation`; v `components` ostávajú len veci použiteľné kdekoľvek.

## Ako to funguje

**Každý krok má vlastnú routu.** Vďaka tomu môže niesť vlastný `title` a `description` — jedno z bonusových kritérií zadania — a funguje tlačidlo Späť v prehliadači.

**Každý krok má vlastnú Zod schému.** `shelterStepSchema`, `personalStepSchema` a `confirmationStepSchema` v [schema.ts](src/features/donation/schema.ts) sú jediným zdrojom pravdy pre validáciu aj pre TypeScript typy, ktoré sa z nich odvodzujú cez `z.input` a `z.output`. Podmienená povinnosť útulku je riešená v `superRefine`, nie v komponente.

**Rozpracovaný dar drží zustand.** Store v [store.ts](src/features/donation/store.ts) prenáša už zvalidované hodnoty medzi krokmi. Žije len v pamäti, takže priamy vstup na neskorší krok komponent `RequireDraft` vráti na začiatok.

**Server state ide výhradne cez TanStack Query.** Hooky v [queries.ts](src/features/donation/queries.ts) používajú spoločnú query key factory; po úspešnom odoslaní sa invaliduje prehľad vyzbieranej sumy, takže čísla na stránke O projekte sú okamžite aktuálne.

## Dve odchýlky od zadania

**Meno je povinné.** Zadanie ho označuje ako nepovinné, ale API vráti `400 joi.body.contributors.0.firstName`, ak je prázdne — overené priamym volaním endpointu. Uprednostnil som formulár, ktorý vždy prejde, pred doslovným dodržaním zadania.

**React Compiler je vypnutý** v [next.config.ts](next.config.ts). Memoizuje funkcie vracané z `useForm()`, čím ticho zahodí zápisy `setValue` a `reset` do neriadených inputov — prakticky to znamená, že tlačidlá s prednastavenou sumou nemenili hodnotu poľa a formulár sa po odoslaní neresetoval.

## API

Dokumentácia: <https://frontend-assignment-api.goodrequest.dev/apidoc/>

```
GET  /api/v1/shelters/          zoznam zapojených útulkov
GET  /api/v1/shelters/results   vyzbieraná suma a počet darcov
POST /api/v1/shelters/contribute odoslanie príspevku
```

Pole `contributors` je v tele požiadavky pole, takže bonusová úloha s viacerými darcami nevyžaduje zásah do dátovej vrstvy.
