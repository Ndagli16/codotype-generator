// Generator index file
var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  writing() {

    // generated/docker-compose-dev.yml
    this.fs.copyTpl(
      this.templatePath('docker-compose-dev.yml'),
      this.destinationPath(this.options.build.dest.root + 'docker-compose-dev.yml'),
      {}
    )

    // generated/docker-compose-demo.yml
    this.fs.copyTpl(
      this.templatePath('docker-compose-demo.yml'),
      this.destinationPath(this.options.build.dest.root + 'docker-compose-demo.yml'),
      {}
    )

    // generated/demo.sh
    this.fs.copyTpl(
      this.templatePath('demo.sh'),
      this.destinationPath(this.options.build.dest.root + 'demo.sh'),
      {}
    )

  }
}