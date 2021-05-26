const Story = artifacts.require("Story");

module.exports = async function(deployer) {
  await deployer.deploy(Story);
};
