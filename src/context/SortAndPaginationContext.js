import React from 'react'

const SortAndPaginationContext = React.createContext({
  sortType: 'date',
  direction: 'asc',
  page: 1,
})

class SortAndPaginationProvider extends React.Component {
  state = {
    sortType: 'date',
    direction: 'asc',
    page: 1,
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

  setPagination = paginationOptions => {
    this.setState({ ...paginationOptions })
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
          setPagination: this.setPagination,
        }}
      >
        {children}
      </SortAndPaginationContext.Provider>
    )
  }
}
export default SortAndPaginationContext
export { SortAndPaginationProvider }
