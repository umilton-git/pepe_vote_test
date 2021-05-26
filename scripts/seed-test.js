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
    await story.createMilestone(0, "Start Here", "Start", "Which ending?", {from: deployer})
    await story.createMilestone(1, "This is the first ending", "Ending 1", "End here?", {from: deployer})
    await story.createMilestone(2, "This is the second ending", "Ending 2", "End here?", {from: deployer})
    await story.createMilestone(3, "This is the third ending", "Ending 3", "End here?", {from: deployer})
    console.log("Created 4 milestones for testing")

    // Create proposals
    await story.createProposal(0, 1, "Go to Ending 1", "End 1", {from: deployer})
    await story.createProposal(0, 2, "Go to Ending 2", "End 2", {from: deployer})
    await story.createProposal(0, 3, "Go to Ending 3", "End 3", {from: deployer})
    console.log("Created proposals for testing")
  }

  catch(error) {
    console.log(error)
  }

  callback()
}
