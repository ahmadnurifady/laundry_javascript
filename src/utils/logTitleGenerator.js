const SPOT_LOG_TYPE = {
    CONTROLLER: 'CONTROLLER',
    ROUTER: 'ROUTER',
    SERVICES: 'SERVICES',
}

const MODULE_LOG_TYPE = {
    USERS: 'USERS'
}

const logTitleGenerator = (type, spotLog, moduleLogType) => {
    return `[${moduleLogType}-${spotLog}-${type}]`
}

module.exports = {
    SPOT_LOG_TYPE,
    MODULE_LOG_TYPE,
    logTitleGenerator
}