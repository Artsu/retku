const createNodeHelpers = require('gatsby-node-helpers').default
const { google } = require('googleapis')
const Promise = require('bluebird')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

exports.sourceNodes = async ({ actions, createNodeId }, pluginOptions) => {
  const { createNode } = actions
  const {
    spreadsheetId,
    worksheetTitle = '',
    typePrefix = 'GoogleSpreadsheet',
    credentials,
  } = pluginOptions

  const { createNodeFactory } = createNodeHelpers({ typePrefix })
  const buildNode = createNodeFactory(worksheetTitle)

  const jwt = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  )

  const sheets = google.sheets({ version: 'v4', auth: jwt })
  const results = []

  return new Promise(resolve => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range: worksheetTitle,
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err.message)

        const rows = res.data.values
        if (rows.length) {
          rows.forEach(row => results.push(row))

          sheets.spreadsheets.values.get(
            {
              spreadsheetId,
              range: worksheetTitle,
              valueRenderOption: 'FORMULA',
            },
            (err, res) => {
              if (err)
                return console.log('The API returned an error: ' + err.message)
              const rows = res.data.values
              if (rows.length) {
                rows.forEach((row, index) => {
                  if (row[8] && row[8].indexOf('=HYPERLINK("') === 0) {
                    results[index][8] = row[8].split('"')[1]
                  } else if (index !== 0) {
                    results[index][8] = null
                  }
                })

                results.forEach((result, index) => {
                  if (index === 0) {
                    return
                  }

                  const formattedResult = result.reduce((acc, cur, i) => {
                    if (results[0][i]) {
                      acc[results[0][i]] = cur
                    }
                    return acc
                  }, {})

                  createNode({
                    ...buildNode(formattedResult),
                    id: createNodeId(
                      `${typePrefix} ${worksheetTitle} ${index}`
                    ),
                  })
                  resolve()
                })
              } else {
                console.log('No data found.')
              }
            }
          )
        } else {
          console.log('No data found.')
        }
      }
    )
  })
}
