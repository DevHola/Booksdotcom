import app from "./app";
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Express is listening at http://localhost:${PORT}`)
})