import React, { Component } from 'react'
import { graphql } from 'gatsby'
import fp from 'lodash/fp'
import utils from '../common/utils'
import GamesListingPage from '../components/GamesListingPage'

import Page from '../components/Page'
import SortAndPaginationContext from '../context/SortAndPaginationContext'

class IndexPage extends Component {
  render() {
    return (
      <Page>
        <SortAndPaginationContext.Consumer>
          {sortAndPaginationState => {
            const items = fp.flow(
              fp.map(item => utils.standardizeGameItem(item.node)),
              fp.filter(n => n && n.title),
              fp.orderBy(
                n => n[sortAndPaginationState.sort.type],
                sortAndPaginationState.sort.direction
              )
            )(this.props.data.allGoogleSpreadsheetNesUrakka.edges)
            const paginatedItems = items.slice(0, 21)
            return (
              <GamesListingPage
                items={paginatedItems}
                sort={sortAndPaginationState.sort}
                setSort={sortAndPaginationState.setSort}
                setPagination={sortAndPaginationState.setPagination}
              />
            )
          }}
        </SortAndPaginationContext.Consumer>
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
