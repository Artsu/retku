import React, { useState } from 'react'
import styled from 'styled-components'
import {
  FaRegCalendar,
  FaSortDown,
  FaSortUp,
  FaPlayCircle,
} from 'react-icons/fa'
import { Link } from 'gatsby'
import ReactPaginate from 'react-paginate'
import formatDate from 'date-fns/format'
import utils from '../common/utils'
import { renderStars } from '../common/helpers'

let ReactTwitchEmbedVideo = null
if (typeof window !== 'undefined') {
  ReactTwitchEmbedVideo = require('react-twitch-embed-video')
}

const StyledNesMania = styled.div`
  text-align: center;
`

const Description = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media only screen and (max-width: 780px) {
    margin: 20px 10px 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid #b6a89e;
    font-size: 14px;
  }
`

const Sorting = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
  font-weight: bold;
  justify-content: center;
  border-bottom: 1px solid #b6a89e;
  padding-bottom: 20px;
  margin-bottom: 30px;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
  }
`

const SortItem = styled.div`
  padding: 10px;
  margin-right: 20px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;

  &.active {
    border: 1px solid gray;
    border-radius: 5px;
    background: #a5988f;
    color: white;
  }

  &:hover {
    border: 1px solid gray;
    border-radius: 5px;
    background: #89776c;
    color: white;
  }

  @media only screen and (max-width: 780px) {
    margin-right: 0;
  }
`

const GamesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const GameItem = styled(Link)`
  padding: 10px;
  width: 318px;
  display: flex;
  justify-content: space-between;
  border: 1px solid gray;
  margin: 10px;
  border-radius: 5px;
  background: #a5988f;
  color: #41332a;
  text-align: left;
  text-decoration: none;

  &:hover {
    background: #89776c;
    color: white;
  }

  @media only screen and (max-width: 1200px) {
    width: 318px;
  }
`

const CoverImg = styled.img`
  width: 100px;
`

const GameInfo = styled.div`
  padding: 10px;
  flex-grow: 1;
  font-size: 14px;
`

const FinishDate = styled.div`
  display: flex;
  align-items: center;

  & .calendar-icon {
    margin-right: 5px;
  }
`

const FinishTime = styled.div``

const GameTitle = styled.div`
  border-bottom: 1px solid white;
  width: 100%;
  padding-bottom: 5px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  font-size: 15px;
`

const Rating = styled.div`
  color: yellow;
  padding: 5px 0;
  font-size: 16px;

  @media only screen and (max-width: 780px) {
    font-size: 14px;
  }
`

const SortArrow = styled(props => {
  const icon = props.isAscending ? <FaSortUp /> : <FaSortDown />
  return <span className={props.className}>{icon}</span>
})`
  position: relative;
  width: 15px;
  height: 15px;
  margin-left: 5px;

  & > * {
    position: absolute;
    top: ${props => (props.isAscending ? '3px' : '-2px')};
    left: 0;
  }
`

const Pagination = styled(props => {
  const { className, ...rest } = props
  return (
    <ReactPaginate
      containerClassName={className}
      previousLabel="Edellinen"
      nextLabel="Seuraava"
      {...rest}
    />
  )
})`
  display: flex;
  list-style-type: none;
  padding-left: 0;
  justify-content: center;

  & > li > a {
    cursor: pointer;
    padding: 10px;
  }
  & > li.previous {
    padding-left: 10px;
  }
  & > li.next {
    padding-right: 10px;
  }
  & > li.selected > a {
    border: 1px solid gray;
    border-radius: 5px;
    background: #a5988f;
    color: white;
  }
  & > li.disabled {
    color: #96918f;
  }

  @media only screen and (max-width: 780px) {
    & > li.previous,
    & > li.next {
      display: none;
    }
  }
`

const TwitchVideo = styled(props => {
  const isServer = typeof window === 'undefined'
  let sizeProps = {}
  if (!isServer && document.documentElement.clientWidth < 780) {
    sizeProps.height = '200px'
  }
  return (
    <div className={props.className}>
      {!isServer && (
        <ReactTwitchEmbedVideo {...props} width="100%" {...sizeProps} />
      )}
    </div>
  )
})`
  position: relative;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  max-height: 0;
  transition: max-height 0.2s linear;
  overflow: hidden;

  ${props => props.visible && 'max-height: 1000px;'};
`

const ToggleStreamButton = styled.button`
  display: flex;
  align-items: center;
  align-self: center;
  cursor: pointer;
  font-size: 15px;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  background: #a5988f;
  font-weight: bold;
  color: white;

  & > svg {
    margin-left: 5px;
  }
`

const SORT_OPTIONS = [
  {
    name: 'Läpäisypäivämäärä',
    field: 'date',
  },
  {
    name: 'Aakkosjärjestys',
    field: 'title',
  },
  {
    name: 'Arvosana',
    field: 'rating',
  },
]

export default props => {
  const [showStream, setShowStream] = useState(false)

  const isServer = typeof window === 'undefined'

  const setSort = type => {
    return () => {
      props.setSort(type)
    }
  }

  const renderPagination = () => {
    const onPageChange = page => {
      props.setPage(page.selected)
    }

    return (
      <Pagination
        pageCount={props.pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        forcePage={props.pagination ? props.pagination.page : 0}
        onPageChange={onPageChange}
      />
    )
  }

  return (
    <StyledNesMania>
      <Description>
        Retkun tie Nintendo Entertainment Systemin syvimpienkin syvänteiden
        läpi. Tällä hetkelle pelejä on pelattuna läpi {props.totalItems} / 710.
        <ToggleStreamButton onClick={() => setShowStream(!showStream)}>
          Seuraa Retkua livenä
          <FaPlayCircle />
        </ToggleStreamButton>
        <TwitchVideo visible={showStream} layout="video" channel="retku" />
      </Description>
      <Sorting>
        {SORT_OPTIONS.map(sort => {
          /*<FilterItem>Läpäisypäivämäärä</FilterItem>
          <FilterItem>Aakkosjärjestys</FilterItem>*/
          const isActive =
            props.sort && sort.field === props.sort.type ? 'active' : ''
          return (
            <SortItem
              key={`sort-${sort.field}`}
              className={isActive}
              onClick={setSort(sort.field)}
            >
              {sort.name}
              {isActive && (
                <SortArrow
                  isAscending={props.sort && props.sort.direction === 'asc'}
                />
              )}
            </SortItem>
          )
        })}
      </Sorting>
      {renderPagination()}
      <GamesList>
        {props.items.map(item => {
          const titleSlug = utils.slugifyUrl(item.title)
          return (
            <GameItem key={item.title} to={`/${titleSlug}`}>
              <GameInfo>
                <GameTitle>{item.title}</GameTitle>
                <br />
                <FinishDate>
                  <FaRegCalendar className="calendar-icon" />{' '}
                  {item.date && formatDate(item.date, 'dd.MM.yyyy')}
                </FinishDate>
                <Rating>{renderStars(item.rating, item.title)}</Rating>
                <FinishTime>{item.time}</FinishTime>
              </GameInfo>
              {!isServer && (
                <CoverImg
                  src={require(`../images/cover-images/${titleSlug}.jpg`)}
                />
              )}
            </GameItem>
          )
        })}
      </GamesList>
      {renderPagination()}
    </StyledNesMania>
  )
}
