'use client'

import { ChakraProvider } from '@chakra-ui/react'
import customTheme from '@/theme'

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={customTheme}>
      {props.children}
    </ChakraProvider>
  )
}
