# Site COBEM Oftalmologia — Design aprovado

**Data:** 2026-07-02 · **Status:** aprovado no brainstorm (chat) · **Repo:** `eunielhenrique/briefing-cobem`

## Contexto e objetivo

A COBEM Oftalmologia (Instagram: [@cobemoftalmologia](https://www.instagram.com/cobemoftalmologia/))
precisa de um site institucional. Este repo já hospeda o formulário de briefing
(`index.html`, Vercel) — ele passa a ser o repo do projeto inteiro.

- **Objetivo nº 1 do site:** gerar agendamentos via WhatsApp. Todo o resto (credibilidade,
  serviços, SEO) sustenta essa conversão.
- **O briefing do cliente ainda não foi respondido.** O site nasce completo com
  placeholders explícitos (ver "Dados da clínica") e é atualizado quando as respostas
  chegarem — as respostas do formulário chegam por e-mail (eunielhenrique@gmail.com,
  assunto "Briefing do site — Cobem Oftalmologia").

## Direção visual — "Herança da marca" (aprovada em mockup)

Derivada da logo (serifa preta sobre branco, olho no "O" com íris azul royal, fio azul,
"OFTALMOLOGIA" espaçado):

| Token | Valor |
|---|---|
| Fundo | branco/quase-branco `#fdfdfc` |
| Tinta (texto/títulos) | preto-tinta `#12171f` |
| Azul da marca (acento) | `#2f56a4` — réguas, links, detalhes, eyebrows |
| Verde WhatsApp | `#25d366` — **exclusivo** dos CTAs de agendamento |
| Título | serifa via system stack (`Georgia, 'Times New Roman', serif` — sem webfont), pesos moderados, itálico pontual em azul |
| Texto corrido | sans limpa (system stack), `#55606f`, máx. ~65 caracteres por linha |
| Motivo gráfico | o fio azul e o olho do "O" da logo viram réguas finas e detalhes de seção |

Tom: clínica boutique — claro, muito respiro, elegante sem ser escuro/dourado.
Mockup de referência: artifact "COBEM — Direções visuais" (versão `logo-real`).

**Logo:** usar o arquivo original enviado pelo cliente (PNG/vetor). Enquanto o arquivo
não chega ao repo, usar o traçado SVG fiel criado no mockup, em `src/components/Logo.astro`,
claramente comentado como provisório. Arquivo real entra em `src/assets/` e substitui.

## Mapa do site

```
/                        Home
/servicos/catarata
/servicos/glaucoma
/servicos/cirurgia-refrativa
/servicos/cornea-e-ceratocone
/servicos/oftalmopediatria
/servicos/lentes-de-contato
/exames                  página única: OCT, campo visual, topografia,
                         mapeamento de retina, paquimetria, biometria
/equipe                  corpo clínico + responsável técnico (CRM)
/contato                 endereço, mapa, horários, WhatsApp, telefone
/briefing                formulário existente, preservado na mesma URL
```

- ⚠️ A lista de serviços é hipótese baseada no padrão de clínica oftalmológica
  (as mesmas opções do formulário de briefing). O briefing confirma; adicionar/remover
  página = 1 arquivo em `src/pages/servicos/`.
- **Home** vende em um scroll: hero (mockup aprovado) → serviços em cards → exames em
  faixa → equipe resumida → convênios → depoimentos (Google) → localização → CTA final.
  Cada seção linka para a página completa.
- **Página de serviço** (motor de SEO local) segue sempre o mesmo esqueleto:
  o que é → sintomas/quando procurar → como funciona o tratamento na COBEM →
  perguntas frequentes → CTA de agendamento.
- **Botão flutuante de WhatsApp** em todas as páginas (exceto `/briefing`), além dos
  CTAs no conteúdo.

## Stack e arquitetura

**Astro** (SSG) — HTML estático no build, zero JS de runtime (widget de WhatsApp em CSS puro).

```
src/
├── layouts/Base.astro         <head> com SEO/meta, header, footer, botão WhatsApp
├── components/                Logo, Hero, CardServico, FaixaExames, CardMedico,
│                              Convenios, Depoimentos, FAQ, CTAWhatsApp, Mapa
├── pages/                     um .astro por página do mapa acima
│   └── servicos/[6 páginas].astro
└── data/clinica.ts            ← ÚNICA fonte dos dados da clínica
public/
└── briefing/index.html        formulário atual movido para cá (mesma URL)
```

### Dados da clínica (`src/data/clinica.ts`)

Objeto único, tipado, com tudo que depende do briefing: nome, WhatsApp, telefone,
e-mail, endereço, cidade, horários, médicos (nome/CRM/especialidade/bio), convênios,
link do Google Reviews, domínio, redes sociais.

- Valor ainda não confirmado = string com marcador `[PENDENTE: ...]` ou `null`.
- **Mock nunca se apresenta como real** (regra da casa): placeholder renderiza como
  `[a confirmar]` visível, nunca como telefone/endereço inventado.
- Briefing respondido → atualizar este único arquivo atualiza o site inteiro.

### SEO

- `title` + `meta description` próprios por página (padrão: "Serviço em [Cidade] | COBEM Oftalmologia").
- Open Graph + favicon derivado da logo.
- `@astrojs/sitemap` para sitemap.xml automático; `robots.txt`.
- JSON-LD `MedicalClinic` (endereço, horários, geo) no layout base — só com dados reais;
  campos pendentes ficam fora do JSON-LD até o briefing chegar.
- Meta: Lighthouse 95+ em performance/SEO/acessibilidade.

## Deploy

- Mesma Vercel do briefing; o projeto passa a buildar Astro (preset automático).
- `vercel.json` atual (headers/rewrites, se houver) migra para a config do Astro.
- `/briefing` continua respondendo na mesma URL — critério de aceite do deploy.
- Fluxo: branch `claude/project-leaders-list-5p0smw` → preview da Vercel → revisão
  do Euniel → merge em `main` (produção).
- Domínio final (ex.: cobemoftalmologia.com.br) vem do briefing; até lá, `.vercel.app`.

## Testes e verificação

- `astro build` no CI (GitHub Actions) — página quebrada = build vermelho.
- `astro check` para erros de tipo/template.
- Teste unitário (Vitest, já integrado ao ecossistema Astro/Vite) sobre `clinica.ts`: helper `isPendente()` e
  garantia de que nenhum campo marcado `[PENDENTE]` entra no JSON-LD.
- Smoke pós-deploy: curl nas rotas principais + `/briefing`.

## Fora de escopo (fase 2, pós-briefing)

- Blog/conteúdo educativo; agendamento online integrado (Doctoralia etc. — depende da
  resposta "sistema de agendamento" do briefing); Google Analytics/Pixel; multi-idioma.

## Critérios de aceite

1. Todas as rotas do mapa buildando e navegáveis, com a direção visual aprovada.
2. CTA de WhatsApp visível em toda página (hero/flutuante) apontando para o número
   em `clinica.ts` (placeholder marcado até o briefing).
3. `/briefing` intacto na mesma URL.
4. Build verde no CI; Lighthouse 95+; nenhum dado inventado apresentado como real.
