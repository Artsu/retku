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

  setSort = sortOptions => {
    this.setState({ ...sortOptions })
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
