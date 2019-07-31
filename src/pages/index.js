import React, { Component } from 'react'
import { graphql } from 'gatsby'
import utils from '../common/utils'
import NesMania from '../components/NesMania/NesMania'

import Page from '../components/Page'

class IndexPage extends Component {
  render() {
    const items = this.props.data.allGoogleSpreadsheetNesUrakka.edges
      .map(item => utils.standardizeGameItem(item.node))
      .filter(n => n)

    return (
      <Page>
        <NesMania items={items} />
      </Page>
    )
  }
}

export const query = graphql`
  query {
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

export default IndexPage
