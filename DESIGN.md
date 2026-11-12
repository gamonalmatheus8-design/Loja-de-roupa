# Bully Clothing: direção visual

Registrado a partir do site construído em 11/11/2026. Direção fixada pelo responsável (portfólio criativo): preto, vermelho neon e cromado. Modo da superfície: Persuade (vitrine com sacola).

## Mundo

“Bully Brutalism”: fundo preto puro, tipo condensado gigante, cortes secos, grade visível com linhas de 1 px, nenhum canto arredondado. O neon vermelho e o monograma cromado vêm do portfólio e são os dois materiais da marca. As fotos das camisas ficam em placas claras, como folha de contato.

## Cor

| Token | Valor | Uso |
| --- | --- | --- |
| `--ink` | `#000` | Fundo de tudo |
| `--bone` | `#f2efe9` | Texto e títulos claros |
| `--steel` | `#9a9da3` | Texto secundário |
| `--red` | `#ff2a2a` | Ação principal, faixa, BRUTALISM |
| `--red-core` | `#ff6a60` | Núcleo do neon (com brilho vermelho em volta) |
| `--plate` | `#ebe8e3` | Placa das fotos de produto |
| `--line` | `#2b2b2b` | Linhas da grade |

Estratégia: comprometida. Preto domina, vermelho ocupa regiões inteiras (faixa, botões, tela BULLY da cena). Brilho neon só em “Sobre nós”, lema e Kill Democracy, como no portfólio. Texto preto sobre vermelho; nunca vermelho sobre vermelho.

## Tipografia

| Papel | Fonte | Uso |
| --- | --- | --- |
| Display | League Gothic | Títulos, navegação, botões, sempre em caixa alta |
| Gótica | Manufacturing Consent | Lema, nomes das camisas |
| Texto | Archivo 400, 500, 700 | Parágrafos e avisos |

Fontes servidas da pasta `assets/fonts` (licença OFL). O título da abertura é ajustado por script para ocupar a largura da coluna.

## Componentes

- **Capa:** monograma vermelho centrado, brilho que segue o ponteiro, aviso “Clique para entrar”.
- **Cena de entrada:** soco e tremor, estouro de estrelas em canvas que fogem do ponteiro, “Fly High.”, “Dream Higher.”, tela vermelha “BULLY”, estrela que abre o site. Botão “Pular” e tecla Esc.
- **Botão:** bloco vermelho, texto preto, sem raio. Hover vira claro.
- **Peça:** placa quadrada com frente e costas, etiqueta do lado mostrado, nome em gótica, tamanhos em quadrados de 46 px, botão de sacola.
- **Sacola:** `dialog` lateral direito com quantidade, remover e aviso de pagamento não ligado.
- **Faixa:** nomes das camisas e lema em movimento; acelera com a rolagem.
- **Cursor:** estrela em modo diferença; cresce sobre itens clicáveis. Só em ponteiro fino.

## Movimento

Curva única de saída: `cubic-bezier(.16, 1, .3, 1)`. A cena de entrada é o momento autoral; o resto são respostas ao ponteiro (inclinação 3D, letras que esticam, faíscas no clique). Com “reduzir movimento” ligado, a capa abre direto e nada anima. `?motion=on` força o movimento para teste.

## Acessibilidade e limites

- Contraste de texto acima de 4,5:1; foco visível em tudo; alvos de toque de 44 px ou mais.
- Capa é um botão; a cena pode ser pulada; link com `#seção` pula a capa.
- Sem cantos arredondados, sem degradê em texto, sem vidro, sem ícones de emoji.
- Não inventar preço, data, estoque, contatos ou redes sociais.
