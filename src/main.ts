/* eslint-disable no-console */
import { INestApplication } from '@nestjs/common'
import { bootstrap } from './bootstrap'

bootstrap()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .then(async ({ app, config }: { app: INestApplication; config: any }) => {
    const port = config.http.port as number
    await app.listen(port)
    console.log(`Server started successfully. Listening on port ${port}`)
  })
  .catch((error: Error) => {
    console.error('Error starting server', error)
  })
