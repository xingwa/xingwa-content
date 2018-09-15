
const http = require('https'), querystring = require('querystring')
exports.getContent = (keyword, callback) => {
    return new Promise((resovle, reject) => {
        var data = {
            word: keyword,
            rn: '10',
            pn: '0',
            enc: 'utf8'
        }

        var content = querystring.stringify(data);

        var options = {
            hostname: 'wapbaike.baidu.com',
            port: 443,
            path: '/search/none?' + content,
            method: 'GET'
        };

        var req = http.request(options, (res) => {
            let str = ''
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                str += chunk
            });
            res.on('end', () => {
                try {
                    var match = str.split('<div class="note">')[1].split('search-more')[0].replace('http://', 'https://').match("https://baike.baidu.com/item/.*?\"");
                    let url = match[0].replace('"', '')
                    if (url) {

                        var q = http.request(url, (resBaikeHeader) => {
                            if (resBaikeHeader.headers.location) {
                                url = 'https://baike.baidu.com' + resBaikeHeader.headers.location
                            }
                            var reqBaike = http.request(url, (resBaike) => {

                                let str = ''
                                resBaike.setEncoding('utf8');
                                resBaike.on('data', (chunk) => {
                                    str += chunk
                                });
                                resBaike.on('end', () => {
                                    try {
                                        str = str.replace('basic-info', 'configModuleBanner')
                                        var matchBaike = str.split('lemma-summary')[1].split('configModuleBanner')[0];
                                        matchBaike = matchBaike.replace(/\n/ig, '').replace(/&nbsp;/ig, '').replace(/<.[^<>]*?>/ig, '').replace(/\[.\[\]*?\]/ig, '').replace(/\[[0-9\-]+\]/ig, '')
                                        matchBaike = matchBaike.replace('" label-module="lemmaSummary">', '').replace('<div class="', '')

                                        if (matchBaike) {
                                            if (matchBaike.substring(0, keyword.length + 10).indexOf(keyword) === -1) {
                                                matchBaike = "“" + keyword + "”：" + matchBaike
                                            }
                                            resovle(matchBaike)
                                        } else {
                                            reject(new Error('data is empty'))
                                        }
                                    } catch (ex) {
                                        reject(ex)
                                    }
                                })
                            })
                            reqBaike.end()
                        })
                        q.end()
                    }
                } catch (error) {
                    reject(error)
                }
            })
        });

        req.on('error', (e) => {
            callback(e)
        });

        req.end();
    })
}