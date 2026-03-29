# Como adicionar uma nova música

## 1. Gerar o HTML via IA

Use o `prompt_cifra.md` desta pasta como prompt no Claude ou ChatGPT. Forneça:
- Nome da música e artista
- Tom original
- Letra completa com acordes (pode copiar do CifraClub)

O modelo vai gerar o arquivo `.html` completo, pronto para usar.

## 2. Salvar o arquivo

Coloque o arquivo gerado em `songs/` com nome em minúsculas e underline:

```
songs/nome_da_musica.html
```

## 3. Verificar os caminhos

O arquivo deve ter estes caminhos (com `../` por estar dentro de `songs/`):

```html
<link rel="stylesheet" href="../css/cifra.css">
<a href="../index.html" class="tb-btn">⌂</a>
<script src="../js/cifra.js"></script>
```

Se o arquivo foi gerado com `css/cifra.css` (sem `../`), corrija antes de salvar.

## 4. Adicionar card no index.html

Abra `index.html` na raiz e adicione um bloco no grupo de artista correto (ou crie um novo):

```html
<section class="artist"><h2>Nome do Artista</h2></section>
<a class="card" href="songs/nome_da_musica.html">
  <h3>Nome da Música</h3>
  <p>Tom: X</p>
</a>
```

> Os artistas estão em ordem alfabética.

## 5. Validar

Abra o `index.html` no navegador, clique na música e confirme:
- [ ] Título aparece completo no header
- [ ] Tom inicial está correto (ex: "A", "F#", "Bb")
- [ ] Acordes aparecem alinhados acima das sílabas
- [ ] Navegação por seções funciona (↑ ↓)
- [ ] Transposição funciona (S / B)
- [ ] Botão ⌂ volta para o índice

---

## Exemplo de seção completa

```html
<div class="s"><div class="lbl verso">Verso</div><div class="bd">
  <div class="bl"><div class="ch">G              D/F#</div><div class="ly">Primeira linha da letra</div></div>
  <div class="bl"><div class="ch">Em7       C</div><div class="ly">Segunda linha da letra</div></div>
</div></div>
```

## Tipos de label disponíveis

`intro` · `verso` · `pre` · `refrao` · `ponte` · `solo` · `final`

Ver `patterns.md` para as cores e usos de cada um.
