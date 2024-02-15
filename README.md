# Star War API

¡Bienvenido a swapi (extended), la API de Star Wars!.

### Installation 

Instale módulos npm.

```sh
npm install
```

### Setup Environment

Realice una copia del archivo de variables de entorno `(env.example.yml)` y configure las variables correspondientes.
Considere *NODE_ENV* con el valor *"development"* `(Por defecto tendrá este valor)`.

```sh
cp env.example.yml .env.yml
```
```yaml
development:
  DB_USERNAME: ""
  DB_PASSWORD: ""
  DB_DATABASE: ""
  DB_PORT: 3306
  DB_HOST: "localhost"
  DB_DIALECT: "mysql"
  SWAPI_URL: "https://swapi.py4e.com/api/"
```
Será necesario crear una base de datos.

```sql
CREATE DATABASE starwar;
```

### Integration with [SWAPI](https://swapi.py4e.com/documentation)

Dada la arquitectura señalada en el reto, será necesario especiar un API para la integración. Este endpoint podrá especificarse en la variable de entorno *SWAPI_URL* del archivo de configuración `.env.yml`. El que usaremos en este proyecto será `https://swapi.py4e.com/api/`

![Arquitectura](https://i.ibb.co/nbdHq5C/arquitectura.jpg)

### Migrations

Ejecute las migraciones para la creación de tablas. Estas serán creadas en la base de datos especificada en el archivo *.env.yml* `(DB_DATABASE)`

```sh
npx sequelize-cli db:migrate 
```

### Serverless plugins

Plugins de serverless utilizados

| Plugin | Stats |
|:---------------------------|:-----------:|
| **[Webpack - `serverless-webpack`](https://github.com/serverless-heaven/serverless-webpack)** <br/> Serverless plugin to bundle your lambdas with Webpack | ![Github Stars](https://img.shields.io/github/stars/serverless-heaven/serverless-webpack.svg?label=Stars&style=for-the-badge) <br/> ![NPM Downloads](https://img.shields.io/npm/dt/serverless-webpack.svg?label=Downloads&style=for-the-badge)|
| **[Offline - `serverless-offline`](https://github.com/dherault/serverless-offline)** <br/> Emulate AWS λ and API Gateway locally when developing your Serverless project | ![Github Stars](https://img.shields.io/github/stars/dherault/serverless-offline.svg?label=Stars&style=for-the-badge) <br/> ![NPM Downloads](https://img.shields.io/npm/dt/serverless-offline.svg?label=Downloads&style=for-the-badge)|

### Resources
Los recursos implementados son los siguientes:

- films
- people

| resource      | description                       |
|:--------------|:----------------------------------|
| `api/films`      | Listado de peliculas. |
| `api/people`    | A People resource is an individual person or character within the Star Wars universe. |

You can operate on resources using HTTP methods such as `POST`, `GET`, `PUT`, and `DELETE`.

#### Relational Model

La estructura de los recursos de [`SWAPI`](https://swapi.py4e.com/documentation), resulta ser más cercana a un modelo `NoSQL` que a uno relacional. Dado que la base de datos a utilizar es **mysql**, se normalizaron las entidades y sus relaciones. Sin embargo, esto no es transparente para un cliente que consuma el API, pues, se mantiene la estructura mostrada en [`SWAPI`](https://swapi.py4e.com/documentation), pero, solo a nivel de presentación.

Podemos agregar personas`(People)` al crear un recurso `Films`, especificando los **ids** o el **id** de persona(s) `(People)` existente. Esto para todos los hijos de Films `['people', 'planet', 'specie', 'starship', 'vehicle']`

```bash
curl -X POST http://localhost:8082/development/api/films \
    -H "Content-Type: application/json" \
    -d
{
    "director": "Abel Jean Pool Seminario Leon",
    "episode_id": 4,
    "opening_crawl": "It is a period of civil war...",
    "producer": "William S.",
    "release_date": "Now",
    "title": "El retorno infinito",
    "people": 1
}

curl -X POST http://localhost:8082/development/api/films \
    -H "Content-Type: application/json" \
    -d
{
    "director": "Abel Jean Pool Seminario Leon",
    "episode_id": 4,
    "opening_crawl": "It is a period of civil war...",
    "producer": "William S.",
    "release_date": "Now",
    "title": "El retorno infinito",
    "people": [1, 2, 3]
}
```

##### Films

| Resource / HTTP method | Post             | Get         | Patch                  | Delete             |
| ---------------------- | ---------------- | ----------- | ---------------------- | ------------------ |
| `api/films`            | Create new film  | List films  | Error                  | Error              |
| `api/films/{id}`       | Error            | Get film    | Update user if exists  | Delete film        |

`api/films` acepta el parametro **lang**, especificado con el valor **es**, mapea los campos español, por defecto es ingles.

```bash
http://localhost:8082/development/api/films?lang=es
```

##### People

| Resource / HTTP method | Post             | Get         | Patch                  | Delete             |
| ---------------------- | ---------------- | ----------- | ---------------------- | ------------------ |
| `api/people`           | Create new pers  | List pers | Error                  | Error              |
| `api/people/{id}`      | Error            | Get pers  | Update pers if exists| Delete people      |

### Implementation Details

El patrón de software utilizado es `Repository Pattern`. En la capa de persistencia de datos se utilizó *sequelize*. Se implemento una pequeña libreria para el manejo web `(Request.js, Response.js, Middleware.js)`, ubicados en *helpers*. Estas clases abstraen el manejo web (`events` de AWS Lambda) para volverlo lo más parecido a frameworks como **express.js**.

### Start Project 

Se iniciará un emulador de AWS λ en el puerto `8082`. El formato de los endpoint será el siguiente:

```sh
http://{host}:8082/{environment}/api/films
```

```sh
npm start
```

### Scripts & Deploy

Para generar los archivos *CloudFormation* ejecute:

```sh
npm run artifacts
```

Configurando adecuadamente las AWS Credentials, el comando `sls deploy` debería desplegar las API's correctamente.
