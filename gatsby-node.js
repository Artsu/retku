const path = require('path')
const utils = require('./src/common/utils.js')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    const gamePageTemplate = path.resolve(`src/templates/game-page.js`)
    resolve(
      graphql(
        `
          {
            allGoogleSpreadsheetNesUrakka {
              edges {
                node {
                  id
                  Valitsija
                  Peli
                  Muuta
                  L_p_isyp_iv_
                  Kommentit
                  Extra
                  Aika
                  _
                  _1_10
                  Video
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        // Create pages for each markdown file.
        result.data.allGoogleSpreadsheetNesUrakka.edges.forEach(({ node }) => {
          const gameItem = utils.standardizeGameItem(node)
          if (gameItem && gameItem.title) {
            const route = utils.slugifyUrl(gameItem.title)
            createPage({
              path: route,
              component: gamePageTemplate,
              // In your blog post template's graphql query, you can use path
              // as a GraphQL variable to query for data from the markdown file.
              context: {
                route,
                playthrough: gameItem,
                image: `cover-images/${route}.jpg`,
              },
            })
          }
        })
      })
    )
  })
}
