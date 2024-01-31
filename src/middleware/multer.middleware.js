const multer = require('multer')


const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../backend/src/images/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    },

});

const upload = multer({storage: storageFile, limits :{
    fileSize: 2000000
}})

module.exports = {
    upload
}