# Site COBEM Oftalmologia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site institucional multi-página da COBEM Oftalmologia, focado em agendamento via WhatsApp, com placeholders honestos até o briefing chegar.

**Architecture:** Astro (SSG) no repo `briefing-cobem`; todos os dados dependentes do briefing centralizados em `src/data/clinica.ts` com convenção `[PENDENTE: ...]`; formulário de briefing atual preservado em `/briefing`. Deploy na Vercel existente.

**Tech Stack:** Astro 5 + @astrojs/sitemap, Vitest, CSS puro (sem framework), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-07-02-site-cobem-design.md` — ler antes de começar.

**Branch:** `claude/project-leaders-list-5p0smw`. Commits com mensagens em português, prefixos `feat:`/`chore:`/`test:`.

⚠️ **Aviso ao usuário no final:** o briefing hoje responde na RAIZ da Vercel; após o deploy ele passa a `/briefing`. Se o link raiz já foi enviado ao cliente, reenviar.

---

### Task 1: Scaffold Astro + preservar o briefing em /briefing

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (provisório)
- Move: `index.html` → `public/briefing/index.html`
- Modify: `vercel.json`

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "cobem-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.5.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Criar `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  // Trocar pelo domínio final quando o briefing confirmar (ex.: https://cobemoftalmologia.com.br)
  site: 'https://briefing-cobem.vercel.app',
  integrations: [sitemap()],
})
```

- [ ] **Step 3: Criar `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Criar `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 5: Mover o briefing (via git, preserva histórico)**

```bash
mkdir -p public/briefing
git mv index.html public/briefing/index.html
```

- [ ] **Step 6: Substituir `vercel.json`** (Astro auto-detectado; remover output estático da raiz)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro"
}
```

- [ ] **Step 7: Criar `src/pages/index.astro` provisório** (substituída na Task 6)

```astro
---
---
<html lang="pt-BR"><head><meta charset="utf-8"><title>COBEM Oftalmologia</title></head>
<body><h1>COBEM Oftalmologia — em construção</h1></body></html>
```

- [ ] **Step 8: Instalar e buildar**

Run: `npm install && npm run build`
Expected: build verde; `ls dist/briefing/index.html` existe e `ls dist/index.html` existe.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro; briefing preservado em /briefing"
```

---

### Task 2: Dados da clínica com convenção PENDENTE (TDD)

**Files:**
- Create: `src/data/clinica.ts`
- Test: `src/data/clinica.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — `src/data/clinica.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { isPendente, mostra, linkWhatsApp, jsonLdClinica, clinica } from './clinica'

describe('convenção PENDENTE', () => {
  it('detecta valor pendente', () => {
    expect(isPendente('[PENDENTE: cidade]')).toBe(true)
    expect(isPendente('Fortaleza')).toBe(false)
    expect(isPendente(null)).toBe(true)
  })

  it('mostra() nunca vaza o marcador cru para a tela', () => {
    expect(mostra('[PENDENTE: endereço]')).toBe('[a confirmar]')
    expect(mostra('Rua X, 100')).toBe('Rua X, 100')
  })

  it('linkWhatsApp devolve null se pendente e wa.me se real', () => {
    expect(linkWhatsApp('[PENDENTE: WhatsApp]')).toBeNull()
    expect(linkWhatsApp('(85) 9 8888-7777')).toBe('https://wa.me/5585988887777')
  })

  it('JSON-LD nunca inclui campo pendente', () => {
    const ld = jsonLdClinica()
    if (ld === null) return // tudo pendente: sem JSON-LD, correto
    expect(JSON.stringify(ld)).not.toContain('[PENDENTE')
  })

  it('dados obrigatórios existem no objeto', () => {
    expect(clinica.nome).toBe('COBEM Oftalmologia')
    expect(clinica.instagram).toBe('@cobemoftalmologia')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL — módulo `./clinica` não existe.

- [ ] **Step 3: Implementar `src/data/clinica.ts`**

```ts
/**
 * ÚNICA fonte dos dados da clínica. Briefing respondido → atualizar SÓ este arquivo.
 * Valor não confirmado usa o marcador [PENDENTE: ...] — a UI o exibe como "[a confirmar]"
 * e ele NUNCA entra em JSON-LD/meta tags (mock não se apresenta como real).
 */
export type Medico = { nome: string; crm: string; especialidade: string; bio?: string }

export const clinica = {
  nome: 'COBEM Oftalmologia',
  cidade: '[PENDENTE: cidade]',
  endereco: '[PENDENTE: endereço completo]',
  whatsapp: '[PENDENTE: WhatsApp da clínica]',
  telefone: '[PENDENTE: telefone fixo]',
  email: '[PENDENTE: e-mail da clínica]',
  horario: '[PENDENTE: horário de atendimento]',
  responsavelTecnico: '[PENDENTE: RT — Dr(a). + CRM]',
  instagram: '@cobemoftalmologia',
  googleReviews: '[PENDENTE: link do Google Reviews]',
  medicos: [] as Medico[],          // preencher com o briefing
  convenios: [] as string[],        // preencher com o briefing
  depoimentos: [] as { autor: string; texto: string }[], // só depoimentos REAIS
}

