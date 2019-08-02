import React from 'react'
import { AnimationProvider } from './src/context/AnimationContext'
import { SortAndPaginationProvider } from './src/context/SortAndPaginationContext'
export const wrapRootElement = ({ element }) => (
  <AnimationProvider>
    <SortAndPaginationProvider>{element}</SortAndPaginationProvider>
  </AnimationProvider>
)
