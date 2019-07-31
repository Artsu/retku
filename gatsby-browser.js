import React from 'react'
import { AnimationProvider } from './src/context/AnimationContext'
export const wrapRootElement = ({ element }) => (
  <AnimationProvider>{element}</AnimationProvider>
)
