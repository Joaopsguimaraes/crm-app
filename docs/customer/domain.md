# Customer domain

## Overview

Nesta doc vamos tratar sobre o domínio de customer. É a área de conhecimento, o negócio ou o problema que o software tenta resolver. Customer é o dado de maior valor da empresa e software, pois é para ele que deve ser feito os orçamentos, pedidos, acompanhamento, evolução, oportunidade e etc. Pensando no conceito que deverá ser o software, que é praticamente um merge entre CRM e Sales Force. Pois teremos a evolução do lead pelo board até o pedido ser gerado, o customer é o item de maior valor para dados, pois devemos saber a conversão desse customer.

## Annotations

- Devemos lembrar que o customer sempre vai ter uma evolução dentro do CRM, devemos iniciar o cadastro do customer somente com o nome e 'contato' esse contato podendo ser email ou telefone(whatsApp) pois nesse ponto ele pode ser um lead ou contato dentro do CRM, pois terá evolutiva até se tornar um cliente de fato que é aonde terá pedido, financeiro e etc.
- Customer pode ter vários endereços, porem um endereço deve pertencer a somente um customer, exemplo: Customer tem endereço principal, localizado em: "Address line 1: Rua 13, Address line 2, Qd. 24 Lt. 14 neighborhood: Central, City: Sao Paulo, State: Sao Paulo, ZipCode: 99999-999" e pode ter outros endereços, como endereço de entrega e 'outros'
- Customer pode ter vários contatos, sendo contato classificado como financeiro, comercial, diretoria e entre outros, por isso dentro de customer podemos ter varias "pessoas" que são os contatos
- Customer pode ter seu email, mesmo que o customer tenha contatos, ele pode ter seu próprio email de contato, sendo email da empresa ou em caso de customers menores email principal.
- Customer pode ter seu próprio telefone de contato, mesmo que o customer tenha contatos, ele pode ter seu contato como WhatsApp ou apenas um numero de contato
- Devemos sempre lembrar que os clientes da plataforma são clientes que são acostumados com planilhas e cadastros e acompanhamento simples, que inicia o cadastro com poucos dados e o vai evoluindo de acordo com o contato com o customer, por isso devemos lembrar no ato do cadastro essa simplicidade de dados e esse ponto que o cliente é acostumado com planilhas, deve ser considerado na montagem da UI datagrid com colunas editáveis e requisições dessas leves alterações.
