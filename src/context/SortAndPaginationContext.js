import React from 'react'

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

  setSort = type => {
    let direction = 'asc'
    if (type === this.state.sortType && this.state.direction === 'asc') {
      direction = 'desc'
    }
    this.setState({
      sortType: type,
      direction,
    })
  }

  setPage = page => {
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
          setPage: this.setPage,
        }}
      >
        {children}
      </SortAndPaginationContext.Provider>
    )
  }
}
export default SortAndPaginationContext
export { SortAndPaginationProvider }
