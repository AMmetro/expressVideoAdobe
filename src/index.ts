import 'dotenv/config'
import {app} from './settings';
import { runDB } from './BD/db';

app.listen(process.env.PORT || 80, async() => {
  await runDB() 
  console.log(`Example app listening on port ${process.env.PORT || 80}`)
})
