import axios from "axios";
import React, { Component } from "react";
import './App.css';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      minutesLeftToDisplayTeams: 99440,
      players: [],
      newName: '',
      highlightedName: '',
      deleteName: '',
      todaysTimeDate: moment().format('LLLL'),
      scrimDaysTimes: {Tuesday: '5:30 PM', Thursday: '5:30 PM', Sunday: '4:00 PM'},
      nextScrim: '',
      timeUntilNextScrim: '',
      timeUntilText: '',
      greenTeam: '',
      greenTeamTwo: '',
      redTeam: '',
      redTeamTwo: '',
    }
    this.jsxPlayers = this.jsxPlayers.bind(this);
    this.jsxTeams = this.jsxTeams.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
  }

  componentDidMount() {
    let nextScrim = '';
    let timeUntilNextScrim = 99;
    let timeUntilText = '';

    for(let key in this.state.scrimDaysTimes){
      let dayNum = key === 'Tuesday' ? 2 : key === 'Thursday' ? 4 : 7

      let strDate = key + ', ' + moment().day(dayNum).format('LL') + ' ' + this.state.scrimDaysTimes[key]
      let momentDate = (moment(strDate).format('LLLL'))
      let timeUntilDate = moment(momentDate).diff(moment(), 'hours') 

      console.log(momentDate)
      console.log(timeUntilDate)

      if(timeUntilDate < timeUntilNextScrim && timeUntilDate >= 0){
        timeUntilNextScrim = timeUntilDate;
        nextScrim = momentDate;
        timeUntilText = moment(momentDate).fromNow()
      }
    }
    timeUntilText = timeUntilText.charAt(0).toUpperCase() + timeUntilText.slice(1) + '.'
    this.setState({nextScrim, timeUntilNextScrim, timeUntilText})

    axios.get(`/api/getPlayers`)
      .then(result => {
        let newPlayerList = result.data.map(player => player.player_name)
        if(moment(nextScrim).diff(moment(), 'minutes') < this.state.minutesLeftToDisplayTeams){
          axios.get(`/api/getTeams`).then((teamList) => {
            this.setState({
              players: newPlayerList,
              greenTeam: teamList.data[0].green_team,
              greenTeamTwo: teamList.data[0].green_team_two,
              redTeam: teamList.data[0].red_team,
              redTeamTwo: teamList.data[0].red_team_two,
            })
          })
        } else {
          this.setState({players: newPlayerList})
        }
      })
    
  }

  handleName(e){
    this.setState({newName: e.target.value})
  }

  handleEnterKey(e){
    if(e.key === 'Enter' && this.state.newName !== ''){
      axios.post(`/api/addPlayer`, {playerName: this.state.newName})
        .then(result => {
          let newPlayerList = result.data.map(player => player.player_name)
          if(moment(this.state.nextScrim).diff(moment(), 'minutes') < this.state.minutesLeftToDisplayTeams){
            axios.get(`/api/getNewTeams`).then((teamList) => {
              this.setState({
                players: newPlayerList,
                greenTeam: teamList.data[0].green_team,
                greenTeamTwo: teamList.data[0].green_team_two,
                redTeam: teamList.data[0].red_team,
                redTeamTwo: teamList.data[0].red_team_two,
                newName: '', 
                highlightedName: '', 
                deleteName: ''
              })
            })
          } else {
            this.setState({players: newPlayerList, newName: ''})
          }
        })
    }
  }  

  handleListClick(name){
    if(this.state.highlightedName === name){
      if(this.state.deleteName === name){
        axios.post(`/api/deletePlayer`, {playerName: name})
          .then(result => {
            let newPlayerList = result.data.map(player => player.player_name)
            if(moment(this.state.nextScrim).diff(moment(), 'minutes') < this.state.minutesLeftToDisplayTeams){
              axios.get(`/api/getNewTeams`).then((teamList) => {
                this.setState({
                  players: newPlayerList,
                  greenTeam: teamList.data[0].green_team,
                  greenTeamTwo: teamList.data[0].green_team_two,
                  redTeam: teamList.data[0].red_team,
                  redTeamTwo: teamList.data[0].red_team_two,
                  newName: '', 
                  highlightedName: '', 
                  deleteName: ''
                })
              })
            } else {
              this.setState({players: newPlayerList, newName: ''})
            }
          })
      } else {
        this.setState({deleteName: name})
      }
    } else {
      this.setState({highlightedName: name, deleteName: ''})
    }
  }

  jsxPlayers(){
    let jsxArr = this.state.players.map( (name, index) => {
      return (
        <li className={this.state.highlightedName === name ? this.state.deleteName === name ? 'app-list-delete' : 'app-list-highlighted' : 'app-list-item'} key={index} onClick={() => this.handleListClick(name)}>{name}</li>
      )
    })

    jsxArr.push(
    <li 
      className={'app-list-item'} 
      key={99}><input className={'app-name-input'} 
      placeholder={'Enter your name'} 
      onKeyDown={this.handleEnterKey} 
      onChange={this.handleName} 
      value={this.state.newName}
      >
        </input>
      </li>
    )

    return (
      <ol>{jsxArr}</ol>
    )
  }  

  jsxTeams(){
    let greenTeam = this.state.greenTeam.split(',');
    let redTeam = this.state.redTeam.split(',');
    let greenTeamTwo = this.state.greenTeamTwo.split(',');
    let redTeamTwo = this.state.redTeamTwo.split(',');
    
    let jsxGreenTeam = greenTeam.map( (player, index) => <li className={'app-list-item'} key={index}>{player}</li>)
    let jsxRedTeam = redTeam.map( (player, index) => <li className={'app-list-item'} key={index}>{player}</li>)
    let jsxGreenTeamTwo = greenTeamTwo.map( (player, index) => <li className={'app-list-item'} key={index}>{player}</li>)
    let jsxRedTeamTwo = redTeamTwo.map( (player, index) => <li className={'app-list-item'} key={index}>{player}</li>)

    return(
      <div>
        <div>
          <h4 className={'app-green-team'}>Green Team</h4>
          <ol>{jsxGreenTeam}</ol>
        </div>
        <div>
          <h4 className={'app-red-team'}>Red Team</h4>
          <ol>{jsxRedTeam}</ol>
        </div>
        {greenTeamTwo.length > 2 ? <div><h4 className={'app-green-team'}>Green Team Two</h4><ol>{jsxGreenTeamTwo}</ol></div> : null}
        {redTeamTwo.length > 2 ? <div><h4 className={'app-red-team'}>Green Team Two</h4><ol>{jsxRedTeamTwo}</ol></div>: null}
      </div>
    )
  }

  render(){

    return (
      <div className="App">
        <h1 className={'app-title'}>S3</h1>
        <h3 className={'app-subtitle'}>Soccer Scrimmage Signup</h3>
        <h3 className={'app-next-scrim'}>Next Scrimmage:</h3>
        <h3 className={'app-next-date'}>{this.state.nextScrim}</h3>
        <h3 className={'app-next-date'}>{this.state.timeUntilText}</h3>
        <h3 className={'app-next-scrim'}>Players Signed Up:</h3>
        {this.jsxPlayers()}
        {moment(this.state.nextScrim).diff(moment(), 'minutes') < this.state.minutesLeftToDisplayTeams ? this.jsxTeams() : null}
      </div>
    );
  }
}

export default App;
