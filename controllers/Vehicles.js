import { BaseController, Middleware } from 'swapi-helpers'
import { Swapi } from 'swapi-utils'

const { CorsMiddleware } = Middleware

const getVehicleRepositorys = () => {
  return new Promise(
    (resolve, reject) => {
      Swapi.getVehicleRepositorys(data => resolve(data))
    }
  )
}

class VehiclesController extends BaseController {
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
    const { VehicleRepository } = this.unitOfWork
    const filters = this.request.query()
    const vehicles = await VehicleRepository.get(filters)
    const vehiclesApi = await getVehicleRepositorys()

    return {
      ...vehiclesApi,
      results: vehiclesApi.results.concat(vehicles)
    }
  }

  async getById() {
    const { VehicleRepository } = this.unitOfWork
    const { id } = this.request.path()
    const vehicle = await VehicleRepository.getById(id)

    return vehicle
  }

  async create() {
    const { VehicleRepository } = this.unitOfWork
    const vehicle = this.request.post()

    const vehicleSaved = await VehicleRepository.create(vehicle)

    return vehicleSaved
  }

  async update() {
    const { VehicleRepository } = this.unitOfWork
    const { id } = this.request.path()
    const vehicle = this.request.post()

    const rowUpdate = await VehicleRepository.update(id, vehicle)

    if (rowUpdate) {
      const vehicleUpdated = await VehicleRepository.getById(id)

      return vehicleUpdated
    }

    return {}
  }

  async remove() {
    const { VehicleRepository } = this.unitOfWork
    const { id } = this.request.path()

    const vehicle = await VehicleRepository.remove(id)

    return vehicle
  }
}

export default VehiclesController