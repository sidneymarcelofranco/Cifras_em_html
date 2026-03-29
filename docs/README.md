# Portal Cifras — Visão Geral

Visualizador de cifras para uso em igrejas, otimizado para tablets e celulares em ambientes de baixa luminosidade.

## Contexto

Cada música tem seu próprio arquivo `.html` dentro de `songs/`. O `index.html` na raiz serve como menu de navegação entre as músicas. Não há backend, framework ou build step — tudo é HTML/CSS/JS puro.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Markup | HTML5 semântico |
| Estilo | CSS3 com variáveis (`css/cifra.css`) |
| Lógica | Vanilla JS (`js/cifra.js`) |
| Fonte | Georgia (títulos) + Courier New (acordes) |

## Estrutura de arquivos

```
Cifras_em_html/
├── index.html              # Menu principal com cards das músicas
├── css/
│   └── cifra.css           # Único stylesheet global
├── js/
│   └── cifra.js            # Único script global
├── songs/                  # Um arquivo HTML por música
│   ├── a_boa_parte.html
│   ├── ajuntamento.html
│   ├── deus_e_quem_me_fortalece.html
│   ├── leva_me_alem.html
│   ├── lugar_secreto.html
│   ├── minha_alma_engrandece.html
│   ├── santidade.html
│   └── tu_es_deus_a_ele.html
└── docs/                   # Esta documentação
    ├── README.md           # Este arquivo
    ├── patterns.md         # Padrões HTML/CSS/JS do projeto
    ├── adding-songs.md     # Como adicionar novas músicas
    └── prompt_cifra.md     # Prompt para gerar cifras via IA
```

## Músicas cadastradas

| Arquivo | Título | Tom | Artista |
|---------|--------|-----|---------|
| a_boa_parte.html | A Boa Parte | E | Florianópolis HoP |
| ajuntamento.html | Ajuntamento | C | Ipalpha |
| deus_e_quem_me_fortalece.html | Deus É Quem Me Fortalece | F# | Julliany Souza |
| leva_me_alem.html | Leva-me Além | D | Trazendo a Arca |
| lugar_secreto.html | Lugar Secreto | Am | Gabriela Rocha |
| minha_alma_engrandece.html | Minh'alma Engrandece / Adorado | C | Rachel Novaes |
| santidade.html | Santidade | Bb | Aline Barros |
| tu_es_deus_a_ele.html | Tu És Deus (A Ele) | A | O Canto das Igrejas |

## Funcionalidades

- **Transposição em tempo real** — todos os 12 semitons, sem reload
- **Navegação por seções** — setas, swipe ou clique direto na seção
- **Zoom de fonte** — ajuste independente via toolbar
- **Layout 1 ou 2 colunas**
- **Modo tela cheia**
- **Modo só letra** — oculta os acordes

## Atalhos de teclado

| Tecla | Ação |
|-------|------|
| `←` / `→` | Seção anterior / próxima |
| `+` / `-` | Zoom +/- |
| `S` | Transpor +1 semitom (sustenido) |
| `B` | Transpor -1 semitom (bemol) |
| `F` | Fullscreen |
| `L` | Toggle só letra |

## Tema de cores

| Uso | Valor |
|-----|-------|
| Fundo principal | `#111827` |
| Texto | `#f9fafb` |
| Destaque (ouro) | `#fbbf24` |
| Card / header | `#1f2937` |
