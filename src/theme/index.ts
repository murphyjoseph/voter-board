import { createSystem, defaultConfig } from '@chakra-ui/react'

// Create a custom theme configuration
export const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f3ff' },
          100: { value: '#b3d9ff' },
          500: { value: '#0066cc' },
          900: { value: '#003d7a' },
        },
      },
    },
  },
})

export default customTheme
