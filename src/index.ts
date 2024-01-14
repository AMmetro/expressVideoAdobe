import 'dotenv/config'
import {app} from './settings';

app.listen(process.env.PORT || 80, () => {
  console.log(`Example app listening on port ${process.env.PORT || 80}`)
})