export function isPendente(v: unknown): boolean {
  return v == null || (typeof v === 'string' && v.startsWith('[PENDENTE'))
}

/** Para exibição: pendente vira "[a confirmar]" — nunca o marcador cru. */
export function mostra(v: string | null | undefined): string {
  return isPendente(v) ? '[a confirmar]' : (v as string)
}

/** Link wa.me ou null enquanto o número não é real. */
export function linkWhatsApp(numero: string = clinica.whatsapp): string | null {
  if (isPendente(numero)) return null
  return `https://wa.me/55${numero.replace(/\D/g, '')}`
}

/** JSON-LD MedicalClinic só com dados reais; null se nem o mínimo existe. */
export function jsonLdClinica(): object | null {
  if (isPendente(clinica.endereco)) return null
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinica.nome,
    address: clinica.endereco,
  }
  if (!isPendente(clinica.telefone)) ld.telephone = clinica.telefone
  if (!isPendente(clinica.horario)) ld.openingHours = clinica.horario
  return ld
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS (5 testes).

- [ ] **Step 5: Commit**

```bash
git add src/data/clinica.ts src/data/clinica.test.ts
git commit -m "feat: dados da clínica com convenção PENDENTE (testado)"
```

---

### Task 3: Estilos globais, Logo e layout Base

**Files:**
- Create: `src/styles/global.css`, `src/components/Logo.astro`, `src/layouts/Base.astro`, `public/favicon.svg`, `public/robots.txt`

- [ ] **Step 1: Criar `src/styles/global.css`** (tokens da spec + utilitários)

```css
:root{
  --fundo:#fdfdfc; --tinta:#12171f; --texto:#55606f;
  --brand:#2f56a4; --zap:#25d366; --zap-tinta:#052e16;
  --linha:#e6ebf3; --suave:#f2f5fa;
  --serif:Georgia,'Times New Roman',serif;
  --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--fundo);color:var(--texto);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:var(--serif);color:var(--tinta);font-weight:500;line-height:1.15;text-wrap:balance}
h1{font-size:clamp(30px,4.5vw,44px)}
h2{font-size:clamp(23px,3vw,30px)}
p{max-width:65ch}
a{color:var(--brand)}
img{max-width:100%}
.container{max-width:1080px;margin:0 auto;padding:0 20px}
.secao{padding:56px 0}
.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-size:11px;font-weight:600;color:var(--brand);margin:0 0 10px}
.regua{width:64px;height:2px;background:var(--brand);border:0;margin:16px 0}
.btn{display:inline-block;border-radius:999px;padding:13px 26px;font-weight:700;font-size:15px;text-decoration:none;font-family:var(--sans)}
.btn-zap{background:var(--zap);color:var(--zap-tinta)}
.btn-sec{border:1.5px solid #cdd6e6;color:var(--brand)}
.a-confirmar{color:#a16207;background:#fef9c3;border-radius:6px;padding:0 6px;font-size:.92em}
.grid-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
```

- [ ] **Step 2: Criar `src/components/Logo.astro`**

```astro
---
// PROVISÓRIO: traçado fiel da logo enviada no chat (serifa + olho no "O").
// Substituir pelo arquivo original (PNG/vetor) em src/assets/ quando o cliente enviar.
interface Props { altura?: number }
const { altura = 46 } = Astro.props
---
<a href="/" aria-label="COBEM Oftalmologia — início" style="display:inline-block;line-height:0">
  <svg height={altura} viewBox="0 0 560 158" role="img" aria-label="COBEM Oftalmologia">
    <text x="0" y="98" font-family="Georgia,'Times New Roman',serif" font-size="104" fill="#111">C</text>
    <path d="M84,64 Q152,4 220,64" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <path d="M84,64 Q152,124 220,64" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <circle cx="152" cy="64" r="30" fill="none" stroke="#2f56a4" stroke-width="5" stroke-dasharray="132 18" stroke-dashoffset="-8"/>
    <path d="M138,58 a15,15 0 1 0 20,-4" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
    <text x="228" y="98" font-family="Georgia,'Times New Roman',serif" font-size="104" fill="#111" letter-spacing="4">BEM</text>
    <line x1="2" y1="118" x2="556" y2="118" stroke="#2f56a4" stroke-width="4"/>
    <text x="2" y="152" font-family="Georgia,'Times New Roman',serif" font-size="25" fill="#222" letter-spacing="17.5">OFTALMOLOGIA</text>
  </svg>
</a>
```

