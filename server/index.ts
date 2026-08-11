import 'dotenv/config'

import { app } from './app.js'

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`CodeLens AI server is running on http://localhost:${port}`)
})
