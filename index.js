const segment = require('./module/segment.module')

exports.seoMsg = async (msg) => {
    return await segment.content(msg)
}
