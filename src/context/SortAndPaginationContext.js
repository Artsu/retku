import React from 'react'
import urlParams from 'url-parameters'
import Promise from 'bluebird'

const SortAndPaginationContext = React.createContext({
  sortType: 'date',
  direction: 'asc',
  page: 0,
})

class SortAndPaginationProvider extends React.Component {
  state = {
    sortType: 'date',
    direction: 'asc',
    page: 0,
  }

  setSortAsync = (type, direction) => {
    return new Promise(resolve => {
      this.setState(
        {
          sortType: type,
          direction,
        },
        resolve
      )
    })
  }

  setPageAsync = page => {
    return new Promise(resolve => {
      this.setState({ page }, resolve)
    })
  }

  setSort = type => {
    let direction = 'asc'
    if (type === this.state.sortType && this.state.direction === 'asc') {
      direction = 'desc'
    }
    urlParams.set('sort', type)
    urlParams.set('direction', direction)

    this.setState({
      sortType: type,
      direction,
    })
  }

  setPage = page => {
    urlParams.set('page', page + 1)
    this.setState({ page })
  }

  render() {
    const { children } = this.props
    return (
      <SortAndPaginationContext.Provider
        value={{
          sort: {
            type: this.state.sortType,
            direction: this.state.direction,
          },
          pagination: {
            page: this.state.page,
          },
          setSort: this.setSort,
          setSortAsync: this.setSortAsync,
          setPage: this.setPage,
          setPageAsync: this.setPageAsync,
        }}
      >
        {children}
      </SortAndPaginationContext.Provider>
    )
  }
}
export default SortAndPaginationContext
export { SortAndPaginationProvider }
