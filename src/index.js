// Require the necessary discord.js classes
const Discord = require('discord.js')
const client = new Discord.Client()
const Usuario = require('./class/Usuario')

// ID del chat de texto al cual asociar el bot
const ID_TEXT_CHANNEL = process.env.ID_TEXT_CHANNEL

// Token de creadin del bot (https://discord.com/developers/applications)
const TOKEN_BOT = process.env.TOKEN_BOT

// Formato de almacenar informacion de los usuario (lo apropiado seria un BD)
const DATA_MAP = new Map()

client.on('ready', () => {
  console.log('Bot Now connected!')
})

client.on('voiceStateUpdate', (oldVoice, newVoice) => {
  let usuario = new Usuario()

  const user = client.users.cache.get(newVoice.id)
  const textChannel = client.channels.cache.get(ID_TEXT_CHANNEL)
  const oldvoice = client.channels.cache.get(oldVoice.channelID)
  const newvoice = client.channels.cache.get(newVoice.channelID)
  const millisNow = usuario.getMillisec()

  let embed = new Discord.MessageEmbed()
    .setAuthor(user.username, user.avatarURL({ dynamic: true }))
    .setColor('RANDOM')
    .setTimestamp()

  if (newvoice && !oldvoice) {
    embed.setDescription(`Se a **conectado** al canal ${newvoice.name}`)
    textChannel.send(embed)

    if (usuario.existUser(DATA_MAP, user.id)) {
      const dataUser = usuario.getUser(DATA_MAP, user.id)

      dataUser.setUser(
        DATA_MAP,
        new Usuario(
          dataUser.id,
          dataUser.nickname,
          millisNow,
          dataUser.totalTime
        )
      )
    } else {
      const newUser = new Usuario(user.id, user.username, millisNow, 0)
      newUser.setUser(DATA_MAP, newUser)
    }
  }

  if (oldvoice && !newvoice) {
    const updateUser = usuario.getUser(DATA_MAP, user.id)

    const { tiempoSesion, tiempoTotal } = updateUser.getTimes(millisNow)

    updateUser.setUser(
      DATA_MAP,
      new Usuario(updateUser.id, updateUser.nickname, 0, tiempoTotal)
    )

    embed.setTitle('Datos de tiempo de los usuarios').addFields(
      {
        name: 'Tiempo de sesion',
        value: usuario.convertTime(tiempoSesion),
        inline: true,
      },
      {
        name: 'Tiempo total conectado',
        value: usuario.convertTime(tiempoTotal),
        inline: true,
      }
    )
    textChannel.send(embed)
  }
})

client.on('message', (message) => {
  if (message.content === '!table') {
    const usuario = new Usuario()

    const textChannel = client.channels.cache.get(ID_TEXT_CHANNEL)
    const { arrUser, arrTime } = usuario.getDataUserFromMap(DATA_MAP)

    embed = new Discord.MessageEmbed()
      .setTitle('Tabla de tiempo')
      .setDescription('--------------------------------------')
      .setColor('RANDOM')
      .addFields([
        { name: 'Usuario', value: arrUser, inline: true },
        { name: 'Tiempo total', value: arrTime, inline: true },
      ])

    textChannel.send(embed)
  }
})

// Login to Discord with your client's token
client.login(TOKEN_BOT)
