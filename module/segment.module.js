const Segment = require('segment')
const path = require('path')
const baike = require('./baike.module')

const segment = new Segment()
const dict = 'dict'

segment.loadDict(path.dirname(__dirname) + path.sep + dict + path.sep + 'dict1.txt')
segment.loadDict(path.dirname(__dirname) + path.sep + dict + path.sep + 'dict2.txt')
segment.loadDict(path.dirname(__dirname) + path.sep + dict + path.sep + 'names1.txt')
segment.useDefault()

function doSegment(word) {
    let words = (segment.doSegment(word, {
        //  simple: true,
        stripPunctuation: true
    }))
    console.log(words)
    words = Array.from(new Set(words))
    return words
}

async function segmentContent(words) {
    let arr = doSegment(words)
    let first = 0
    let baikeArr = []
    let exits = []
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index].w
        if (!exits.includes(element)) {
            exits.push(element)
            if (element.length > 1 && (arr[index].p == 128 || arr[index].p == undefined || arr[index].p === 0 || arr[index].p === 64 || arr[index].p === 16384 || arr[index].p === 1048576 || arr[index].p === 1073741824 || arr[index].p === 4096 || arr[index].p === 32 || arr[index].p === 8)) {
                try {
                    let res = await baike.getContent(element)
                    if (res.length >= first) {
                        baikeArr.unshift([element, res])
                        first = res.length
                    } else {
                        baikeArr.push([element, res])
                    }
                } catch (ex) { }

            }
        }
    }
    return baikeArr
}

exports.do = doSegment
exports.content = segmentContent