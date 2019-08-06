import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import formatDate from 'date-fns/format'
import Page from '../components/Page'
import { FaChevronLeft } from 'react-icons/fa'
import { stringify } from 'query-string'
import utils from '../common/utils'
import { renderStars } from '../common/helpers'
import SortAndPaginationContext from '../context/SortAndPaginationContext'

const Back = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;

  &:hover {
    color: gray;
  }

  & svg {
    margin-right: 5px;
  }
`

const Top = styled.div`
  @media only screen and (max-width: 780px) {
    margin: 0 20px;
    padding-top: 20px;

    & h1 {
      font-size: 24px;
    }
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
    margin: 20px 30px 20px 20px;
  }
`
const LeftColumn = styled.div`
  flex-basis: 240px;
  flex-grow: 0;
  flex-shrink: 0;
`
const RightColumn = styled.div`
  padding-left: 20px;
  flex-grow: 1;

  @media only screen and (max-width: 780px) {
    padding: 0;
  }
`

const VideoContainer = styled.div`
  width: 100%;
  position: relative;
  height: 0;
  padding-bottom: 56.25%;
`
const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;

  @media only screen and (max-width: 780px) {
    margin-bottom: 20px;
  }
`
const GameImage = styled.img`
  width: 100%;

  @media only screen and (max-width: 780px) {
    width: 60%;
    margin: auto;
  }
`

const GameInfo = styled.div`
  padding: 10px 0;

  @media only screen and (max-width: 780px) {
    padding: 0 0 15px;
  }
`

const Row = styled.div`
  line-height: 20px;
`

const Rating = styled.div`
  color: yellow;
  padding: 5px 5px;
  font-size: 14px;
  display: inline;
`

const MobileSeparator = styled.div`
  @media only screen and (max-width: 780px) {
    width: 100%;
    border-bottom: 1px solid #41332a;
    margin-bottom: 15px;
  }
`

const buildBackButtonLink = sortAndPaginationState => {
  const params = {}
  if (sortAndPaginationState.sort && sortAndPaginationState.sort.type) {
    params.sort = sortAndPaginationState.sort.type
    params.direction = sortAndPaginationState.sort.direction
  }
  if (
    sortAndPaginationState.pagination &&
    sortAndPaginationState.pagination.page
  ) {
    params.page = sortAndPaginationState.pagination.page
  }

  return `/?${stringify(params)}`
}

const GamePage = props => {
  const { playthrough } = props.pageContext
  const titleSlug = utils.slugifyUrl(playthrough.title)
  const date = formatDate(new Date(playthrough.date), 'dd.MM.yyyy')
  const backButtonLink = buildBackButtonLink(props.sortAndPaginationState)
  return (
    <Page>
      <Top>
        <Back to={backButtonLink}>
          <FaChevronLeft /> Takaisin
        </Back>
        <h1>{playthrough.title}</h1>
      </Top>
      <Content>
        <LeftColumn>
          <ImageWrapper>
            <GameImage src={`/cover-images/${titleSlug}.jpg`} />
          </ImageWrapper>
          <MobileSeparator />
          <GameInfo>
            <Row>
              <b>Läpäisypäivä:</b> {date}
            </Row>
            <Row>
              <b>Aika:</b> {playthrough.time || 'ei tiedossa'}
            </Row>
            <Row>
              <b>Arvosana:</b>
              <Rating>
                {renderStars(playthrough.rating, playthrough.title)}
              </Rating>
            </Row>
          </GameInfo>
          <MobileSeparator />
        </LeftColumn>
        <RightColumn>
          <VideoContainer>
            <VideoIframe
              src={
                playthrough.playlistId
                  ? `http://www.youtube.com/embed/videoseries?list=${playthrough.playlistId}`
                  : `http://www.youtube.com/embed/${playthrough.videoId}`
              }
              frameBorder="0"
              allowFullScreen
            />
          </VideoContainer>
          <p>{playthrough.comments}</p>
        </RightColumn>
      </Content>
    </Page>
  )
}

export default React.forwardRef((props, ref) => {
  return (
    <SortAndPaginationContext.Consumer>
      {sortAndPaginationState => (
        <GamePage
          {...props}
          sortAndPaginationState={sortAndPaginationState}
          ref={ref}
        />
      )}
    </SortAndPaginationContext.Consumer>
  )
})
