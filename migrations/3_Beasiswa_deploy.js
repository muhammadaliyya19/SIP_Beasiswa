var Beasiswa = artifacts.require("./Beasiswa.sol");

module.exports = function(deployer) {
  deployer.deploy(Beasiswa);
};