- [ ] **Step 3: Criar `public/favicon.svg`** (olho da logo)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M6,32 Q32,6 58,32" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <path d="M6,32 Q32,58 58,32" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="12" fill="none" stroke="#2f56a4" stroke-width="4"/>
</svg>
```

- [ ] **Step 4: Criar `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /briefing
Sitemap: https://briefing-cobem.vercel.app/sitemap-index.xml
```

- [ ] **Step 5: Criar `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css'
import Logo from '../components/Logo.astro'
import { clinica, linkWhatsApp, jsonLdClinica, mostra } from '../data/clinica'
interface Props { title: string; description: string }
const { title, description } = Astro.props
const wa = linkWhatsApp()
const ld = jsonLdClinica()
---
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="sitemap" href="/sitemap-index.xml" />
  {ld && <script type="application/ld+json" set:html={JSON.stringify(ld)} />}
</head>
<body>
  <header>
    <div class="container barra">
      <Logo altura={42} />
      <nav aria-label="principal">
        <a href="/#servicos">Serviços</a>
        <a href="/exames">Exames</a>
        <a href="/equipe">Equipe</a>
        <a href="/contato">Contato</a>
      </nav>
      <a class="btn btn-zap" href={wa ?? '/contato'}>Agendar no WhatsApp</a>
    </div>
  </header>

  <main><slot /></main>

  <footer>
    <div class="container rodape">
      <Logo altura={34} />
      <p>{mostra(clinica.endereco)} · {mostra(clinica.horario)}</p>
      <p>Responsável técnico: {mostra(clinica.responsavelTecnico)} · {clinica.instagram}</p>
      <p>© {new Date().getFullYear()} {clinica.nome}</p>
    </div>
  </footer>

  <a class="zap-flutuante" href={wa ?? '/contato'} aria-label="Agendar pelo WhatsApp">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.3 1.5Z"/></svg>
  </a>
</body>
</html>

<style>
header{border-bottom:1px solid var(--linha);background:var(--fundo);position:sticky;top:0;z-index:10}
.barra{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:14px;padding-bottom:14px;flex-wrap:wrap}
nav{display:flex;gap:22px;font-size:14.5px}
nav a{color:#425062;text-decoration:none}
nav a:hover{color:var(--brand)}
.rodape{padding:36px 20px;border-top:1px solid var(--linha);font-size:13.5px}
.rodape p{margin:6px 0}
.zap-flutuante{position:fixed;right:18px;bottom:18px;width:56px;height:56px;border-radius:50%;background:var(--zap);display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,0,0,.22);z-index:20}
</style>
```

- [ ] **Step 6: Buildar**

Run: `npm run build`
Expected: verde (layout ainda sem uso — só valida sintaxe via `astro check`: `npm run check`).

- [ ] **Step 7: Commit**

```bash
git add src/styles src/components/Logo.astro src/layouts/Base.astro public/favicon.svg public/robots.txt
git commit -m "feat: tokens visuais, logo provisória e layout base com SEO"
```

---

### Task 4: Componentes compartilhados (CTA, cards, FAQ)

**Files:**
- Create: `src/components/CTAWhatsApp.astro`, `src/components/CardServico.astro`, `src/components/FAQ.astro`

- [ ] **Step 1: Criar `src/components/CTAWhatsApp.astro`**

```astro
---
import { linkWhatsApp } from '../data/clinica'
interface Props { texto?: string; titulo?: string }
const { texto = 'Agendar pelo WhatsApp', titulo } = Astro.props
const wa = linkWhatsApp()
---
<div class="cta">
  {titulo && <h2>{titulo}</h2>}
  <a class="btn btn-zap" href={wa ?? '/contato'}>{texto}</a>
  {!wa && <p class="nota">WhatsApp <span class="a-confirmar">[a confirmar]</span> — em breve o agendamento direto.</p>}
</div>
<style>
.cta{text-align:center;padding:36px 20px;background:var(--suave);border-radius:16px;margin:24px 0}
.cta h2{margin-top:0}
.nota{font-size:13px;margin:10px 0 0;max-width:none}
</style>
```

- [ ] **Step 2: Criar `src/components/CardServico.astro`**

```astro
---
interface Props { titulo: string; resumo: string; href: string }
const { titulo, resumo, href } = Astro.props
---
<a class="card" href={href}>
  <h3>{titulo}</h3>
  <p>{resumo}</p>
  <span class="mais">Saiba mais →</span>
