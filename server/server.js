import {app} from './app.js';
import Connect_To_DB from './data/database.js'

const port = process.env.PORT || 5000;

//Connecting to DB
// Connect_To_DB();

//Listening to port 
app.listen(port, () => {
    console.log(`****** Server is Running  ******`);
    console.log(`Server is running on port http://localhost:${port}`);
}); 