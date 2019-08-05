import React, { Component } from 'react'
import { graphql } from 'gatsby'
import fp from 'lodash/fp'
import utils from '../common/utils'
import GamesListingPage from '../components/GamesListingPage'

import Page from '../components/Page'
import SortAndPaginationContext from '../context/SortAndPaginationContext'

const ITEMS_PER_PAGE = 21

class IndexPage extends Component {
  calculatePaginationItems = (items, page) => {
    const cursor = page === 0 ? 0 : page * ITEMS_PER_PAGE
    return items.slice(cursor, cursor + ITEMS_PER_PAGE)
  }

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
            const paginatedItems = this.calculatePaginationItems(
              items,
              sortAndPaginationState.pagination.page
            )
            return (
              <GamesListingPage
                items={paginatedItems}
                sort={sortAndPaginationState.sort}
                pagination={sortAndPaginationState.pagination}
                setSort={sortAndPaginationState.setSort}
                setPage={sortAndPaginationState.setPage}
                pageCount={Math.ceil(items.length / ITEMS_PER_PAGE)}
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
