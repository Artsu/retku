const Promise = require('bluebird')
const apicalypse = require('apicalypse').default
const fs = Promise.promisifyAll(require('fs'))
const readline = require('readline-promise').default
const axios = require('axios').default
const slugify = require('slugify')

let apiKey = process.argv[2]

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const requestOptions = {
  method: 'post',
  baseURL: 'https://api-v3.igdb.com',
  headers: {
    'user-key': apiKey,
  },
}

const slugifyTitle = title =>
  slugify(title.toLowerCase(), {
    remove: /[*+~.()'"!:@/\\]/g,
  })

const downloadImage = async (imageUrl, title) => {
  console.log('imageUrl', imageUrl)
  console.log('title', title)
  const imageResponse = await axios.get(imageUrl, {
    method: 'get',
    responseType: 'stream',
  })
  imageResponse.data.pipe(
    fs.createWriteStream(`./assets/${slugifyTitle(title)}.jpg`)
  )
}

const getCoverIdFromAccurateMatch = (results, searchTitle) => {
  let coverId = null
  results.forEach(r => {
    if (r.name === searchTitle) {
      coverId = r.cover.image_id
    }
  })
  return coverId
}

const askForCoverId = async (results, title) => {
  console.log('----')
  console.log(`Results for "${title}":`)
  console.log(
    results.forEach(r => {
      console.log(`${r.name} - ${r.cover && r.cover.image_id}`)
    })
  )
  console.log('----')

  return rlp.questionAsync('More than one results found! Proper cover id is: ')
}

const fetchData = async title => {
  try {
    let searchTitle = title
    if (title.indexOf(' (PAL)') > 0) {
      searchTitle = title.substring(0, title.indexOf(' (PAL)'))
    }
    const response = await apicalypse(requestOptions)
      .fields('name,cover.*')
      .search(searchTitle)
      .where('platforms = (18)') // NES platform id
      .limit(5)
      .request('/games')

    const result = response.data
    if (result.length === 0) {
      console.log(`!!! No results found for ${title}. Skipping...`)
      console.log(`Use slug "${slugifyTitle(title)}" for manual input.`)
      return
    }
    let coverId = result[0].cover.image_id
    if (result.length > 1) {
      coverId = getCoverIdFromAccurateMatch(result, searchTitle)
      if (!coverId) {
        console.log(`Use slug "${slugifyTitle(title)}" for manual input.`)
        coverId = await askForCoverId(result, searchTitle)
      }
    }
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverId}.jpg`
    await downloadImage(coverUrl, title)
  } catch (err) {
    console.error(`Failed to fetch  data for title "${title}"`, err)
    console.log(`Use slug "${slugifyTitle(title)}" for manual input.`)
  }
}

fs.readFileAsync('games-list.txt', 'utf8')
  .then(async contents => {
    for (let row of contents.split('\n')) {
      if (!fs.existsSync(`./assets/${slugifyTitle(row)}.jpg`)) {
        await fetchData(row)
      }
    }
  })
  .catch(function(e) {
    console.error(e.stack)
  })
  .finally(() => {
    rlp.close()
  })
