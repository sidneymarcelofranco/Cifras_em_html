# CLAUDE.md — Portal de Cifras

Referência rápida para Claude Code. Não crie songs/* ou edite index.html manualmente
sem seguir este guia.

---

## Estrutura do projeto

```
Cifras_em_html/
├── index.html            # Menu principal (gerado dinamicamente via database/songs.js)
├── database/
│   └── songs.js          # FONTE DA VERDADE — acervo completo de músicas (window.SONGS)
├── songs/
│   └── *.html            # Uma página por música
├── css/
│   └── cifra.css         # Estilos globais
├── js/
│   └── cifra.js          # Transposição, zoom, navegação, tela cheia
└── docs/
    ├── patterns.md       # Referência detalhada do HTML das cifras
    ├── adding-songs.md   # Passo a passo para adicionar músicas
    └── prompt_cifra.md   # Prompt usado para gerar cifras via IA
```

---

## Como adicionar uma música nova

**Dois passos, sempre os dois:**

1. **Criar `songs/<nome>.html`** seguindo o padrão de `docs/patterns.md`
   - `<body data-tom="X">` com o tom original
   - Seções com `.lbl intro/verso/pre/refrao/ponte/solo/final`
   - Blocos `.bl > .ch + .ly` para acordes + letra; `.co` para seções instrumentais

2. **Adicionar entrada em `database/songs.js`**
   ```js
   {
     artist: "Nome do Artista",
     title:  "Título da Música",
     key:    "Tom",          // ex: "D", "Bb", "F#", "Gm"
     file:   "songs/arquivo.html"
   }
   ```
   O `index.html` lê esse array e monta o menu sozinho — **não edite `index.html` diretamente**.

---

## Padrão do HTML de cifra (resumo)

```html
<body data-tom="D">
...
<main><div class="sections-wrap">

  <!-- Seção sem letra -->
  <div class="s"><div class="lbl intro">Intro</div><div class="bd">
    <div class="co">D  A/C#  G  A</div>
  </div></div>

  <!-- Seção com acordes + letra -->
  <div class="s"><div class="lbl verso">Verso</div><div class="bd">
    <div class="bl"><div class="ch">D         A/C#</div><div class="ly">Texto da linha</div></div>
    <div class="bl"><div class="ch">G                 A</div><div class="ly">Outra linha</div></div>
  </div></div>

</div></main>
```

### Labels disponíveis

| Classe   | Uso típico          |
|----------|---------------------|
| `intro`  | Introdução          |
| `verso`  | Verso               |
| `pre`    | Pré-Refrão          |
| `refrao` | Refrão              |
| `ponte`  | Ponte / 2ª parte    |
| `solo`   | Solo instrumental   |
| `final`  | Final / Coda        |

---

## Acervo atual — database/songs.js

| Artista                              | Título                          | Tom |
|--------------------------------------|---------------------------------|-----|
| Aline Barros                         | Santidade                       | Bb  |
| Florianópolis House of Prayer        | A Boa Parte                     | E   |
| Florianópolis House of Prayer        | Tu És / Águas Purificadoras     | D   |
| Gabriela Rocha                       | Lugar Secreto                   | Am  |
| Ipalpha                              | Ajuntamento                     | C   |
| Julia Vitória feat. Gabriela Rocha   | Tuas Águas                      | Gm  |
| Julliany Souza feat. Léo Brandão     | Deus É Quem Me Fortalece        | F#  |
| Ministério Avivah                    | Maranata                        | Cm  |
| Ministério Ipiranga                  | A Última Chance                 | G   |
| O Canto das Igrejas                  | Tu És Deus (A Ele)              | A   |
| Rachel Novaes feat. Thamires Garcia  | Minh'alma Engrandece / Adorado  | C   |
| Trazendo a Arca                      | Leva-me Além                    | D   |
| Vineyard                             | Quebrantado                     | C   |

---

## Regras de nomeação de arquivos

- Minúsculas, underline, sem acentos: `a_ultima_chance.html`
- Sem espaços, sem números no início

---

## Transposição

- Tom original lido de `data-tom` no `<body>`
- JS salva `data-orig` em cada `.ch`/`.co` e sempre retranspõe a partir do original
- Preferência por bemóis (Bb, Eb, Ab…) nos tons que usam acidentes

---

## index.html — como funciona

`index.html` carrega `database/songs.js` via `<script>` (não fetch — evita erro CORS
no protocolo `file://`) e gera o HTML do menu em tempo de execução. Nunca escreva
cards de músicas direto no HTML; edite apenas `database/songs.js`.
