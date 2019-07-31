require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Retkun NESMania`,
    description: ``,
    author: `@arimattin`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'custom-google-spreadsheets-source',
      options: {
        spreadsheetId: process.env.NES_URAKKASPREADSHEET_ID,
        worksheetTitle: 'NES-Urakka',
        credentials: require('./google-service-account'),
      },
    },
    `gatsby-plugin-styled-components`,
  ],
}
