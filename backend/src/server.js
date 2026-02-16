require("dotenv").config();


const { getTwitchAccessToken } = require('./services/igdb');
const connectToDataBase = require("./db/db");
const app = require("./app");



const PORT = process.env.PORT || 3001; //Double checking in case .env fails

// Connecting MongoDB and then running the server
connectToDataBase().then(() => {

  app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en en http://localhost:${PORT}`);
  });


getTwitchAccessToken();
});
