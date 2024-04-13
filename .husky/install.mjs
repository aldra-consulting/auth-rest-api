import husky from 'husky'

if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0)
}

console.log(husky())
