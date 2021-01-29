module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  preset: 'ts-jest',
  testRegex: '.spec.ts',
  testEnvironment: 'node'
}
