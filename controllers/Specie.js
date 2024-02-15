import { BaseController, Middleware } from 'swapi-helpers'
import { Swapi } from 'swapi-utils'

const { CorsMiddleware } = Middleware

const getSpecieRepositorys = () => {
  return new Promise(
    (resolve, reject) => {
      Swapi.getSpecieRepositorys(data => resolve(data))
    }
  )
}

class SpecieController extends BaseController {
  constructor(unitOfwork) {
    super()
    this.unitOfwork = unitOfwork

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
    const { SpecieRepository } = this.unitOfwork
    const filters = this.request.query()
    const species = await SpecieRepository.get(filters)
    const speciesApi = await getSpecieRepositorys()

    return {
      ...speciesApi,
      results: speciesApi.results.concat(species)
    }
  }

  async getById() {
    const { SpecieRepository } = this.unitOfwork
    const { id } = this.request.path()
    const specie = await SpecieRepository.getById(id)

    return specie
  }

  async create() {
    const { SpecieRepository } = this.unitOfwork
    const specie = this.request.post()

    const specieSaved = await SpecieRepository.create(specie)

    return specieSaved
  }

  async update() {
    const { SpecieRepository } = this.unitOfwork
    const { id } = this.request.path()
    const specie = this.request.post()

    const rowUpdate = await SpecieRepository.update(id, specie)

    if (rowUpdate) {
      const specieUpdated = await SpecieRepository.getById(id)

      return specieUpdated
    }

    return {}
  }

  async remove() {
    const { SpecieRepository } = this.unitOfwork
    const { id } = this.request.path()

    const specie = await SpecieRepository.remove(id)

    return specie
  }
}

export default SpecieController