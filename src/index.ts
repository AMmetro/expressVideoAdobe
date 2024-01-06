import {app} from './settings';

const port=5000



app.listen(port, () => {
  console.log(`Example app listening on port ${port || 80}`)
})
