const express = require('express')
const app = express()

app.get('/', (req, res) => {
  console.log('hey')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})