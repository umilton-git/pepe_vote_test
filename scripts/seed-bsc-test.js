// contracts
const Story = artifacts.require("./Story")

module.exports = async function(callback) {
  try {
    // Fetch accounts from wallet
    const accounts = await web3.eth.getAccounts()

    // Fetch the deployed Governance contract
    const story = await Story.deployed()
    console.log('Story fetched', story.address)

    // Setup the story users
    const deployer = accounts[0]
    const voter1 = accounts[1]
    const voter2 = accounts[2]

    // Create milestones

    // Create proposals
    await story.createProposal(1, 1, "Go to Ending 1", "End 1", {from: deployer})
    await story.createProposal(1, 2, "Go to Ending 2", "End 2", {from: deployer})
    await story.createProposal(1, 3, "Go to Ending 3", "End 3", {from: deployer})
    await story.createProposal(2, 1, "Go to Ending 1", "End 1", {from: deployer})
    await story.createProposal(2, 2, "Go to Ending 2", "End 2", {from: deployer})
    await story.createProposal(2, 3, "Go to Ending 3", "End 3", {from: deployer})
    await story.createProposal(3, 1, "Go to Ending 1", "End 1", {from: deployer})
    await story.createProposal(3, 2, "Go to Ending 2", "End 2", {from: deployer})
    await story.createProposal(3, 3, "Go to Ending 3", "End 3", {from: deployer})
    console.log("Created proposals for testing")
  }

  catch(error) {
    console.log(error)
  }

  callback()
}
