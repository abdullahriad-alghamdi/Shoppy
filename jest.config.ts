import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  // Indicates which environment Jest should use for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.test.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],

  // Module file extensions for importing modules
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Transform files with TypeScript using ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Other configuration options...
}

export default config
