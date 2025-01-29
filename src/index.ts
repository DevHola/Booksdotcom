import app from './app'
const PORT = process.env.PORT ?? null
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
