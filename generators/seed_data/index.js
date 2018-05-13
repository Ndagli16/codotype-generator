const _ = require('lodash')
const Generator = require('../util/generator')

module.exports = class extends Generator {
  async write () {

    // Returns boolean wether or not there is seed data
    function noSeedData (build) {
      let empty = true
      _.each(build.app.seed_data, (s) => {
        if (s.records.length) {
          empty = false
        }
      })
      return empty
    }

    // Short-circuits if there's no seed data present
    if (noSeedData(this.options.build)) {
      return
    }

    // Ensures presence of docker directory
    await this.fs.ensureDir(this.options.build.dest.root + 'docker/seeds/')

    // Stores `COPY seed/identifier.json /identifier.json` statements
    let copyStatements = []

    // Stores `mongoimport` statements
    let mongoImports = ['CMD echo "Seeding MongoDB"']

    // Generates COPY and mongoimport statements
    _.each(this.options.build.app.seed_data, (data, schema_id) => {

      // Debug statement
      // console.log(data.records)

      // If some records exist
      if (data.records.length) {

        // COPY statement
        let copyStatement = `COPY seeds/${data.identifier}.json /${data.identifier}.json`
        copyStatements.push(copyStatement)

        // MongoImport statement
        // TODO - remove hard-coded `blazeplate` database name
        let importStatement = `mongoimport --host mongo --db blazeplate --collection ${data.identifier} --type json --file ./${data.identifier}.json --jsonArray`
        mongoImports.push(importStatement)

        // Generates generated/docker/seeds/identifier.json
        this.copyTemplate(
          __dirname + '/templates/seeds/data.json',
          this.options.build.dest.root + 'docker/seeds/' + data.identifier + '.json',
          { jsonData: _.unescape(JSON.stringify(data.records, null, 2)) }
        )
        // console.log(this.options.build.dest.root + 'docker/seeds/' + data.identifier + '.json')

      }
    })

    // Joins copyStatements and mongoImports
    copyStatements = copyStatements.join('\n')
    mongoImports = mongoImports.join(' && \\\n')

    console.log('WRITING???')

    // generated/docker/Dockerfile-MongoSeed
    await this.copyTemplate(
      __dirname + '/templates/Dockerfile-MongoSeed',
      this.options.build.dest.root + 'docker/Dockerfile-MongoSeed',
      { mongoImports, copyStatements  }
    )

  }
}