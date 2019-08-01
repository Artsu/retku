// Helper functions not meant to be used in gatsby-node.js

import React from 'react'
import times from 'times-loop'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export const renderStars = (stars, title) => {
  return times(10, index => {
    const key = `${title} - Stars ${index}`
    if (index + 1 <= stars) {
      return <FaStar key={key} />
    } else if (index + 0.5 <= stars) {
      return <FaStarHalfAlt key={key} />
    }
    return <FaRegStar key={key} />
  })
}
