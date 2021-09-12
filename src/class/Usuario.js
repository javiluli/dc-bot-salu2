class Usuario {
  constructor(id, nickname, startTime, totalTime) {
    this.id = id
    this.nickname = nickname
    this.startTime = startTime
    this.totalTime = totalTime
  }

  setUser(map, Usuario) {
    map.set(this.id, Usuario)
  }

  getUser(map, id) {
    return map.get(id)
  }

  existUser(map, id) {
    return map.get(id) === undefined ? false : true
  }

  getTimes(millis) {
    const tiempoSesion = millis - this.startTime
    const tiempoTotal = tiempoSesion + this.totalTime
    return { tiempoSesion, tiempoTotal }
  }

  getMillisec() {
    var ahora = new Date()
    return ahora.getTime()
  }

  formattingTime(time) {
    return time < 10 ? `0${time}` : time
  }

  convertTime(millis) {
    const hours = this.formattingTime(Math.floor(millis / 3600000))
    const minutes = this.formattingTime(Math.floor(millis / 60000) % 60)
    const seconds = this.formattingTime(((millis % 60000) / 1000).toFixed(0))
    return `${hours}h ${minutes}m ${seconds}s`
  }

  getDataUserFromMap(map) {
    let arrUser = [],
      arrTime = []

    map.forEach((element) => {
      const timeTotal = this.convertTime(element.totalTime)
      arrUser.push(element.nickname)
      arrTime.push(timeTotal)
    })

    return { arrUser, arrTime }
  }
}

module.exports = Usuario
