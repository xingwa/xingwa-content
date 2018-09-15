const segment = require('./module/segment.module')


setTimeout(async () => {
    let res = await segment.content('江苏华西村，最新资讯 最有钱的村 年总收入500亿！')
    console.log(res)

}, 1);





