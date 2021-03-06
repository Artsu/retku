// Util functions shared between frontentend and gatsby-config.js. Not built with babel on Node side.

const slugify = require('slugify')
const getYoutubeId = require('get-youtube-id')
const parseDate = require('date-fns').parse

const slugifyUrl = title =>
  slugify(title.toLowerCase(), {
    remove: /[?*+~.()'"!:@/\\]/g,
  })

const standardizeGameItem = excelItem => {
  if (!excelItem) {
    return null
  }
  const date = parseDate(excelItem.L_p_isyp_iv_, 'dd.MM.yyyy', new Date())
  let rating = parseFloat(excelItem._1_10)
  if (isNaN(rating)) {
    rating = -1
  }
  const game = {
    id: excelItem.id,
    chooser: excelItem.Valitsija,
    title: excelItem.Peli,
    other: excelItem.Muuta,
    date: isNaN(date.getTime()) ? null : date,
    comments: excelItem.Kommentit,
    extra: excelItem.Extra,
    time: excelItem.Aika,
    rating,
    // index: excelItem._,
  }
  if (excelItem.Video) {
    if (excelItem.Video.indexOf('playlist?list=') > 0) {
      game.playlistId = excelItem.Video.substring(
        excelItem.Video.indexOf('playlist?list=') + 14
      )
    } else {
      game.videoId = getYoutubeId(excelItem.Video)
    }
  }
  return game
}

module.exports = {
  slugifyUrl,
  standardizeGameItem,
}
