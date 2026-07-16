# Customer domain

## Papel desta documentacao

Esta documentacao registra o entendimento de dominio sobre `Customer`.
Ela e a fonte canonica para linguagem de negocio, regras, decisoes e
descobertas obtidas com especialistas de dominio.

Esta documentacao nao e uma especificacao tecnica de API, banco de dados
ou interface. Detalhes tecnicos devem ser derivados deste entendimento e
registrados em documentos apropriados quando necessario.

## Entendimento consolidado

`Customer` e o registro comercial central do CRM desde o primeiro contato.
Ele representa uma empresa ou pessoa fisica com quem existe, ou pode vir
a existir, uma relacao comercial.

Um `Customer` pode existir antes de venda, pedido, financeiro,
oportunidade, historico comercial maduro ou dados fiscais completos. O
sistema deve permitir cadastro progressivo: o registro pode nascer com
poucas informacoes e ser enriquecido conforme a relacao comercial evolui.

Esse desenho atende usuarios acostumados com planilhas, cadastros simples
e acompanhamento operacional direto. O objetivo inicial e capturar o
registro rapidamente sem exigir decisoes ou dados que talvez ainda nao
existam.

## Fronteiras de dominio

### Customer

`Customer` representa a identidade comercial em torno da qual o CRM
organiza oportunidades, orcamentos, pedidos, vendas, financeiro,
contatos, enderecos, historico comercial e relatorios.

Se o sistema acompanha uma relacao comercial em torno de uma empresa ou
pessoa, essa empresa ou pessoa e um `Customer`.

### Pipeline

Classificacoes como lead, prospect, etapa de negociacao, ganho, perdido
ou maturidade comercial nao fazem parte do status de `Customer`.

Esses conceitos pertencem a um futuro dominio `Pipeline` ou `Sales`.
`Customer` permanece a identidade comercial base; `Pipeline` ou `Sales`
podem acompanhar a evolucao comercial dessa identidade.

### Financeiro, credito e venda

Dominios como financeiro, credito, pedidos, vendas e emissao podem impor
regras proprias antes de executar operacoes sensiveis.

Esses dominios podem consultar dados de `Customer`, como `status`,
canais, enderecos e perfil fiscal/legal. A regra de bloquear ou permitir
uma operacao pertence ao dominio que executa a operacao, nao ao cadastro
basico de `Customer`.

## Cadastro progressivo

O cadastro inicial de um `Customer` deve exigir apenas `name`.

Outros dados podem ser preenchidos depois:

- `email`;
- `phone`;
- enderecos;
- contatos;
- dados fiscais e legais;
- observacoes.

O sistema deve permitir salvar um `Customer` incompleto. Dados ausentes
podem gerar alertas, filtros, pendencias de completude e proximos passos,
mas nao devem bloquear a existencia do cadastro.

## Nome do Customer

`name` e o nome operacional principal do `Customer`.

Ele e o identificador humano usado em telas, buscas, listagens e fluxos
operacionais. Pode representar nome fantasia, nome da pessoa fisica,
razao social quando for o unico dado conhecido, ou o nome usado pelo
vendedor em uma planilha.

`name` nao precisa ser legalmente preciso. Nome legal, CPF, CNPJ e outros
dados fiscais pertencem ao perfil fiscal/legal opcional do `Customer`.

## Empresa e pessoa fisica

`Customer` permanece um conceito generico. Ele pode representar empresa
ou pessoa fisica, mas o cadastro inicial nao deve obrigar o usuario a
classificar o registro.

Uma classificacao futura entre empresa e pessoa fisica pode surgir no
perfil fiscal/legal, especialmente quando CPF, CNPJ ou nome legal forem
informados.

## Status

`Customer.status` representa a condicao operacional do cadastro, nao a
maturidade comercial da negociacao.

Valores iniciais:

- `active`: registro em uso normal.
- `inactive`: registro mantido, mas fora do uso corrente.
- `archived`: registro preservado para historico e removido das
  listagens padrao.
- `blocked`: registro marcado para impedir ou revisar operacoes
  sensiveis em outros dominios.

Dentro do dominio `Customer`, todos os status permitem manutencao
cadastral. Um `Customer` `blocked`, `inactive` ou `archived` ainda pode
ter seus dados corrigidos, contatos mantidos, enderecos atualizados e
observacoes editadas.

`blocked` nao bloqueia operacoes do proprio dominio `Customer`. Ele deve
ser interpretado por dominios como financeiro, credito, vendas, pedidos
ou emissao quando esses dominios decidirem se uma operacao sensivel pode
prosseguir.

## Listagem e visibilidade

Listagens operacionais de `Customer` devem mostrar `active` por padrao.

O usuario deve poder incluir registros `inactive`, `blocked` e
`archived` quando desejar consultar dados fora do uso corrente.

`archived` nao significa exclusao. Um `Customer` arquivado permanece
preservado e pode voltar para `active`.

## Exclusao e arquivamento

O dominio `Customer` nao deve ter exclusao definitiva como fluxo
operacional normal.

Como `Customer` pode estar ligado a oportunidades, orcamentos, vendas,
financeiro, contatos, enderecos e relatorios, apagar definitivamente
prejudica historico, auditoria e rastreabilidade.

Quando o registro nao deve mais aparecer no uso corrente, o fluxo correto
e arquivar.

## Duplicidade

`Customer.name` pode se repetir.

O dominio nao deve bloquear cadastro apenas por nome, pois podem existir
filiais, empresas com nomes parecidos, homonimos ou cadastros ainda
incompletos.

Sinais de duplicidade sao avisos, nao erros. O sistema deve avisar o
usuario quando encontrar possiveis duplicidades, mas a decisao de criar,
manter, corrigir ou consolidar registros pertence ao usuario.

