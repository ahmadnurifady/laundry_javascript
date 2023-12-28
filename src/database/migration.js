const { Users } = require('../users/users.model')
const {connection} = require('./connection')


async function migration () {
    await Users.sync()
}

migration()