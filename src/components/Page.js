import React, { Component } from 'react'
import styled from 'styled-components'
import Nintendo from '../components/Nintendo'
import Layout from '../components/layout'
import SEO from '../components/seo'
import AnimationContext from '../context/AnimationContext'

const ContentAnimator = styled.div`
  transition: max-height 0.5s ease-in-out;
  max-height: 0;
  overflow: auto;
  flex-grow: 1;
  margin: 0 auto;

  ${props => props.isOpen && `max-height: calc(2000px);`}
`

const ContentWrapper = styled.div`
  width: 1080px;
  padding: 20px;
  background: #d5cac2;
  margin: auto;
  height: calc(100% - 40px);
`

const ResponsiveNintendoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`
class Page extends Component {
  render() {
    return (
      <AnimationContext.Consumer>
        {animationState => (
          <Layout>
            <SEO title={`Retkun NESMania - ${this.props.title}`} />
            <ContentAnimator isOpen={animationState.contentIsVisible}>
              <ContentWrapper>{this.props.children}</ContentWrapper>
            </ContentAnimator>
            <ResponsiveNintendoWrapper>
              <Nintendo
                isOpen={animationState.nintendoIsOpen}
                cartIsDown={animationState.cartIsDown}
              />
            </ResponsiveNintendoWrapper>
          </Layout>
        )}
      </AnimationContext.Consumer>
    )
  }
}

export default Page
