import React, { Component } from "react";
import Beasiswa from "../contracts/Beasiswa.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl, Button } from 'react-bootstrap';

class DataDiri extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BeasiswaInstance: undefined,
      account: null,
      web3: null,
      registered: false,
      nama: '',
      nim: '',
      // ipk: '',
      ttl: '',
      alamat: '',
      email: '',
      isOwner: false
    }
  }

  updateNama = event => {
    this.setState({ nama: event.target.value });
  }

  updateNIM = event => {
    this.setState({ nim: event.target.value });
  }

  // updateIPK = event => {
  //   this.setState({ ipk: event.target.value });
  // }

  updateTTL = event => {
    this.setState({ ttl: event.target.value });
  }

  updateAlamat = event => {
    this.setState({ alamat: event.target.value });
  }

  updateEmail = event => {
    this.setState({ email: event.target.value });
  }

  simpanDataDiri = async () => {
    await this.state.BeasiswaInstance.methods.simpanDataDiri(this.state.nama, this.state.nim, this.state.ttl, this.state.alamat, this.state.email).send({ from: this.state.account, gas: 1000000 });
    // Reload
    window.location.href= '/DataDiri';
        // window.location.reload(false);
  }

  // ubahDataDiri = async () => {
  //   await this.state.BeasiswaInstance.methods.ubahDataDiri(this.state.nama, this.state.nim, this.state.ipk,
  //     this.state.ttl, this.state.alamat, this.state.email).send({ from: this.state.account, gas: 1000000 });
  //   // Reload
  //   window.location.href= '/DataDiri';
  //       // window.location.reload(false);
  // }

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

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ BeasiswaInstance: instance, web3: web3, account: accounts[0] });

      // let jumlahPemilih = await this.state.BeasiswaInstance.methods.mendapatkanJumlahPemilih().call();
      
    
    // Get Data Diri
    // console.log('load data diri');
    let dataDiriku = await this.state.BeasiswaInstance.methods.list_mahasiswa(this.state.account).call();        
    // console.log(dataDiriku);
    // console.log(dataDiriku[1] == "");
    if (dataDiriku[1] !== "") {
        // Kalau dataDiriKu ada maka dilakukan set-state
        this.setState({ 
            nama        : dataDiriku[1],
            nim         : dataDiriku[2],
            // ipk         : dataDiriku[3],
            ttl         : dataDiriku[3],
            alamat      : dataDiriku[4],
            email       : dataDiriku[5],
            registered  : true,
        });
    }

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
          <div className="CandidateDetails-title">
            <h1>
              Loading Web3, accounts, and contract..
            </h1>
          </div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    return (
        <div className="">
            <div className="CandidateDetails">
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                <div className="CandidateDetails-title">
                    <h1>DATA DIRI MAHASISWA</h1>
                </div>
            </div>
            <br></br>
            <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-10">
            
            {!this.state.registered ? (<span className="h4 text-danger"> Silakan Lengkapi Data Diri </span>) : ( "" )}
            
            <FormGroup>
                <label>Nama</label>
                <div className="form-input">
                    <FormControl
                        input='text'
                        value={this.state.nama}
                        onChange={this.updateNama}
                    />
                </div>
            </FormGroup>         
            <FormGroup>
                <label>NIM</label>
                <div className="form-input">
                    <FormControl
                        input='text'
                        value={this.state.nim}
                        onChange={this.updateNIM}
                    />
                </div>        
            </FormGroup>  
            <FormGroup>
                <label>Tempat / Tanggal Lahir</label>
                <div className="form-input">
                    <FormControl
                        input='text'
                        value={this.state.ttl}
                        onChange={this.updateTTL}
                    />
                </div>        
            </FormGroup>
            <FormGroup>
                <label>Alamat</label>
                <div className="form-input">
                    <FormControl
                        input='text'
                        value={this.state.alamat}
                        onChange={this.updateAlamat}
                    />
                </div>        
            </FormGroup>
            <FormGroup>
                <label>E-Mail</label>
                <div className="form-input">
                    <FormControl
                        input='text'
                        value={this.state.email}
                        onChange={this.updateEmail}
                    />
                </div>        
            </FormGroup>
            {this.state.registered ? "" : 
              <Button onClick={this.simpanDataDiri} className="button-vote">
                  {"Simpan Data Diri"}
              </Button>                
            }
          </div>
          <div className="col-lg-1"></div>                
          
          </div>


        </div>
    );
      
    
  }
}

export default DataDiri;