</a>
<style>
.card{display:block;border:1px solid var(--linha);border-radius:14px;padding:22px;text-decoration:none;background:#fff;transition:border-color .15s}
.card:hover{border-color:var(--brand)}
.card h3{margin:0 0 8px;font-size:19px}
.card p{margin:0 0 12px;font-size:14px;color:var(--texto)}
.mais{color:var(--brand);font-size:13.5px;font-weight:600}
</style>
```

- [ ] **Step 3: Criar `src/components/FAQ.astro`**

```astro
---
interface Props { faqs: { p: string; r: string }[] }
const { faqs } = Astro.props
---
<section class="faq">
  <h2>Perguntas frequentes</h2>
  {faqs.map((f) => (
    <details>
      <summary>{f.p}</summary>
      <p>{f.r}</p>
    </details>
  ))}
</section>
<style>
details{border-bottom:1px solid var(--linha);padding:14px 0}
summary{cursor:pointer;font-weight:600;color:var(--tinta);font-family:var(--sans)}
details p{margin:10px 0 0}
</style>
```

- [ ] **Step 4: Verificar sintaxe e commitar**

Run: `npm run check`
Expected: 0 erros.

```bash
git add src/components
git commit -m "feat: componentes CTA WhatsApp, card de serviço e FAQ"
```

---

### Task 5: Conteúdo dos serviços + páginas /servicos/[slug]

**Files:**
- Create: `src/data/servicos.ts`, `src/pages/servicos/[slug].astro`

- [ ] **Step 1: Criar `src/data/servicos.ts`** (⚠️ lista-hipótese; briefing confirma quais ficam)

```ts
export type Servico = {
  slug: string; nome: string; resumo: string
  oQueE: string; sintomas: string[]; tratamento: string
  faqs: { p: string; r: string }[]
}

export const servicos: Servico[] = [
  {
    slug: 'catarata',
    nome: 'Cirurgia de Catarata',
    resumo: 'Recupere a nitidez da visão com cirurgia moderna e segura.',
    oQueE: 'A catarata é a opacificação do cristalino, a lente natural do olho, e é a principal causa de perda visual reversível no mundo. É mais comum a partir dos 60 anos e tem tratamento definitivo.',
    sintomas: ['Visão embaçada ou "nublada"', 'Sensibilidade à luz e ofuscamento', 'Cores desbotadas', 'Dificuldade para dirigir à noite', 'Troca frequente do grau dos óculos'],
    tratamento: 'O único tratamento é cirúrgico: o cristalino opaco é substituído por uma lente intraocular. É um procedimento rápido, indolor e com recuperação em poucos dias. Na consulta, avaliamos o seu caso e indicamos a lente mais adequada.',
    faqs: [
      { p: 'A cirurgia de catarata dói?', r: 'Não. É feita com anestesia local (colírio) e sedação leve; a maioria dos pacientes relata apenas leve desconforto.' },
      { p: 'Quanto tempo dura a recuperação?', r: 'A visão melhora nos primeiros dias e a recuperação completa costuma levar cerca de 30 dias, com colírios e acompanhamento.' },
      { p: 'A catarata pode voltar?', r: 'Não. Pode ocorrer opacificação da cápsula com o tempo, resolvida em consultório com laser, sem nova cirurgia.' },
    ],
  },
  {
    slug: 'glaucoma',
    nome: 'Glaucoma',
    resumo: 'Diagnóstico precoce e controle para proteger seu nervo óptico.',
    oQueE: 'O glaucoma é uma doença silenciosa que danifica o nervo óptico, geralmente associada à pressão ocular elevada. Sem tratamento, pode levar à perda irreversível da visão — por isso o diagnóstico precoce é decisivo.',
    sintomas: ['Na maioria dos casos, nenhum sintoma no início', 'Perda gradual da visão periférica', 'Halos ao redor de luzes', 'Em crises agudas: dor ocular intensa e visão turva'],
    tratamento: 'O controle é feito com colírios, laser ou cirurgia, conforme o estágio. O acompanhamento regular com medida de pressão, campo visual e OCT permite ajustar o tratamento e preservar a visão.',
    faqs: [
      { p: 'Glaucoma tem cura?', r: 'Não tem cura, mas tem controle. Com tratamento adequado, a imensa maioria dos pacientes preserva a visão.' },
      { p: 'Quem precisa se preocupar?', r: 'Pessoas acima de 40 anos, com histórico familiar, alta miopia ou pressão ocular elevada devem fazer avaliação periódica.' },
      { p: 'Colírio de glaucoma é para sempre?', r: 'Em geral o tratamento é contínuo. Interromper por conta própria é a principal causa de progressão da doença.' },
    ],
  },
  {
    slug: 'cirurgia-refrativa',
    nome: 'Cirurgia Refrativa (miopia, astigmatismo, hipermetropia)',
    resumo: 'Liberdade dos óculos com correção a laser personalizada.',
    oQueE: 'A cirurgia refrativa corrige miopia, astigmatismo e hipermetropia remodelando a córnea com laser, reduzindo ou eliminando a dependência de óculos e lentes de contato.',
    sintomas: ['Dependência de óculos ou lentes para o dia a dia', 'Desconforto com lentes de contato', 'Grau estável há pelo menos 1 ano'],
    tratamento: 'Após exames detalhados da córnea (topografia, paquimetria), definimos a técnica mais segura para o seu caso. O procedimento dura minutos e a recuperação visual costuma ser rápida.',
    faqs: [
      { p: 'Qualquer pessoa pode operar?', r: 'Não. É preciso grau estável, córnea saudável e idade mínima em torno de 21 anos. Os exames pré-operatórios definem a indicação.' },
      { p: 'O resultado é definitivo?', r: 'A correção do grau tratado é permanente; alterações naturais do olho com a idade (como a vista cansada) podem ocorrer.' },
      { p: 'Quanto tempo de repouso?', r: 'Na maioria das técnicas, 1 a 3 dias de repouso relativo, com retorno rápido às atividades.' },
    ],
  },
  {
    slug: 'cornea-e-ceratocone',
    nome: 'Córnea e Ceratocone',
    resumo: 'Do diagnóstico ao crosslinking e adaptação de lentes especiais.',
    oQueE: 'O ceratocone é uma doença progressiva em que a córnea afina e assume formato de cone, distorcendo a visão. Costuma surgir na adolescência e evolui até por volta dos 35 anos.',
    sintomas: ['Visão distorcida ou duplicada', 'Troca frequente e rápida de grau', 'Astigmatismo irregular progressivo', 'Coceira ocular frequente (hábito de coçar agrava)'],
    tratamento: 'Conforme o estágio: óculos, lentes de contato especiais, crosslinking (para frear a progressão), anel intraestromal ou, em casos avançados, transplante de córnea.',
    faqs: [
      { p: 'Ceratocone cega?', r: 'Com diagnóstico e tratamento adequados, a grande maioria dos pacientes mantém boa visão. O acompanhamento evita a progressão.' },
      { p: 'O que é crosslinking?', r: 'Procedimento que fortalece o colágeno da córnea com riboflavina e luz UV, freando a progressão do ceratocone.' },
      { p: 'Coçar o olho faz mal mesmo?', r: 'Sim — o ato de coçar é um dos principais fatores de progressão. Tratar a alergia ocular faz parte do tratamento.' },
    ],
  },
  {
    slug: 'oftalmopediatria',
    nome: 'Oftalmopediatria',
    resumo: 'Cuidado com a visão das crianças, do teste do olhinho à escola.',
    oQueE: 'A oftalmopediatria cuida da saúde ocular de bebês, crianças e adolescentes. Grande parte do desenvolvimento visual acontece até os 7 anos — problemas detectados cedo têm tratamento muito mais eficaz.',
    sintomas: ['Olhos desalinhados (estrabismo)', 'Aproximar-se muito de telas e cadernos', 'Dor de cabeça e baixo rendimento escolar', 'Lacrimejamento e fotofobia', 'Reflexo branco na pupila em fotos'],
    tratamento: 'Consulta adaptada para a idade, com avaliação de grau, alinhamento e desenvolvimento visual. Tratamentos incluem óculos, tampão, exercícios e, quando necessário, cirurgia de estrabismo.',
    faqs: [
      { p: 'Quando levar meu filho pela primeira vez?', r: 'Além do teste do olhinho na maternidade, recomenda-se avaliação oftalmológica completa entre 6 e 12 meses e antes da alfabetização.' },
      { p: 'Criança pequena consegue fazer exame de vista?', r: 'Sim. Há técnicas e equipamentos específicos que medem o grau mesmo sem a criança falar ou ler.' },
      { p: 'Tela faz mal para a visão infantil?', r: 'O excesso está associado a fadiga visual e progressão de miopia. Pausas regulares e atividades ao ar livre ajudam a proteger.' },
    ],
  },
  {
    slug: 'lentes-de-contato',
    nome: 'Lentes de Contato',
    resumo: 'Adaptação segura, do grau simples às lentes especiais.',
    oQueE: 'A adaptação de lentes de contato é um processo médico: o mapa da córnea, a lágrima e a rotina do paciente definem a lente ideal — de gelatinosas de uso diário a rígidas e esclerais para córneas irregulares.',
    sintomas: ['Desconforto com a lente atual', 'Olho seco ou vermelho com lentes', 'Ceratocone ou astigmatismo alto', 'Vontade de reduzir o uso dos óculos'],
    tratamento: 'Avaliamos a superfície ocular, testamos a lente em consultório e ensinamos manuseio e higiene. O acompanhamento periódico garante conforto e segurança a longo prazo.',
    faqs: [
      { p: 'Lente de contato pode com ceratocone?', r: 'Sim — em muitos casos é o que devolve a melhor visão. Lentes rígidas e esclerais são desenhadas para córneas irregulares.' },
      { p: 'Posso dormir com as lentes?', r: 'Na grande maioria das lentes, não. Dormir com lentes aumenta muito o risco de infecção grave.' },
      { p: 'Qual a validade de uma adaptação?', r: 'Reavaliação anual (ou antes, se houver desconforto) mantém a saúde da córnea e a qualidade da visão.' },
    ],
  },
]
```

- [ ] **Step 2: Criar `src/pages/servicos/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro'
import FAQ from '../../components/FAQ.astro'
import CTAWhatsApp from '../../components/CTAWhatsApp.astro'
import { servicos } from '../../data/servicos'
import { clinica, mostra, isPendente } from '../../data/clinica'

export function getStaticPaths() {
  return servicos.map((s) => ({ params: { slug: s.slug }, props: { s } }))
}
const { s } = Astro.props
const cidade = isPendente(clinica.cidade) ? '' : ` em ${clinica.cidade}`
---
<Base title={`${s.nome}${cidade} | ${clinica.nome}`} description={s.resumo}>
  <article class="container secao">
    <p class="eyebrow">Serviços · {clinica.nome}</p>
    <h1>{s.nome}</h1>
    <hr class="regua" />

    <h2>O que é</h2>
    <p>{s.oQueE}</p>

    <h2>Sintomas e quando procurar</h2>
    <ul>{s.sintomas.map((x) => <li>{x}</li>)}</ul>

    <h2>Como funciona o tratamento na {clinica.nome}</h2>
    <p>{s.tratamento}</p>

    <FAQ faqs={s.faqs} />

    <CTAWhatsApp titulo={`Agende sua avaliação de ${s.nome.toLowerCase()}`} />
    <p class="nota">Atendimento: {mostra(clinica.horario)} · {mostra(clinica.endereco)}</p>
  </article>
</Base>
<style>
ul{padding-left:20px}
li{margin:6px 0}
.nota{font-size:13px}
</style>
```

- [ ] **Step 3: Buildar e conferir as 6 rotas**

Run: `npm run build && ls dist/servicos`
Expected: `catarata/ cirurgia-refrativa/ cornea-e-ceratocone/ glaucoma/ lentes-de-contato/ oftalmopediatria/`

- [ ] **Step 4: Commit**

```bash
git add src/data/servicos.ts src/pages/servicos
git commit -m "feat: 6 páginas de serviço geradas de dados (SEO local)"
```

---

### Task 6: Home completa

**Files:**
- Modify: `src/pages/index.astro` (substitui o provisório da Task 1)
- Create: `src/data/exames.ts`

- [ ] **Step 1: Criar `src/data/exames.ts`**

```ts
export const exames = [
  { nome: 'OCT (Tomografia de Coerência Óptica)', desc: 'Imagens de alta resolução da retina e do nervo óptico.' },
  { nome: 'Campo Visual', desc: 'Mapeia a visão periférica; essencial no acompanhamento do glaucoma.' },
  { nome: 'Topografia de Córnea', desc: 'Mapa da curvatura da córnea; base do diagnóstico de ceratocone.' },
  { nome: 'Mapeamento de Retina', desc: 'Exame do fundo do olho para retina, mácula e nervo óptico.' },
  { nome: 'Paquimetria', desc: 'Mede a espessura da córnea; complementa avaliação de glaucoma e refrativa.' },
  { nome: 'Biometria', desc: 'Cálculo preciso da lente intraocular para a cirurgia de catarata.' },
]
```

- [ ] **Step 2: Substituir `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import CardServico from '../components/CardServico.astro'
import CTAWhatsApp from '../components/CTAWhatsApp.astro'
import { servicos } from '../data/servicos'
import { exames } from '../data/exames'
import { clinica, mostra, linkWhatsApp, isPendente } from '../data/clinica'
const wa = linkWhatsApp()
const cidade = isPendente(clinica.cidade) ? '' : ` em ${clinica.cidade}`
---
<Base
  title={`${clinica.nome} — Clínica oftalmológica${cidade}`}
  description={`Consultas, exames e cirurgias oftalmológicas${cidade}. Agende pelo WhatsApp.`}
>
  <!-- Hero (direção "Herança da marca" aprovada em mockup) -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <p class="eyebrow">Clínica oftalmológica{cidade}</p>
        <h1>Cuidar da sua visão é <em>ver bem</em> a vida inteira</h1>
        <hr class="regua" />
        <p>Consultas, exames e cirurgias com equipe especializada e estrutura completa — do check-up de rotina à catarata e ao glaucoma.</p>
        <div class="botoes">
          <a class="btn btn-zap" href={wa ?? '/contato'}>Agendar pelo WhatsApp</a>
          <a class="btn btn-sec" href="/#servicos">Conhecer a clínica</a>
        </div>
      </div>
      <div class="olho" role="img" aria-label="Ilustração abstrata de um olho no azul da marca"></div>
    </div>
  </section>

  <!-- Serviços -->
  <section id="servicos" class="secao container">
    <p class="eyebrow">Serviços</p>
    <h2>Especialidades da COBEM</h2>
    <div class="grid-cards" style="margin-top:22px">
      {servicos.map((s) => <CardServico titulo={s.nome} resumo={s.resumo} href={`/servicos/${s.slug}`} />)}
    </div>
  </section>

  <!-- Exames -->
  <section class="secao faixa">
    <div class="container">
      <p class="eyebrow">Diagnóstico</p>
      <h2>Exames realizados na clínica</h2>
      <ul class="lista-exames">
        {exames.map((e) => <li><strong>{e.nome}</strong> — {e.desc}</li>)}
      </ul>
      <a href="/exames">Ver todos os exames →</a>
    </div>
  </section>

  <!-- Equipe (resumo) -->
  <section class="secao container">
    <p class="eyebrow">Equipe</p>
    <h2>Corpo clínico</h2>
    {clinica.medicos.length === 0
      ? <p>Equipe em atualização — os perfis completos dos médicos serão publicados em breve. Responsável técnico: <span class="a-confirmar">[a confirmar]</span>.</p>
      : <p>{clinica.medicos.length} especialistas à disposição. <a href="/equipe">Conheça a equipe →</a></p>}
  </section>

  <!-- Convênios -->
  <section class="secao faixa">
    <div class="container">
      <p class="eyebrow">Convênios</p>
      <h2>Planos e formas de atendimento</h2>
      {clinica.convenios.length === 0
        ? <p>Lista de convênios aceitos <span class="a-confirmar">[a confirmar]</span> — consulte pelo WhatsApp.</p>
        : <p>{clinica.convenios.join(' · ')}</p>}
    </div>
  </section>

  <!-- Depoimentos: só renderiza com depoimento REAL (regra: mock nunca se apresenta como real) -->
  {clinica.depoimentos.length > 0 && (
    <section class="secao container">
      <p class="eyebrow">Depoimentos</p>
      <h2>Quem já se consultou</h2>
      {clinica.depoimentos.map((d) => <blockquote>"{d.texto}" — {d.autor}</blockquote>)}
    </section>
  )}

  <!-- Localização + CTA final -->
  <section class="secao container">
    <p class="eyebrow">Onde estamos</p>
    <h2>Localização e horários</h2>
    <p>{mostra(clinica.endereco)}<br />{mostra(clinica.horario)}</p>
    <CTAWhatsApp titulo="Pronto para cuidar da sua visão?" />
  </section>
</Base>

<style>
.hero{padding:64px 0 72px;border-bottom:1px solid var(--linha)}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:32px;align-items:center}
@media(max-width:720px){.hero-grid{grid-template-columns:1fr}}
.hero h1 em{font-style:italic;color:var(--brand)}
.botoes{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
.olho{width:100%;aspect-ratio:1.1;border-radius:16px;border:1px solid var(--linha);background:
  radial-gradient(circle at 50% 50%, #10151d 0 11%, #fff 12% 13.5%, var(--brand) 14% 24%, var(--fundo) 25% 27%, #10151d 27.5% 29%, transparent 29.5%),
  radial-gradient(ellipse 78% 46% at 50% 50%, transparent 0 62%, #10151d 62.5% 64%, transparent 64.5%),
  radial-gradient(circle at 65% 38%, rgba(47,86,164,.16) 0 7%, transparent 8%),
  linear-gradient(155deg,#f6f8fb,#eef2f8)}
.faixa{background:var(--suave)}
.lista-exames{padding-left:20px}
.lista-exames li{margin:8px 0}
blockquote{border-left:3px solid var(--brand);margin:14px 0;padding:4px 16px;font-style:italic}
</style>
```

- [ ] **Step 3: Buildar e commitar**

Run: `npm run build`
Expected: verde; `dist/index.html` contém "Cuidar da sua visão".

```bash
git add src/pages/index.astro src/data/exames.ts
git commit -m "feat: home completa (hero aprovado, serviços, exames, convênios, CTA)"
```

---

### Task 7: Páginas Exames, Equipe e Contato

**Files:**
- Create: `src/pages/exames.astro`, `src/pages/equipe.astro`, `src/pages/contato.astro`

- [ ] **Step 1: Criar `src/pages/exames.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import CTAWhatsApp from '../components/CTAWhatsApp.astro'
import { exames } from '../data/exames'
import { clinica, isPendente } from '../data/clinica'
const cidade = isPendente(clinica.cidade) ? '' : ` em ${clinica.cidade}`
---
<Base title={`Exames oftalmológicos${cidade} | ${clinica.nome}`} description="OCT, campo visual, topografia, mapeamento de retina, paquimetria e biometria — exames realizados na própria clínica.">
  <article class="container secao">
    <p class="eyebrow">Diagnóstico</p>
    <h1>Exames oftalmológicos</h1>
    <hr class="regua" />
    <p>Todos os exames abaixo são realizados na própria clínica, no mesmo local da consulta.</p>
    <dl>
      {exames.map((e) => (<><dt>{e.nome}</dt><dd>{e.desc}</dd></>))}
    </dl>
    <CTAWhatsApp titulo="Precisa de um exame? Agende pelo WhatsApp" />
  </article>
</Base>
<style>
dt{font-weight:700;color:var(--tinta);margin-top:18px;font-family:var(--serif);font-size:18px}
dd{margin:4px 0 0}
</style>
```

- [ ] **Step 2: Criar `src/pages/equipe.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import CTAWhatsApp from '../components/CTAWhatsApp.astro'
import { clinica, mostra } from '../data/clinica'
---
<Base title={`Equipe médica | ${clinica.nome}`} description="Conheça o corpo clínico da COBEM Oftalmologia.">
  <article class="container secao">
    <p class="eyebrow">Equipe</p>
    <h1>Corpo clínico</h1>
    <hr class="regua" />
    {clinica.medicos.length === 0 ? (
      <p>Os perfis completos da equipe médica serão publicados em breve.</p>
    ) : (
      <div class="grid-cards">
        {clinica.medicos.map((m) => (
          <div class="medico">
            <h3>{m.nome}</h3>
            <p><strong>{m.crm}</strong> · {m.especialidade}</p>
            {m.bio && <p>{m.bio}</p>}
          </div>
        ))}
      </div>
    )}
    <p>Responsável técnico: {mostra(clinica.responsavelTecnico)}</p>
    <CTAWhatsApp titulo="Agende com a nossa equipe" />
  </article>
</Base>
<style>
.medico{border:1px solid var(--linha);border-radius:14px;padding:20px;background:#fff}
.medico h3{margin:0 0 6px}
.medico p{font-size:14px;margin:4px 0}
</style>
```

- [ ] **Step 3: Criar `src/pages/contato.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import { clinica, mostra, linkWhatsApp, isPendente } from '../data/clinica'
const wa = linkWhatsApp()
---
<Base title={`Contato e agendamento | ${clinica.nome}`} description="Endereço, horários, telefone e WhatsApp da COBEM Oftalmologia.">
  <article class="container secao">
    <p class="eyebrow">Contato</p>
    <h1>Agendamento e localização</h1>
    <hr class="regua" />
    <dl>
      <dt>WhatsApp (agendamento)</dt>
      <dd>{wa ? <a class="btn btn-zap" href={wa}>Chamar no WhatsApp</a> : <span class="a-confirmar">[a confirmar]</span>}</dd>
      <dt>Telefone</dt><dd>{mostra(clinica.telefone)}</dd>
      <dt>E-mail</dt><dd>{mostra(clinica.email)}</dd>
      <dt>Endereço</dt><dd>{mostra(clinica.endereco)}</dd>
      <dt>Horário de atendimento</dt><dd>{mostra(clinica.horario)}</dd>
      <dt>Instagram</dt><dd><a href="https://www.instagram.com/cobemoftalmologia/" rel="noopener">{clinica.instagram}</a></dd>
    </dl>
    {isPendente(clinica.endereco)
      ? <p class="nota">O mapa será exibido aqui quando o endereço for confirmado.</p>
      : <iframe title="Mapa da clínica" width="100%" height="320" style="border:0;border-radius:14px" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(clinica.endereco)}&output=embed`}></iframe>}
  </article>
</Base>
<style>
dt{font-weight:700;color:var(--tinta);margin-top:16px}
dd{margin:6px 0 0}
.nota{font-size:13px;color:var(--texto)}
</style>
```

- [ ] **Step 4: Buildar e conferir todas as rotas**

Run: `npm run build && find dist -name index.html | sort`
Expected inclui: `dist/index.html`, `dist/briefing/index.html`, `dist/contato/`, `dist/equipe/`, `dist/exames/`, e as 6 de `dist/servicos/`.

- [ ] **Step 5: Commit**

```bash
git add src/pages
git commit -m "feat: páginas de exames, equipe e contato"
```

---

### Task 8: CI (GitHub Actions)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Criar `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: ['**']
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run check
      - run: npm run build
```

- [ ] **Step 2: Rodar localmente o que o CI roda**

Run: `npm ci && npm test && npm run check && npm run build`
Expected: tudo verde.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: CI com teste, check e build"
```

---

### Task 9: Verificação final e push

- [ ] **Step 1: Conferir critérios de aceite da spec**

```bash
npm run build
# 1. todas as rotas do mapa presentes:
find dist -name index.html | sort
# 2. nenhum marcador cru vazando para o HTML:
grep -rl 'PENDENTE' dist/ || echo "OK: nenhum [PENDENTE] cru no build"
# 3. briefing intacto:
grep -q 'Briefing do Site' dist/briefing/index.html && echo "OK: briefing preservado"
```
Expected: rotas completas; "OK" nas duas checagens. (`[a confirmar]` pode aparecer — é o placeholder honesto; `[PENDENTE` cru não pode.)

- [ ] **Step 2: Preview visual local** (se possível)

Run: `npm run preview` e conferir home, uma página de serviço e /briefing no navegador.

- [ ] **Step 3: Push**

```bash
git push -u origin claude/project-leaders-list-5p0smw
```
Expected: branch publicada; Vercel gera preview deploy. Avisar o usuário para conferir o preview e do aviso da URL do briefing (raiz → /briefing).

---

## Pós-briefing (não é tarefa deste plano)

Quando o cliente responder o formulário: atualizar `src/data/clinica.ts` (e a lista de
serviços se necessário), trocar `site` no `astro.config.mjs` pelo domínio real, substituir
`src/components/Logo.astro` pelo arquivo original da logo, atualizar `robots.txt`.
