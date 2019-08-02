import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Page from '../components/Page'
import { FaChevronLeft } from 'react-icons/fa'
import utils from '../common/utils'
import { renderStars } from '../common/helpers'

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

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const LeftColumn = styled.div`
  width: 240px;
`
const RightColumn = styled.div`
  padding-left: 20px;
  flex-grow: 1;
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

const GameImage = styled.img`
  width: 100%;
`

const GameInfo = styled.div`
  padding: 10px 0;
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

const GamePage = props => {
  const { playthrough } = props.pageContext
  const titleSlug = utils.slugifyUrl(playthrough.title)
  return (
    <Page>
      <Back to="/">
        <FaChevronLeft /> Takaisin
      </Back>
      <h1>{playthrough.title}</h1>
      <Content>
        <LeftColumn>
          <GameImage src={`/cover-images/${titleSlug}.jpg`} />
          <GameInfo>
            <Row>
              <b>Läpäisypäivä:</b> {playthrough.date}
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
        </LeftColumn>
        <RightColumn>
          <VideoContainer>
            <VideoIframe
              src={`http://www.youtube.com/embed/${playthrough.videoId}`}
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

export default GamePage
