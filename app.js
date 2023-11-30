require('dotenv').config();
const moment = require('moment');
const axios = require('axios').default;


const logger = (msg) => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} ${msg}`);
}

const username = process.argv.slice(2);

(async () => {
  let archives = await axios.get(`https://api.chess.com/pub/player/${username}/games/archives`);
  archives = archives.data.archives;
  logger(`Found ${archives.length} archives`);

  let dateVsGamesQtyMap = {};

  for (let archive of archives) {
    let games = await axios.get(archive);
    games = games.data.games;
    logger(`Found ${games.length} games in ${archive}`);
    
    for (let game of games) {
      const gameDate = moment.unix(game.end_time).format('YYYY-MM-DD');
      if (!dateVsGamesQtyMap[gameDate]) {
        dateVsGamesQtyMap[gameDate] = 0;
      }
      dateVsGamesQtyMap[gameDate] += 1;
    }
  }
  // order dateVsGamesQtyMap by value
  let gamesArray = [];
  for (let date in dateVsGamesQtyMap) {
    gamesArray.push({date: date, count: dateVsGamesQtyMap[date]});
  }
  // sort gamesArray by count
  gamesArray.sort((a, b) => b.count - a.count);
  console.log(`Days with most games for username ${username}:`);
  console.log(`Date: ${gamesArray[0].date} - ${gamesArray[0].count} games`);
  console.log(`Date: ${gamesArray[1].date} - ${gamesArray[1].count} games`);
  console.log(`Date: ${gamesArray[2].date} - ${gamesArray[2].count} games`);
  console.log(`Date: ${gamesArray[3].date} - ${gamesArray[3].count} games`);
  console.log(`Date: ${gamesArray[4].date} - ${gamesArray[4].count} games`);
  logger('done');
})();

