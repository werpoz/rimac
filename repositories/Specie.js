import IRepository from './IRepository'

class SpecieRepository extends IRepository {
  constructor(dbContext) {
    super()

    this.dbContext = dbContext

    return this
  }

  async create(specie) {
    try {
      const { Specie } = this.dbContext
      const specieSaved = await Specie.create(specie)

      return specieSaved
    } catch (e) {
      console.log(e)
    }
  }

  async update(id, specie) {
    try {
      const { Specie } = this.dbContext
      const specieSaved = await Specie.update(specie, { where: { id } })

      return specieSaved
    } catch (e) {
      console.log(e)
    }
  }

  async get(filters) {
    try {
      const { Specie } = this.dbContext
      const specie = await Specie.findAll(filters)

      return specie
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const { Specie } = this.dbContext
      const specie = await Specie.findOne({ where: { id } })

      return specie
    } catch (e) {
      console.log(e)
    }
  }

  async remove(id) {
    const { Specie } = this.dbContext
    const specie = await Specie.findOne({ where: { id } })

    await Specie.destroy({ where: { id } })

    return specie
  }
}

export default SpecieRepository

