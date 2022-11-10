import Web3 from "web3";
import Beasiswa from "../contracts/Beasiswa.json";
const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:8545"
);
const web3 = new Web3('http://');
web3.setProvider(provider);
const compareByteCode = async() => {
    try {
        const bchainCode = await web3.eth.getCode('0x5a06bb48c99e87221d5d56579b04150ecb42079624c50d041b7e6a8133572623');
        const herexCode = "0x" + Beasiswa.evm.deployedBytecode.object;
        console.log("Herex Code\n");
        console.log(herexCode + "\n");
        console.log("Blockhain Code\n");
        console.log(bchainCode);
        if (bchainCode == herexCode) {
            console.log('\n DeployedByteCode dan Bytecode dari getCode sama!');
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(error);
      }
}

compareByteCode();