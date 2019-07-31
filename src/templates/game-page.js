import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Page from '../components/Page'
import { FaChevronLeft } from 'react-icons/fa'

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
  width: 20%;
`
const RightColumn = styled.div`
  padding-left: 20px;
  width: calc(80% - 60px);
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

const GamePage = props => {
  return (
    <Page>
      <Back to="/">
        <FaChevronLeft /> Takaisin
      </Back>
      <h1>{props.pageContext.title}</h1>
      <Content>
        <LeftColumn>
          <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/fzacmuu0ql2epktrfyjk.jpg" />
        </LeftColumn>
        <RightColumn>
          <VideoContainer>
            <VideoIframe
              src={`http://www.youtube.com/embed/${props.pageContext.videoId}`}
              frameBorder="0"
              allowFullScreen
            />
          </VideoContainer>
          <p>{props.pageContext.comments}</p>
        </RightColumn>
      </Content>
    </Page>
  )
}

export default GamePage
