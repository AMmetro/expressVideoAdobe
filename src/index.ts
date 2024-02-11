import 'dotenv/config'
import {app} from './settings';
import { runDB } from './BD/db';
import { appConfig } from './appConfig';

app.listen( appConfig.PORT, async() => {
  await runDB() 
  console.log(`Example app listening on port ${appConfig.PORT}`)
})
