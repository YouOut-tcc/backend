# Routes

## 1. /usuario

-  `POST: `
 /login 

`body: `

```
{
    "name": string,
    "email": string,
    "senha" string,
}
```
`response`:

`200:` 
```
{ message: 'Login efetuado com sucesso', token }
```
`401:`
```
{message: 'Login incorreto'}
```
`500:`
```
{message: error}
```
- `POST: `
/cadastro

`body:`
```
{
    "name": string,
    "email": string,
    "password": string,
    "telefone": int
}
```
`response`:

`200:` 
```
{message: "Salvo com sucesso"}
```

`400:`
```
{message: "Nome e/ou email vazios"}
```

`500:` 
```
{message: error}
```
`500:` 
```
{message: "Duplicate entry"}
```

- /oauth
- /token

- `GET: ` /favoritos

`response:`

`200:`

```
{
    [
        {
        "uuid": uuid,
        "criado": date
        }
    ]
}
```
`400:`
```
{message: error}
```
- `GET: `
 /avaliacoes

 `response`

 `200: `
 ```
 {
    [
        {
            "id": int,
            "FK_usuario_id": int,
            "FK_place_id": int,
            "pontuacao": decimal,
            "comentario": string,
            "criado": date
        }
    ]
 }
 ```
 `500: `
 ```
 {message: error}
 ```

- `GET: `/informacoes

`response`

`200:`
```
{
    [
        {

        }
    ]
}
```
`400:`
```
{message: error}
```

## 2. /estabelecimento

- /
- `POST: `/login

`body:`
```
{
    "email": string,
    "password": string
}
```
`response`

`200:`
```
{message: 'Login efetuado com sucesso', token}
```
`400:`
```
{message: 'Login incorreto'}
```
`500:`
```
{message: error}
```
- `POST: `/cadastro

`body: `
```
{
    "name": string,
    "email": string,
    "password": string,
    "telefone": int
}
```

`response`

`200:`
```
{ message: "Salvo com sucesso" }
```
`400:`
```
{ message: `${boolTest} esta vazio` }
```
`500:`
```
{ message: "Duplicate entry" }
```
`500:`
```
{ message: error}
```
- `USE: `/manage

- `USE: `[/:uuid](#uuid)

### 2.1 /:uuid

- `GET: `/informacoes

`response`

`200:`
```
{message: req.place}
```
- `POST: `/avaliar

`body:`
```
{
    "comentario": string,
    "nota": decimal
}
```
`response`

`200:`
```
{ message: "Salvo"}
```
`400:`
```
{ message: "Invalido, falta imformaçao"}
```
`400:`
```
{ message: "Invalido, nota não é uma numero"}
```
`400:`
```
{ message: "Invalido, nota vai de 0 á 5"}
```
`400:`
```
{ message: error}
```
- `GET: `/avaliacoes

`response`

`200:`
```
{
    [
        {
            "id": int,
            "FK_usuario_id": int,
            "FK_place_id": int,
            "pontuacao": decimal,
            "comentario": string,
            "criado": datetime
        }
    ]
}
```
- `POST: `/favoritar 

`response`

`200: `
```
{ message: "Salvo"}
```
`400: `
```
{ message: error}
```
- `GET: `/eventos

`response`

`200:`
```
	{
        [
            {
            "descricao": string,
            "dt_inicio": date,
            "dt_fim": date
	        }
        ]
    }
```
`400:`
```
{Message: error}
```
- `GET: `/promocao

`response`

`200:`
```
{
    [
        {
            "dt_criacao": datetime,
            "dt_vencimento": datetime,
            "descricao": string
	    }
    ]
}
```
`400:`
```
{Message: error}
```
- `GET: `/cupons

`response`

`200:`
```
{
    [
        {
            "dt_criacao": datetime,
            "dt_vencimento": datetime,
            "descricao": string
        }
    ]
}
```

`400:`
{Message: error}

### 2.2. /manage

- `POST: `/request

`body:`
```
{
    "cnpj": int,
    "nome_fantasia": string,
    "nome": string,
    "telefone": int,
    "celular": int,
    "numero": string,
    "bairro": string,
    "cidade": string,
    "cep": int,
    "uf": string,
    "rua": string,
    "latitute": int,
    "longitude": int
}
```

`response`

`200:`
```
{ message: "Salvo"}
```
`400:`
```
{ message: `${boolTest} esta faltando`}
```
`400:`
```
{message: error}
```
- `USE: `/:uuid

#### 2.2.1 /:uuid

- `GET: `/informacoes

`response`

`200:`
```
{message: req.place}
```

- `POST: `/eventos

`body`
```
{
    "descricao": string,
    "inicio": datetime,
    "fim": datetime
}
```

`response`

`200: `
```
{message: "Evento criado"}
```

`400:`
```
{message: error}
```
- `POST: `/promocoes

`body`
```
{
    "dt_fim": datetime,
    "descricao": string
}
```
`response`

`200:`
```
{message: "Promoção criada"}
```
`400:`
```
{message: error}
```

- `POST: `/cupons

`body`
```
{
    "vencimento": datetime,
    "descricao": string
}
```

`response`

`200:`
```
{message: "Cupon criado com sucesso"}
```

`400:`
```
{Message: error}
```

