/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import './layout.css'

const Layout = ({ children, className }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={() => (
      <div className={className}>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,400i,700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
            data-cfasync="false"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-145255597-1"
          />
        </Helmet>
        {children}
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;

  color: #41332a;
`

export default StyledLayout
