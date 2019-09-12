// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const morgan     = require('morgan');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Separate and mount routes
const polliteRoutes = require('./routes/pollite');
app.use('/pollite', polliteRoutes);

// Home page
app.get('/', (req, res) => {
  res.send('Welcome 127.0.0.1');
});

app.listen(PORT, () => {
  console.log(`Pollite is listening on port ${PORT}`);
});
