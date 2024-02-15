import IRepository from './IRepository'

class VehicleRepository extends IRepository {
  constructor(dbContext) {
    super()

    this.dbContext = dbContext

    return this
  }

  async create(vehicle) {
    try {
      const { Vehicle } = this.dbContext
      const vehicleSaved = await Vehicle.create(vehicle)

      return vehicleSaved
    } catch (e) {
      console.log(e)
    }
  }

  async update(id, vehicle) {
    try {
      const { Vehicle } = this.dbContext
      const vehicleSaved = await Vehicle.update(vehicle, { where: { id } })

      return vehicleSaved
    } catch (e) {
      console.log(e)
    }
  }

  async get(filters) {
    try {
      const { Vehicle } = this.dbContext
      const vehicle = await Vehicle.findAll(filters)

      return vehicle
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const { Vehicle } = this.dbContext
      const vehicle = await Vehicle.findOne({ where: { id } })

      return vehicle
    } catch (e) {
      console.log(e)
    }
  }

  async remove(id) {
    const { Vehicle } = this.dbContext
    const vehicle = await Vehicle.findOne({ where: { id } })

    await Vehicle.destroy({ where: { id } })

    return vehicle
  }
}

export default VehicleRepository
