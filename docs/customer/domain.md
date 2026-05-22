# Customer domain

## Papel desta documentacao

Esta documentacao registra o entendimento de dominio sobre `Customer`.
Ela deve servir como fonte canonica para linguagem de negocio, regras,
decisoes e descobertas obtidas com especialistas de dominio.

Esta documentacao nao e uma especificacao tecnica de API, banco de dados
ou interface. Detalhes tecnicos devem ser derivados deste entendimento e
registrados nos documentos apropriados quando necessario.

## Entendimento consolidado

`Customer` e o registro comercial central do sistema desde o primeiro
contato. Ele pode representar uma empresa ou uma pessoa fisica, mesmo
antes de existir venda, pedido, financeiro ou relacionamento comercial
maduro.

O `Customer` concentra os dados usados para orcamentos, pedidos,
acompanhamento, oportunidades, vendas, historico comercial e relatorios.
Por isso, ele e um dos dados de maior valor do CRM.

O sistema deve permitir cadastro progressivo. Um `Customer` pode nascer
com poucas informacoes e ser enriquecido conforme a relacao comercial
evolui. Essa decisao reflete o perfil dos usuarios esperados: pessoas
acostumadas com planilhas, cadastros simples e acompanhamento operacional
direto.

## Fronteiras de dominio

### Customer

`Customer` representa a empresa ou pessoa com quem existe, ou pode vir a
existir, uma relacao comercial.

Se o sistema acompanha oportunidades, orcamentos, pedidos, vendas,
financeiro ou historico comercial em torno de uma entidade, essa entidade
e um `Customer`.

### Contact

`Contact` representa uma pessoa vinculada a um `Customer`.

Um contato existe para comunicacao, acompanhamento comercial, financeiro
ou outro relacionamento operacional dentro daquele `Customer`.

Exemplos:

- Uma empresa chamada "ACME Ltda" e um `Customer`; Joao do financeiro e
  um `Contact`.
- Uma pessoa fisica chamada "Maria Silva" pode ser um `Customer`; uma
  pessoa que decide, paga ou recebe em nome dela pode ser um `Contact`.

### Pipeline

Classificacoes comerciais como lead, prospect e estagios de negociacao
nao fazem parte do status de `Customer` neste momento.

O acompanhamento de maturidade comercial, board, etapas de negociacao e
evolucao de oportunidades pertence ao futuro dominio `Pipeline`.

## Cadastro progressivo

O cadastro inicial de um `Customer` deve exigir apenas `name`.

Outros dados podem ser preenchidos depois, conforme forem descobertos:

- `email`;
- `phone`;
- enderecos;
- contatos;
- dados fiscais;
- observacoes.

O sistema deve permitir salvar um `Customer` incompleto. Dados ausentes
podem gerar alertas, filtros ou pendencias de completude, mas nao devem
bloquear a existencia do cadastro.

## Nome do Customer

`name` e o nome operacional principal do `Customer`.

Ele e o identificador humano usado em telas, buscas, listagens e fluxos
operacionais. Pode representar nome fantasia, nome da pessoa fisica,
razao social quando for o unico dado conhecido, ou o nome usado pelo
vendedor em uma planilha.

`name` nao precisa ser legalmente preciso. Dados legais, quando
necessarios, devem ser tratados separadamente.

## Status

`Customer` possui uma propriedade `status`.

O `status` representa a condicao operacional do cadastro, nao a maturidade
comercial da negociacao.

Valores iniciais:

- `active`: registro em uso normal.
- `inactive`: registro mantido, mas fora do uso corrente.
- `archived`: registro preservado para historico e removido das
  listagens padrao.
- `blocked`: registro marcado para impedir operacoes sensiveis em outros
  dominios.

Dentro do dominio `Customer`, todos os status permitem manutencao
cadastral. Um `Customer` `blocked`, `inactive` ou `archived` ainda pode
ter seus dados corrigidos, contatos mantidos, enderecos atualizados e
observacoes editadas.

O status `blocked` nao bloqueia operacoes do proprio dominio `Customer`.
Ele deve ser usado por outros dominios, como credito, vendas, pedidos ou
financeiro, para decidir se uma operacao sensivel pode prosseguir.

## Listagem e visibilidade

Listagens operacionais de `Customer` devem mostrar `active` por padrao.

O usuario deve poder incluir registros `inactive`, `blocked` e
`archived` quando desejar consultar dados fora do uso corrente.

`archived` nao significa exclusao. Um `Customer` arquivado permanece
preservado e pode voltar para `active`.

## Exclusao e arquivamento

O dominio `Customer` nao deve ter exclusao definitiva como fluxo
operacional.

Como `Customer` pode estar ligado a oportunidades, orcamentos, vendas,
financeiro, contatos e relatorios, apagar definitivamente prejudica
historico, auditoria e rastreabilidade.