Sinais iniciais de duplicidade podem usar:

- nome;
- email;
- telefone;
- documento fiscal quando existir.

## Completude cadastral

O dominio deve reconhecer que um `Customer` pode estar incompleto.

Incompletude cadastral nao impede a existencia do registro. Ela orienta
alertas, filtros, revisoes e proximos passos.

Critérios iniciais de completude:

- possui canal principal (`email` ou `phone`);
- possui ao menos um endereco.

CPF, CNPJ e outros dados fiscais nao fazem parte da completude cadastral
inicial exibida ao usuario. Eles podem ser exigidos por dominios
especificos, como venda, financeiro, credito ou emissao, quando forem
necessarios para executar uma operacao.

## Canais principais

`Customer` pode ter canais principais proprios:

- `email`;
- `phone`.

Esses canais existem alem dos canais dos contatos vinculados. Eles
permitem cadastro simples quando o usuario possui apenas um email ou
telefone principal do `Customer`, sem uma pessoa especifica associada.

O dominio nao diferencia telefone comum de WhatsApp nesta etapa.

## Contatos

`Contact` representa uma pessoa vinculada a um `Customer`.

Um `Customer` pode ter varios `Contact`. Cada `Contact` pertence a
exatamente um `Customer`.

Mesmo que a mesma pessoa se relacione com mais de um `Customer`, ela deve
ser registrada como contatos distintos, um para cada relacionamento
comercial. O relacionamento com o `Customer` importa mais que uma
identidade global de pessoa nesta etapa.

Cada contato possui um unico papel inicial:

- `commercial`;
- `financial`;
- `other`.

Se uma pessoa exerce mais de um papel, o usuario escolhe o papel mais
util ou usa `other` ate o dominio provar que precisa de multiplos papeis
por contato.

Contato pode ter canais proprios, como email e telefone, alem de notas
curtas sobre aquele relacionamento.

## Enderecos

Um `Customer` pode ter varios enderecos.

Cada endereco pertence a exatamente um `Customer`. Mesmo que dois
`Customers` compartilhem a mesma localizacao fisica, cada um deve possuir
seu proprio registro de endereco.

Um `Customer` pode ter mais de um endereco do mesmo tipo. Quando
necessario, um endereco pode ser marcado como padrao para indicar qual
deve ser usado primeiro.

Tipos iniciais:

- `main`;
- `shipping`;
- `billing`;
- `other`.

Deve existir no maximo um endereco padrao nao removido por `Customer`.

## Remocao de contatos e enderecos

Contatos e enderecos pertencem ao `Customer`, mas podem ser referenciados
por historico futuro em vendas, pedidos, financeiro, entregas ou outras
operacoes.

Quando nao houver historico dependente, a remocao pode apagar o contato
ou endereco definitivamente.

Quando houver historico dependente, a remocao deve preservar o registro e
oculta-lo dos fluxos operacionais padrao.

## Perfil fiscal/legal

Dados fiscais e legais pertencem ao `Customer` como dados mestres
opcionais, mesmo que ainda nao sejam obrigatorios no cadastro inicial.

Exemplos de dados desse perfil:

- nome legal;
- CPF;
- CNPJ;
- inscricao estadual;
- indicador de contribuinte;
- endereco fiscal;
- outros dados exigidos por emissao, credito, venda ou financeiro.

`Customer` deve ser o lugar canonico para armazenar esses dados quando
eles forem modelados. Outros dominios podem decidir quando eles sao
obrigatorios para executar uma operacao especifica.

## Observacoes

`Customer` pode ter observacoes gerais.

Observacoes servem para contexto livre e rapido, semelhante ao uso de uma
coluna em planilha.

Historico de interacoes comerciais, como ligacoes, reunioes, follow-ups,
atividades e proximas acoes, nao deve ser modelado apenas como
observacao do `Customer`. Esse historico deve pertencer a um dominio ou
modulo proprio quando for necessario.

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
- Duplicidades devem gerar aviso visivel ao usuario, mas nao devem
  bloquear criacao ou atualizacao.

## Decisoes de dominio

- `Customer` e o registro central desde o primeiro contato.
- `Customer` pode representar empresa ou pessoa fisica.
- O cadastro inicial exige apenas `name`.
- `Customer` permanece generico; a distincao empresa/pessoa fisica pode
  surgir futuramente no perfil fiscal/legal.
- `status` representa apenas condicao operacional do cadastro.
- Lead, prospect, etapas de negociacao e demais estados comerciais ficam
  fora deste dominio e devem ser tratados em `Pipeline` ou `Sales`.
- `blocked` nao bloqueia manutencao cadastral dentro do dominio
  `Customer`.
- Regras de bloqueio aplicadas por outros dominios quando
  `Customer.status` for `blocked` devem ser documentadas explicitamente
  nos respectivos dominios.
- O sistema deve preferir arquivamento em vez de exclusao definitiva.
- Duplicidades sao avisos, nao erros, e devem ser comunicadas ao usuario.
- Contatos e enderecos pertencem exclusivamente a um `Customer`.
- Contato possui um unico papel inicial.
- Endereco pode repetir tipo, mas deve existir no maximo um endereco
  padrao nao removido por `Customer`.
- Remocao de contatos e enderecos apaga registros sem dependencias e
  oculta registros com historico dependente.
- O dominio deve permitir cadastros incompletos e nomes repetidos.
- Completude cadastral inicial acompanha canal principal e endereco.
- Dados fiscais e legais sao dados mestres opcionais de `Customer`, mas
  sua obrigatoriedade operacional pertence aos dominios que os exigem.
