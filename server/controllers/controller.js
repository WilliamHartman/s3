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