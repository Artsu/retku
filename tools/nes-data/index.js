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
    remove: /[*+~.()'"!:@]/g,
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

const getCoverUrl = async coverId => {
  try {
    const response = await apicalypse(requestOptions)
      .fields('url')
      .where(`id = ${coverId};`)
      .request('/covers')

    const result = response.data[0]

    return `http:${result.url}`
  } catch (err) {
    console.error(`Failed to fetch cover for id ${coverId}`, err)
  }
}

const fetchData = async title => {
  try {
    const response = await apicalypse(requestOptions)
      .fields('name,cover.*')
      .search(title)
      .where('platforms = (18)') // NES platform id
      .limit(5)
      .request('/games')

    const result = response.data
    if (result.length === 0) {
      console.log(`!!! No results found for ${title}. Skipping...`)
      return
    }
    let coverId = result[0].cover.image_id
    if (result.length > 1) {
      console.log('----')
      console.log(`Results for "${title}":`)
      console.log(
        result.forEach(r => {
          console.log(`${r.name} - ${r.cover.image_id}`)
        })
      )
      console.log('----')

      coverId = await rlp.questionAsync(
        'More than one results found! Proper cover id is: '
      )
    }
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverId}.jpg`
    await downloadImage(coverUrl, title)
  } catch (err) {
    console.error(`Failed to fetch  data for title "${title}"`, err)
  }
}

fs.readFileAsync('games-list.txt', 'utf8')
  .then(async contents => {
    for (let row of contents.split('\n').slice(0, 50)) {
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
