import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Story from './abis/Story.json'
import './SiteHeader.css'

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
    const network = await web3.eth.net.getNetworkType()
    const networkID = await web3.eth.net.getId()
    const accounts = await web3.eth.getAccounts()
    //console.log("abi", Story.abi)
    const story = await new web3.eth.Contract(Story.abi, Story.networks[networkID].address)
    this.setState({ account: accounts[0] })
    //console.log("Network: ", network)
    //console.log("Network ID: ", networkID)
    console.log("Vote Contract: ", story)
    console.log("Account: ", accounts[0])
    const currentMilestoneName = await story.methods.getMilestoneName().call()
    const proposal1Name = await story.methods.getProposalName(0).call()
    const proposal2Name = await story.methods.getProposalName(1).call()
    const proposal3Name = await story.methods.getProposalName(2).call()
    this.setState({currentMilestone: currentMilestoneName})
    this.setState({proposal1: proposal1Name})
    this.setState({proposal2: proposal2Name})
    this.setState({proposal3: proposal3Name})
    this.setState({Vote: story})
    console.log("Current Milestone Name:", currentMilestoneName)
    console.log("Proposal 1 Name:", proposal1Name)
    console.log("Proposal 2 Name:", proposal2Name)
    console.log("Proposal 3 Name:", proposal3Name)
  }

  constructor(props){
    super(props)
    this.state = { account: '', currentMilestone: '', proposal1: '', proposal2: '', proposal3: '', Vote: '' }
  }

render(){
  return (
    <div className="App">
    <div className="SiteHeader">
        <header>
          <h1>Vote Test</h1>
          <div className="header-text">
          {this.state.account}
          <br></br>
          <br></br>
          {this.state.currentMilestone}
          <br></br>
          <br></br>
          </div>
          <button className="myButton" onClick={(e) => {this.state.Vote.methods.vote(0).send({ from: this.state.account })}}>{this.state.proposal1}</button>
          <button className="myButton" onClick={(e) => {this.state.Vote.methods.vote(1).send({ from: this.state.account })}}>{this.state.proposal2}</button>
          <button className="myButton" onClick={(e) => {this.state.Vote.methods.vote(2).send({ from: this.state.account })}}>{this.state.proposal3}</button>
        </header>
      </div>
      <div className="App-header">

      </div>
    </div>
  );
}
}

export default App;
