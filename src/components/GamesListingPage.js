import React from 'react'
import styled from 'styled-components'
import { FaRegCalendar, FaSortDown, FaSortUp } from 'react-icons/fa'
import { Link } from 'gatsby'
import utils from '../common/utils'
import { renderStars } from '../common/helpers'
import formatDate from 'date-fns/format'
import LogoImage from '../images/Logo4.png'

const StyledNesMania = styled.div`
  text-align: center;
`

const Logo = styled.img`
  margin-bottom: 30px;
  width: 70%;
`

const Sorting = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
  font-weight: bold;

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
  const setSort = type => {
    return () => {
      props.setSort(type)
    }
  }

  return (
    <StyledNesMania>
      {/*<Logo src={LogoImage} />*/}
      <Sorting>
        {SORT_OPTIONS.map(sort => {
          /*<FilterItem>Läpäisypäivämäärä</FilterItem>
          <FilterItem>Aakkosjärjestys</FilterItem>*/
          const isActive = sort.field === props.sort.type ? 'active' : ''
          return (
            <SortItem
              key={`sort-${sort.field}`}
              className={isActive}
              onClick={setSort(sort.field)}
            >
              {sort.name}
              {isActive && (
                <SortArrow isAscending={props.sort.direction === 'asc'} />
              )}
            </SortItem>
          )
        })}
      </Sorting>
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
              <CoverImg src={`/cover-images/${titleSlug}.jpg`} />
            </GameItem>
          )
        })}
      </GamesList>
    </StyledNesMania>
  )
}
