import { BaseController, Middleware } from 'swapi-helpers'
import { Swapi } from 'swapi-utils'

const { CorsMiddleware } = Middleware

const getPlanetRepositorys = () => {
  return new Promise(
    (resolve, reject) => {
      Swapi.getPlanetRepositorys(data => resolve(data))
    }
  )
}

class PlanetController extends BaseController {
  constructor(unitOfWork) {
    super()
    this.unitOfWork = unitOfWork

    return this
  }

  init(event, context, callback) {
    this.middleware(CorsMiddleware)

    return super.init(event, context, callback)
  }

  async handle(event, context, callback) {
    const method = this.request.method()
    var operation = null

    switch (method) {
      case 'GET':
        operation = await this.get()
        break
      case 'POST':
        operation = await this.create()
        break
      case 'PATCH':
        operation = await this.update()
        break
      case 'DELETE':
        operation = await this.remove()
        break
      default:
        res.status(500).send({ error: 'Method not supported!' })
        break
    }

    return operation
  }

  async get() {
    const { PlanetRepository } = this.unitOfWork
    const filters = this.request.query()
    const planets = await PlanetRepository.get(filters)
    const planetsApi = await getPlanetRepositorys()

    return {
      ...planetsApi,
      results: planetsApi.results.concat(planets)
    }
  }

  async getById() {
    const { PlanetRepository } = this.unitOfWork
    const { id } = this.request.path()
    const planet = await PlanetRepository.getById(id)

    return planet
  }

  async create() {
    const { PlanetRepository } = this.unitOfWork
    const planet = this.request.post()

    const planetSaved = await PlanetRepository.create(planet)

    return planetSaved
  }

  async update() {
    const { PlanetRepository } = this.unitOfWork
    const { id } = this.request.path()
    const planet = this.request.post()

    const rowUpdate = await PlanetRepository.update(id, planet)

    if (rowUpdate) {
      const planetUpdated = await PlanetRepository.getById(id)

      return planetUpdated
    }

    return {}
  }

  async remove() {
    const { PlanetRepository } = this.unitOfWork
    const { id } = this.request.path()

    const planet = await PlanetRepository.remove(id)

    return planet
  }
}

export default PlanetController 