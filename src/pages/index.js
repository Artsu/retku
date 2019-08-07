import React, { Component } from 'react'
import { graphql } from 'gatsby'
import fp from 'lodash/fp'
import urlParams from 'url-parameters'
import utils from '../common/utils'
import GamesListingPage from '../components/GamesListingPage'

import Page from '../components/Page'
import SortAndPaginationContext from '../context/SortAndPaginationContext'

const ITEMS_PER_PAGE = 21
const defaultSort = {
  type: 'date',
  direction: 'desc',
}

class IndexPage extends Component {
  async componentDidMount() {
    const sort = urlParams.get('sort') || defaultSort.type
    const direction = urlParams.get('direction') || defaultSort.direction
    const page = urlParams.get('page') || 1

    await this.props.sortAndPaginationState.setSortAsync(sort, direction)
    await this.props.sortAndPaginationState.setPageAsync(parseInt(page) - 1)
  }

  calculatePaginationItems = (items, page) => {
    const cursor = page === 0 ? 0 : page * ITEMS_PER_PAGE
    return items.slice(cursor, cursor + ITEMS_PER_PAGE)
  }

  render() {
    const { sortAndPaginationState, data } = this.props

    const type = sortAndPaginationState.sort
      ? sortAndPaginationState.sort.type
      : defaultSort.type
    const direction = sortAndPaginationState.sort
      ? sortAndPaginationState.sort.direction
      : defaultSort.direction

    const items = fp.flow(
      fp.map(item => utils.standardizeGameItem(item.node)),
      fp.filter(n => n && n.title),
      fp.orderBy(n => n[type], direction)
    )(this.props.data.allGoogleSpreadsheetNesUrakka.edges)
    const paginatedItems = this.calculatePaginationItems(
      items,
      sortAndPaginationState.pagination
        ? sortAndPaginationState.pagination.page
        : 0
    )

    return (
      <Page logoImage={data.logoImage.childImageSharp.fluid} title="Etusivu">
        <GamesListingPage
          items={paginatedItems}
          sort={sortAndPaginationState.sort || defaultSort}
          pagination={sortAndPaginationState.pagination}
          setSort={sortAndPaginationState.setSort}
          setPage={sortAndPaginationState.setPage}
          pageCount={Math.ceil(items.length / ITEMS_PER_PAGE)}
          totalItems={items.length}
        />
      </Page>
    )
  }
}

export const query = graphql`
  query {
    logoImage: file(relativePath: { eq: "Logo8.png" }) {
      childImageSharp {
        fluid(maxWidth: 756, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
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

export default React.forwardRef((props, ref) => {
  return (
    <SortAndPaginationContext.Consumer>
      {sortAndPaginationState => (
        <IndexPage
          {...props}
          sortAndPaginationState={sortAndPaginationState}
          ref={ref}
        />
      )}
    </SortAndPaginationContext.Consumer>
  )
})