Quando o registro nao deve mais aparecer no uso corrente, o fluxo correto
e arquivar.

## Duplicidade

`Customer` pode ter `name` repetido.

O dominio nao deve bloquear cadastro apenas por nome, pois podem existir
filiais, empresas com nomes parecidos, homonimos ou cadastros ainda
incompletos.

O sistema pode ajudar a detectar possiveis duplicidades usando dados como
nome, telefone, email ou documento quando existirem, mas isso deve ser
tratado como alerta ou revisao, nao como bloqueio automatico.

## Contatos

Um `Customer` pode ter varios `Contact`.

Cada `Contact` pertence a exatamente um `Customer`. Mesmo que a mesma
pessoa se relacione com mais de um `Customer`, ela deve ser registrada
como contatos distintos, um para cada relacionamento comercial.

Cada contato possui um unico papel inicial.

Tipos iniciais de contato:

- `commercial`;
- `financial`;
- `other`.

## Canais principais

`Customer` pode ter canais principais de contato proprios:

- `email`;
- `phone`.

Esses canais existem alem dos canais dos contatos vinculados. Eles
permitem cadastro simples quando o usuario possui apenas um email ou
telefone principal do `Customer`, sem uma pessoa especifica associada.

O dominio nao diferencia telefone comum de WhatsApp nesta etapa.

## Enderecos

Um `Customer` pode ter varios enderecos.

Cada endereco pertence a exatamente um `Customer`. Mesmo que dois
`Customers` compartilhem a mesma localizacao fisica, cada um deve possuir
seu proprio registro de endereco.

Um `Customer` pode ter mais de um endereco do mesmo tipo. Quando
necessario, um endereco pode ser marcado como padrao para determinada
finalidade.

Tipos iniciais sugeridos:

- principal;
- entrega;
- cobranca;
- outro.

## Dados fiscais

Dados fiscais nao sao obrigatorios no cadastro inicial de `Customer`.

Para operacoes de venda, pedido, credito ou financeiro, outros dominios
podem exigir dados cadastrais completos, como:

- nome legal;
- CPF ou CNPJ;
- endereco;
- telefone;
- email.

Informacoes fiscais adicionais, como inscricao estadual, indicador de
contribuinte ou outros dados legais, podem ser evoluidas no futuro, mas
nao fazem parte do escopo inicial deste dominio.

Outros dominios podem exigir esses dados para executar operacoes
especificas, como venda, pedido, emissao, financeiro ou credito. Essa
exigencia pertence ao dominio que executa a operacao, nao ao cadastro
basico de `Customer`.

## Completude cadastral

O dominio deve reconhecer que um `Customer` pode estar incompleto.

Incompletude cadastral nao impede a existencia do registro. Ela deve
orientar alertas, filtros, revisoes e proximos passos.

Exemplos de pendencias:

- sem `email` e sem `phone`;
- sem endereco.

Dados como CPF e CNPJ nao fazem parte dos criterios iniciais de
completude cadastral exibidos ao usuario. Eles devem ser exigidos apenas
quando forem necessarios para realizar venda ou outras operacoes em
dominios especificos.

## Observacoes

`Customer` pode ter observacoes gerais.

Observacoes servem para contexto livre e rapido, semelhante ao uso de uma
coluna em planilha.

Historico de interacoes comerciais, como ligacoes, reunioes, follow-ups e
atividades, nao deve ser modelado apenas como observacao do `Customer`.
Esse historico deve pertencer a um dominio ou modulo proprio quando for
necessario.

## Descobertas de entrevistas

- Usuarios esperados estao acostumados com planilhas, cadastros simples e
  acompanhamento operacional direto.
- O cadastro deve comecar rapido e aceitar poucos dados.
- A qualidade do cadastro melhora conforme o relacionamento com o
  `Customer` evolui.
- A interface operacional deve favorecer edicao rapida, listagens densas,
  filtros e alteracoes leves.
- `Customer` e um dado central para acompanhar conversao, vendas,
  oportunidades e historico comercial.

## Decisoes de dominio

- `Customer` e o registro central desde o primeiro contato.
- `Customer` pode representar empresa ou pessoa fisica.
- O cadastro inicial exige apenas `name`.
- `status` representa apenas condicao operacional do cadastro.
- Lead, prospect e estagios de negociacao ficam fora deste dominio por
  enquanto e devem ser tratados no dominio `Pipeline`.
- `blocked` nao bloqueia manutencao cadastral dentro do dominio
  `Customer`.
- Regras de bloqueio aplicadas por outros dominios quando
  `Customer.status` for `blocked` devem ser documentadas explicitamente
  nos respectivos dominios, nao neste documento.
- O sistema deve preferir arquivamento em vez de exclusao.
- Contatos e enderecos pertencem exclusivamente a um `Customer`.
- Contato possui um unico papel inicial.
- O dominio deve permitir cadastros incompletos e nomes repetidos.