const slugify = require('slugify')
const getYoutubeId = require('get-youtube-id')

const slugifyUrl = title =>
  slugify(title.toLowerCase(), {
    remove: /[*+~.()'"!:@]/g,
  })

const standardizeGameItem = excelItem => {
  if (!excelItem) {
    return null
  }
  const game = {
    id: excelItem.id,
    chooser: excelItem.Valitsija,
    title: excelItem.Peli,
    other: excelItem.Muuta,
    date: excelItem.L_p_isyp_iv_,
    comments: excelItem.Kommentit,
    extra: excelItem.Extra,
    time: excelItem.Aika,
    rating: excelItem._1_10,
    // index: excelItem._,
  }
  if (excelItem.Video) {
    game.videoId = getYoutubeId(excelItem.Video)
  }
  return game
}

module.exports = {
  slugifyUrl,
  standardizeGameItem,
}
