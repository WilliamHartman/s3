var HTTPS = require('https');
const moment = require('moment');

const botID = '83509260838e8be597190fce87'

function postMessage(players, nextScrim) {
    var botResponse, options, body, botReq;

    let playersStr = players.map((player, index) => `${index+1}. ${player.player_name}`).join('\n')
    playersStr = nextScrim + '\n Sign up here: http://s3.soccer \n' + playersStr;
  
    botResponse = playersStr;
  
    options = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };
  
    body = {
      "bot_id" : botID,
      "text" : botResponse
    };
  
    console.log('sending ' + botResponse + ' to ' + botID);
  
    botReq = HTTPS.request(options, function(res) {
        if(res.statusCode == 202) {
        } else {
          console.log('rejecting bad status code ' + res.statusCode);
        }
    });
  
    botReq.on('error', function(err) {
      console.log('error posting message '  + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
      console.log('timeout posting message '  + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}


function teamSetup(req, res, db){
    
    db.get_players().then((players) => {
        let numPlayers = players.length;
        let greenTeam = [];
        let redTeam = [];
        let greenTeamTwo = [];
        let redTeamTwo = [];

        for(let i=0; i<numPlayers; i++){
        let team = Math.random() < 0.5 ? 'green' : 'red';
        
        if(greenTeam.length === Math.ceil(numPlayers/2)){
            redTeam.push(players[i].player_name)
        } else if (redTeam.length === Math.ceil(numPlayers/2)){
            greenTeam.push(players[i].player_name)
        }else if(team === 'green'){
            greenTeam.push(players[i].player_name)
        } else {
            redTeam.push(players[i].player_name)
        }
        }

        let tempGreenTeam = []
        let tempRedTeam = []
        if(numPlayers >= 28){
            for(let i=0; i<greenTeam.length; i++){
                i % 2 === 0 ? tempGreenTeam.push(greenTeam[i]) : greenTeamTwo.push(greenTeam[i])
            }
            for(let i=0; i<redTeam.length; i++){
                i % 2 === 0 ? tempRedTeam.push(redTeam[i]) : redTeamTwo.push(redTeam[i])
            }
            greenTeam = tempGreenTeam
            redTeam = tempRedTeam
        }
        greenTeam = greenTeam.join()
        greenTeamTwo = greenTeamTwo.join()
        redTeam = redTeam.join()
        redTeamTwo = redTeamTwo.join()

        db.post_teams(greenTeam, redTeam, greenTeamTwo, redTeamTwo).then((returning) => {
            res.status(200).send(returning)
        })
    })
}

module.exports = {
    test: (req, res) => {
        res.status(200).send('Success')
    },

    getPlayers: (req, res) => {
        const db = req.app.get('db');

        db.get_players()
            .then((returning) => {
                res.status(200).send(returning)
            })
    }, 

    addPlayer: (req, res) => {
        const db = req.app.get('db');

        db.add_player(req.body.playerName)
            .then(() => {
                db.get_players()
                    .then((returning) => {
                        postMessage(returning, req.body.nextScrim)
                        res.status(200).send(returning)
                    })
            })
    }, 

    deletePlayer: (req, res) => {
        const db = req.app.get('db');

        db.delete_player(req.body.playerName)
            .then(() => {
                db.get_players()
                    .then((returning) => {
                        res.status(200).send(returning)
                    })
            })
    },

    getScrimDates: (req, res) => {
        const db = req.app.get('db');

        db.get_scrim_dates()
            .then(returning => {
                res.status(200).send(returning)

            })
    },

    getTeams: (req, res) => {
        const db = req.app.get('db');

        db.get_teams()
            .then(returning => {
                res.status(200).send(returning)

            })
    },

    getNewTeams: (req, res) => {
        const db = req.app.get('db');

        teamSetup(req, res, db)
    }
} 