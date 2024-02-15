import IRepository from './IRepository'

class PlanetRepository extends IRepository {
  constructor(dbContext) {
    super()

    this.dbContext = dbContext

    return this
  }

  async create(planet) {
    try {
      const { Planet } = this.dbContext
      const planetSaved = await Planet.create(planet)

      return planetSaved
    } catch (e) {
      console.log(e)
    }
  }

  async update(id, planet) {
    try {
      const { Planet } = this.dbContext
      const planetSaved = await Planet.update(planet, { where: { id } })

      return planetSaved
    } catch (e) {
      console.log(e)
    }
  }

  async get(filters) {
    try {
      const { Planet } = this.dbContext
      const planet = await Planet.findAll(filters)

      return planet
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const { Planet } = this.dbContext
      const planet = await Planet.findOne({ where: { id } })

      return planet
    } catch (e) {
      console.log(e)
    }
  }

  async remove(id) {
    const { Planet } = this.dbContext
    const planet = await Planet.findOne({ where: { id } })

    await Planet.destroy({ where: { id } })

    return planet
  }
}

export default PlanetRepository

