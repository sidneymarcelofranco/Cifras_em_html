# Padrões do Projeto

## Estrutura de um arquivo de música

Todo arquivo em `songs/` segue este esqueleto fixo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome da Música</title>
  <link rel="stylesheet" href="../css/cifra.css">
</head>
<body data-tom="D">  <!-- tom original aqui -->

<header>
  <div class="hdr-title">
    <h1>Nome da Música</h1>
    <div class="hdr-counter" id="counter"></div>
  </div>
  <div class="hdr-transpose">
    <button class="hdr-tp-btn" onclick="transpose(-1)" title="−1 semitom (B)">−</button>
    <button class="hdr-tom-block" onclick="transposeReset()" title="Resetar tom original">
      <span class="hdr-tom-label delta-zero" id="hdrTomLabel">0</span>
      <span class="hdr-tom-value" id="hdrTom"></span>
    </button>
    <button class="hdr-tp-btn" onclick="transpose(1)" title="+1 semitom (S)">+</button>
  </div>
</header>

<div class="toolbar">
  <a href="../index.html" class="tb-btn" title="Índice">⌂</a>
  <button class="tb-btn" onclick="sz(1)"  title="Zoom + (=)">A+</button>
  <button class="tb-btn" onclick="sz(-1)" title="Zoom − (-)">A−</button>
  <button class="tb-btn" id="btnCols" onclick="toggleCols()">1col</button>
  <button class="tb-btn" id="btnFS"   onclick="toggleFS()" title="Tela cheia (F)">⛶</button>
  <div class="tb-sep"></div>
  <button class="tb-btn" id="btnPrev" onclick="nav(-1)" title="Anterior (↑)">↑</button>
  <button class="tb-btn" id="btnNext" onclick="nav(1)"  title="Próxima (↓)">↓</button>
</div>

<main><div class="sections-wrap">
  <!-- seções aqui -->
</div></main>
<script src="../js/cifra.js"></script>
</body>
</html>
```

---

## Classes de seção

Cada seção é um `div.s` com um `div.lbl` e um `div.bd`:

```html
<div class="s">
  <div class="lbl intro">Intro</div>
  <div class="bd">
    <!-- conteúdo -->
  </div>
</div>
```

### Tipos de label e suas cores

| Classe CSS | Cor | Uso |
|-----------|-----|-----|
| `.intro` | Laranja `#f97316` | Introdução instrumental |
| `.verso` | Ciano `#38bdf8` | Verso (pode repetir com label diferente: "Verso 2") |
| `.pre` | Roxo `#a78bfa` | Pré-Refrão / Pós-Refrão |
| `.refrao` | Ouro `#fbbf24` | Refrão / Refrão Final |
| `.ponte` | Verde `#34d399` | Ponte / Segunda Parte |
| `.solo` | Rosa `#f472b6` | Solo instrumental |
| `.final` | Teal `#6ee7b7` | Final / Coda |

---

## Conteúdo das seções

### Bloco com acorde + letra (`.bl`)
Padrão principal — acorde acima da sílaba correspondente:

```html
<div class="bl">
  <div class="ch">Am              G</div>
  <div class="ly">Texto da letra aqui</div>
</div>
```

> O alinhamento dos acordes é feito com espaços (fonte monospace). Cada acorde deve estar posicionado acima da sílaba que ele cobre.

### Acorde/comentário sem letra (`.co`)
Usado em Intro, Solo, Ponte instrumental — quando não há letra:

```html
<div class="co">D  A/C#  G  D4  D</div>
```

### Múltiplos blocos dentro de uma seção

```html
<div class="bd">
  <div class="bl"><div class="ch">D    A/C#</div><div class="ly">Primeira frase</div></div>
  <div class="bl"><div class="ch">G    D/F#</div><div class="ly">Segunda frase</div></div>
  <div class="bl"><div class="ch">Em7       A</div><div class="ly">Terceira frase</div></div>
</div>
```

### Divisor entre partes (músicas com 2 partes)

```html
<hr class="divider">
<p class="part-title">— Parte 2 —</p>
```

---

## Variáveis CSS

Definidas em `:root` e manipuladas pelo JS via `element.style.setProperty`:

| Variável | Padrão | Controlada por |
|----------|--------|----------------|
| `--cf` | `0.9em` | Zoom (botões A+/A−) |
| `--lf` | `0.95em` | Zoom (botões A+/A−) |
| `--cols` | `1` | Botão 1col/2col |

---

## Transposição

- O tom original é lido do atributo `data-tom` do `<body>` (ex: `data-tom="F#"`).
- Cada `.ch` e `.co` tem seu texto original salvo em `data-orig` pelo JS no carregamento.
- Na transposição, o JS sempre retranspõe a partir do `data-orig` para evitar acúmulo de erro.
- Preferência por bemol (`b`) nos tons: F, Bb, Eb, Ab, Db, Gb.

---

## Nomeação de arquivos

- Letras minúsculas com underline: `nome_da_musica.html`
- Sem números, sem acentos no nome do arquivo
- Exemplos: `a_boa_parte.html`, `deus_e_quem_me_fortalece.html`
