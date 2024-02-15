import IRepository from './IRepository'

class StarshipRepository extends IRepository {
  constructor(dbContext) {
    super()

    this.dbContext = dbContext

    return this
  }

  async create(starship) {
    try {
      const { Starship } = this.dbContext
      const starshipSaved = await Starship.create(starship)

      return starshipSaved
    } catch (e) {
      console.log(e)
    }
  }

  async update(id, starship) {
    try {
      const { Starship } = this.dbContext
      const starshipSaved = await Starship.update(starship, { where: { id } })

      return starshipSaved
    } catch (e) {
      console.log(e)
    }
  }

  async get(filters) {
    try {
      const { Starship } = this.dbContext
      const starship = await Starship.findAll(filters)

      return starship
    } catch (e) {
      console.log(e)
    }
  }

  async getById(id) {
    try {
      const { Starship } = this.dbContext
      const starship = await Starship.findOne({ where: { id } })

      return starship
    } catch (e) {
      console.log(e)
    }
  }

  async remove(id) {
    const { Starship } = this.dbContext
    const starship = await Starship.findOne({ where: { id } })

    await Starship.destroy({ where: { id } })

    return starship
  }
}

export default StarshipRepository
