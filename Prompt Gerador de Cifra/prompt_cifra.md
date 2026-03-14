# Prompt — Gerador de Cifra HTML para Igreja

Acesse o link da cifra abaixo e gere um arquivo **HTML para celular/tablet**, com letra e acordes, seguindo estas regras:

## Estrutura de arquivos

Usar estrutura separada com CSS e JS externos:
```
cifras/
├── index.html
├── nome_da_musica.html
├── css/
│   └── cifra.css
└── js/
    └── cifra.js
```

Cada HTML referencia:
```html
<link rel="stylesheet" href="css/cifra.css">
<script src="js/cifra.js"></script>
```

## Estrutura da cifra

- Seções com label colorido: `[INTRO]` `[VERSO]` `[PRÉ-REFRÃO]` `[REFRÃO]` `[PONTE]` `[SOLO]` `[FINAL]` e variações que aparecerem
- Acordes em dourado acima da letra, fonte monospace, alinhados com o texto
- **Fluxo completo da música do início ao fim** — sem omitir seções, sem usar "repetir", cada parte aparece na ordem em que será tocada
- Tom da música definido no body: `<body data-tom="D">`

## Layout

- Fundo escuro `#111827`, acordes em dourado `#fbbf24`
- Layout ocupa **100% da largura** da tela (`max-width: 100%`)
- Margem esquerda usando percentual para respeitar toolbar: `padding: 10px 3% 20px calc(52px + 2%)`

## Header (fixo no topo, compacto)

- Esquerda: título em **UPPERCASE** + contador automático de seção abaixo (`3/9 · REFRÃO → PRÓXIMA`)
- Direita: **transpositor** — pill com botões `−` e `+` (48×48px, fáceis de tocar) e bloco central clicável com:
  - Label superior: indicador de delta com cores:
    - `0` → cinza (tom original)
    - `+1` `+2`... → verde
    - `-1` `-2`... → laranja
  - Valor inferior: tom atual (ex: `D`, `F#`, `Bb`) — populado pelo JS via `data-tom`, nunca hardcoded no HTML
  - Clicar no bloco central reseta para o tom original

## Toolbar lateral esquerda (fixa)

Botões verticais de cima para baixo:
- `⌂` — link para `index.html`
- `A+` / `A−` — zoom da fonte
- `1col` / `2col` — alternar colunas (mostra estado atual)
- `⛶` — tela cheia
- `↑` / `↓` — navegar entre seções

## Navegação entre seções

- Ao navegar, a seção ativa vai para o **topo da tela** logo abaixo do header
- Usar `offsetTop` acumulado + `requestAnimationFrame` (nunca `getBoundingClientRect`)
- Seção ativa tem **borda dourada** de destaque, demais ficam normais
- Suporta: botões ↑↓, swipe horizontal e clique direto na seção

## Transpositor (cifra.js)

- Escala cromática com suporte a sustenidos e bemóis
- Parser de acordes: separa raiz, qualidade e baixo (ex: `D#m7/F#` → transpõe raiz e baixo, preserva qualidade)
- Guarda texto original em `data-orig` de cada `.ch` e `.co` — retranspõe sempre a partir do original
- Tom populado no init via `data-tom` do body, nunca hardcoded no HTML
- `hdr-tom-value` começa com `visibility:hidden` e recebe classe `.ready` ao ser populado pelo JS

## Atalhos de teclado

| Tecla | Ação |
|-------|------|
| `↑` `←` | Seção anterior |
| `↓` `→` | Próxima seção |
| `=` ou `+` | Zoom + |
| `-` | Zoom − |
| `F` | Tela cheia |
| `S` | +1 semitom |
| `B` | −1 semitom |

## Arquivo

- Nome: título em minúsculas com underline, sem números (ex: `nome_da_musica.html`)
- Sem subtítulo de artista no header — apenas título e contador
- Gerar arquivo `.html` para download ao final

---

## Link da cifra

[COLE O LINK AQUI]
