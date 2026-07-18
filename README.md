# Dona Costurice — GitHub Pages

Versão estática e instalável do catálogo da Dona Costurice, preparada para GitHub Pages.

## O que está incluído

- `index.html`: página principal da loja;
- `gestao.html`: apoio para cadastrar produtos, exportar o catálogo e gerar News;
- `data/products.json`: fonte dos produtos exibidos na vitrine;
- `assets/images/products`: fotos dos produtos;
- `assets/css/style.css`: identidade visual;
- `assets/js`: vitrine, sacola, gestão e gerador de News;
- `manifest.webmanifest` e `sw.js`: recursos de PWA;
- `.github/workflows/pages.yml`: publicação automática.

## Publicação inicial — passo a passo

1. Entre em [github.com](https://github.com) e clique em **New repository**.
2. Use um nome como `dona-costurice`.
3. Escolha **Public**. No plano gratuito, essa é a opção mais simples para o GitHub Pages.
4. Não adicione README, `.gitignore` ou licença, pois o pacote já contém esses arquivos.
5. Crie o repositório.
6. Descompacte o arquivo deste projeto no computador.
7. Na página do repositório, clique em **Add file → Upload files**.
8. Envie **o conteúdo da pasta**, garantindo que `index.html` fique na raiz. Não envie apenas o ZIP.
9. Clique em **Commit changes**.
10. Acesse **Settings → Pages**.
11. Em **Build and deployment → Source**, escolha **GitHub Actions**.
12. Abra a aba **Actions** e aguarde o fluxo “Publicar no GitHub Pages” ficar verde.
13. Volte a **Settings → Pages** e clique em **Visit site**.

O endereço padrão será semelhante a:

`https://SEU-USUARIO.github.io/dona-costurice/`

## Atualizar produtos sem alterar o código

### 1. Preparar o catálogo

1. Abra `https://SEU-USUARIO.github.io/dona-costurice/gestao.html`.
2. Preencha nome, categoria, descrição, preço e nome do arquivo da foto.
3. Clique em **Adicionar ao catálogo**.
4. Revise a lista e clique em **Baixar products.json**.

### 2. Enviar a foto

1. No GitHub, abra `assets/images/products`.
2. Clique em **Add file → Upload files**.
3. Envie a foto usando exatamente o nome informado no cadastro, por exemplo `bolsa-floral.jpg`.
4. Confirme em **Commit changes**.

### 3. Publicar o catálogo atualizado

1. No GitHub, abra `data/products.json`.
2. Exclua ou substitua o arquivo antigo pelo `products.json` baixado na gestão.
3. Confirme em **Commit changes**.
4. Aguarde o fluxo da aba **Actions** concluir.

Também é possível clicar no lápis do `products.json` e editar os campos diretamente.

## Gerar uma News

1. Abra `gestao.html` no site publicado.
2. Selecione **Gerar News**.
3. Escolha o produto, a chamada e o tipo de publicação.
4. Clique em **Gerar arte e legenda**.
5. Use **Copiar legenda** e **Baixar arte**.
6. Publique a imagem e a legenda no Instagram.

## Atualizações gerais

- WhatsApp e Instagram: procure por `5581999796165` e `donacosturice_` em `index.html` e `assets/js/gestao.js`.
- Logo: substitua `assets/images/brand/logo.jpg`, mantendo o mesmo nome.
- Foto da proprietária: substitua `assets/images/brand/proprietaria.png`.
- Foto principal: substitua `assets/images/hero-costurice.jpg`.
- Cores: edite as variáveis no início de `assets/css/style.css`.

Após qualquer alteração, faça um **Commit changes**. A publicação será automática.

## PWA

O catálogo pode ser instalado no celular e aberto com aparência de aplicativo. O PWA é útil para:

- criar um atalho com a marca na tela inicial;
- abrir o catálogo mais rapidamente;
- consultar páginas e imagens já visitadas mesmo com conexão instável.

Ele não transforma o GitHub Pages em uma loja com banco de dados. O pedido continua pelo WhatsApp e a manutenção continua por arquivos no GitHub.

Quando alterar estrutura, CSS ou JavaScript, incremente `CACHE_VERSION` no início de `sw.js`, por exemplo de `v1` para `v2`. Isso evita que celulares mantenham arquivos antigos em cache.

## Limitação importante do GitHub Pages

O GitHub Pages é uma hospedagem estática. Por segurança, `gestao.html` não grava diretamente no repositório e não armazena senhas ou tokens. Ele gera o arquivo atualizado para o proprietário substituir no GitHub.

Se for necessário cadastrar produtos com upload direto e publicação imediata, use a versão hospedada com banco de dados ou conecte futuramente um CMS com autenticação.
