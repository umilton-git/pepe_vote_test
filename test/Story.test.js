
const Story = artifacts.require("./Story")

require('chai')
 .use(require('chai-as-promised'))
 .should()

contract("Story", ([deployer, voter1, voter2]) => {
  let instance

  beforeEach(async () => {
    instance = await Story.new()
  })

  describe('Deployment', () => {
    describe('Creates a milestone', () => {
      it('Initializes the milestone', async () => {
        await instance.createMilestone(0, "Start Here")
        const result = await instance.getMilestoneMessage()
        result.should.equal("Start Here")
      })
      it('Creates the first proposal', async () => {
        await instance.createMilestone(0, "Start Here")
        await instance.createProposal(1, "Vote")
        const result = await instance.getProposalExist(0)
        result.toString().should.equal('true')
      })
      it('Only allows deployer to create milestones', async () => {
        await instance.createMilestone(0, "Start Here", {from: voter1}).should.be.rejectedWith('VM Exception while processing transaction: revert')
      })
      it('Only allows deployer to create proposals', async () => {
        await instance.createProposal(0, "Vote", {from: voter1}).should.be.rejectedWith('VM Exception while processing transaction: revert')
      })
    })
  })

  describe('Testing', () => {
    it('Tracks votes', async () => {
      await instance.createMilestone(0, "Start Here")
      await instance.createProposal(1, "Vote")
      await instance.vote(0, {from: deployer})
      const result = await instance.currentVotes()
      result.toString().should.equal("1")
    })
    it('Prevents double voting', async () => {
      await instance.createMilestone(0, "Start Here")
      await instance.createProposal(1, "Vote")
      await instance.vote(0, {from: deployer})
      await instance.vote(0, {from: deployer}).should.be.rejectedWith('VM Exception while processing transaction: revert')
    })
    it('Moves to next milestone as appropriate', async () => {
      await instance.createMilestone(0, "Start Here")
      await instance.createMilestone(2, "End Here")
      await instance.createProposal(2, "Vote")
      await instance.vote(2, {from: deployer})
      await instance.vote(2, {from: voter1})
      const result = await instance.currentMilestone()
      result.toString().should.equal('2')
    })
  })

describe('Events', () => {
  it('Tracks the createMilestone event', async () => {
    const result = await instance.createMilestone(0, "Start Here")
    const log = result.logs[0]
    log.event.should.eq("NewMilestone")
  })
  it('Tracks the createProposal event', async () => {
    await instance.createMilestone(0, "Start Here")
    const result = await instance.createProposal(2, "Vote")
    const log = result.logs[0]
    log.event.should.eq("NewProposal")
  })
  it('Tracks the Vote event', async () => {
    await instance.createMilestone(0, "Start Here")
    await instance.createProposal(2, "Vote")
    const result = await instance.vote(0, {from: deployer})
    const log = result.logs[0]
    log.event.should.eq("Voted")
  })
})
})
