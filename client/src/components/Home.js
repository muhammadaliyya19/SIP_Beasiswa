import React, { Component } from "react";
import Beasiswa from "../contracts/Beasiswa.json";
import getWeb3 from "../getWeb3";
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';


class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BeasiswaInstance: undefined,
      account: null,
      web3: null,
      isOwner: false
    }
  }

  componentDidMount = async () => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Beasiswa.networks[networkId];
      const instance = new web3.eth.Contract(
        Beasiswa.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState({ BeasiswaInstance: instance, web3: web3, account: accounts[0] });

      const owner = await this.state.BeasiswaInstance.methods.Admin().call();
      if (this.state.account === owner) {
        this.setState({ isOwner: true });
      }

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <div className="CandidateDetails-title">
            <h1>
              Loading Web3, accounts, and contract..
            </h1>
          </div>
        </div>
      );
    }

    return (
      <div className="">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              HOME - {this.state.isOwner ? "ADMIN PORTAL" : "STUDENT PORTAL"}
            </h1>
          </div>
        </div>

        <section id="hero" class="d-flex align-items-center">
          <div class="container">
            <h1>SELAMAT DATANG DI <br></br><span>SISTEM INFORMASI DAN PENDAFTARAN BEASISWA</span></h1>
            <h2>FAKULTAS ILMU KOMPUTER UNIVERSITAS BRAWIJAYA<br></br>TAHUN 2022</h2>            
          </div>
        </section>

      </div>
    );
  }
}

export default Home;
