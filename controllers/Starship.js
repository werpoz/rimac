import { BaseController, Middleware } from 'swapi-helpers'
import { Swapi } from 'swapi-utils'

const { CorsMiddleware } = Middleware

const getStarshipRepositorys = () => {
  return new Promise(
    (resolve, reject) => {
      Swapi.getStarshipRepositorys(data => resolve(data))
    }
  )
}

class StarshipController extends BaseController {
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
    const { StarshipRepository } = this.unitOfWork
    const filters = this.request.query()
    const starships = await StarshipRepository.get(filters)
    const starshipsApi = await getStarshipRepositorys()

    return {
      ...starshipsApi,
      results: starshipsApi.results.concat(starships)
    }
  }

  async getById() {
    const { StarshipRepository } = this.unitOfWork
    const { id } = this.request.path()
    const starship = await StarshipRepository.getById(id)

    return starship
  }

  async create() {
    const { StarshipRepository } = this.unitOfWork
    const starship = this.request.post()

    const starshipSaved = await StarshipRepository.create(starship)

    return starshipSaved
  }

  async update() {
    const { StarshipRepository } = this.unitOfWork
    const { id } = this.request.path()
    const starship = this.request.post()

    const rowUpdate = await StarshipRepository.update(id, starship)

    if (rowUpdate) {
      const starshipUpdated = await StarshipRepository.getById(id)

      return starshipUpdated
    }

    return {}
  }

  async remove() {
    const { StarshipRepository } = this.unitOfWork
    const { id } = this.request.path()

    const starship = await StarshipRepository.remove(id)

    return starship
  }
}

export default StarshipController