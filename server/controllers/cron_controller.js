const moment = require('moment');

function teamSetup(app){
    const db = app.get('db');
    
    db.get_players().then((players) => {
        let numPlayers = players.length;
        let greenTeam = [];
        let redTeam = [];
        let greenTeamTwo = [];
        let redTeamTwo = [];
        console.log(numPlayers)

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
            
        })
    })
}

module.exports = function (cron, app) { 
    
    var tueThuTeamSort = new cron.CronJob('0 30 13 * * 2,4', function() {
        console.log('Cron Job start')
        teamSetup(app)

    }, function () {
        /* This function is executed when the job stops */
        console.log('Cron Job finish')
    },
    true, /* Start the job right now */
    'America/New_York' /* Time zone of this job. */
    )

    var sunTeamSort = new cron.CronJob('0 0 12 * * 6', function() {
        console.log('Cron Job start')
        teamSetup(app)

    }, function () {
        /* This function is executed when the job stops */
        console.log('Cron Job finish')
    },
    true, /* Start the job right now */
    'America/New_York' /* Time zone of this job. */
    )

    var tueThuDelete = new cron.CronJob('0 30 19 * * 2,4', function() {
        const db = app.get('db');
        db.truncate_players()
        db.post_teams('','','','')

    }, function () {
        /* This function is executed when the job stops */
        console.log('Cron Job finish')
    },
    true, /* Start the job right now */
    'America/New_York' /* Time zone of this job. */
    )

    var sunDelete = new cron.CronJob('0 0 18 * * 6', function() {
        const db = app.get('db');
        db.truncate_players()
        db.post_teams('','','','')

    }, function () {
        /* This function is executed when the job stops */
        console.log('Cron Job finish')
    },
    true, /* Start the job right now */
    'America/New_York' /* Time zone of this job. */
    )
}