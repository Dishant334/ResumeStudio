import multer from 'multer'
import os from 'os'

const upload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) return cb(null, true)
    cb(new Error('Only PNG, JPG or WEBP images are allowed'))
  },
})

export default upload
