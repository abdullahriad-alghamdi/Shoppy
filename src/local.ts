import { dev } from "./config"
import app from "./server"

const port: string | number = dev.app.port

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
})