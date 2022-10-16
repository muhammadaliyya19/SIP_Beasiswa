import React, { Component } from "react";
import Beasiswa from "../contracts/Beasiswa.json";
import getWeb3 from "../getWeb3";
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import * as filestack from 'filestack-js';
// const client = filestack.init('A9Cp7gizZS1uCciQzfBZSz');
class RegistBeasiswa extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BeasiswaInstance: undefined,
      client: undefined,
      account: null,
      web3: null,
      client_filestack: null,
      options: null,
      nama: '',
      nim: '',
      ipk: '',
      ttl: '',
      alamat: '',
      fileKHS: "Pilih File KHS (Pdf Only)",
      urlKHS: null,
      beasiswa_id: null,
      terdaftar: false,
      is_verified: 0,
      isOwner: false
    }
  }

  updateIPK = event => {
    this.setState({ ipk: event.target.value });
  }

  updateFileKHS = (res) => {
    console.log(res);
    this.setState({ urlKHS: res.filesUploaded[0].url, fileKHS: res.filesUploaded[0].filename });
  }

  lamarBeasiswa = async () => {
    console.log("filename", this.state.fileKHS);
    console.log("url", this.state.urlKHS);
    await this.state.BeasiswaInstance.methods.mendaftarBeasiswa(this.state.beasiswa_id, this.state.ipk, this.state.fileKHS, this.state.urlKHS).send({ from: this.state.account, gas: 1000000 });
    // await this.state.BeasiswaInstance.methods.mendaftarBeasiswa(this.state.beasiswa_id, this.state.ipk).send({ from: this.state.account, gas: 1000000 });
    // Reload
    window.location.href= '/MyRegist';
        // window.location.reload(false);
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

      // Init filestack
      var cli_filestack = filestack.init('A9Cp7gizZS1uCciQzfBZSz'); 
      this.setState({ client_filestack: cli_filestack });

      const options = {
        maxFiles: 20,
        uploadInBackground: false,
        onOpen: () => console.log('opened!'),
        onUploadDone: (res) => {
          console.log(res); 
          this.updateFileKHS(res);
        },
      };
      this.setState({ options: options });      

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
      
      // GET PARAMS
      // Get params
      const this_params = this.props.match.params;
      this.setState({ beasiswa_id: this_params.id_beasiswa });

      // Cek status pendaftaran
      let terdaftar = await this.state.BeasiswaInstance.methods.cek_regist_exist(this.state.account, this.state.beasiswa_id).call();
      this.setState({ terdaftar: terdaftar });

      let dataDiriku = await this.state.BeasiswaInstance.methods.list_mahasiswa(this.state.account).call();        
      if (dataDiriku[1] !== "") {
        // Kalau dataDiriKu ada maka dilakukan set-state
        this.setState({ 
            nama        : dataDiriku[1],
            nim         : dataDiriku[2],
            ttl         : dataDiriku[3],
            alamat      : dataDiriku[4],
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

    if (this.state.terdaftar) {
      return (
        <div className="">
          <div className="CandidateDetails">
            {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
            <div className="CandidateDetails-title">
              <h1>
                FORMULIR PENDAFTARAN BEASISWA - Tahap 1
              </h1>
            </div>
          </div>
          <br></br>
          <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-10">                     
            <h1 className="text-center">
              Anda Sudah Mendaftar Beasiswa Ini.
            </h1>         
          </div>
          <div className="col-lg-1"></div>                          
          </div>
        </div>
      );
    }else{
      return (
        <div className="">
          <div className="CandidateDetails">
                  {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                      <div className="CandidateDetails-title">
                          <h1>
                              FORMULIR PENDAFTARAN BEASISWA - Tahap 1
                          </h1>
                      </div>
                  </div>
                  <br></br>
                  <div className="row">
                  <div className="col-lg-1"></div>
                  <div className="col-lg-10">
          
                  <FormGroup>
                    <label>Nama</label>
                    <div className="form-input">
                      <FormControl
                        input='text'
                        value={this.state.nama}
                        onChange={this.updateNama}
                        readOnly
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
                        readOnly
                      />
                    </div>
                  </FormGroup>
                  <div className="row">
                    <div className="col-8">
                      <FormGroup>
                        <label>IPK</label>
                        <div className="form-input">
                          <FormControl
                            input='text'
                            value={this.state.ipk}
                            onChange={this.updateIPK}
                          />
                        </div>
                      </FormGroup>
                    </div>
                    <div className="col-4">
                    <FormGroup>
                      <label>File KHS</label><br></br>
                      <div className="form-input">
                          <Button variant="primary" type="submit" className="form-control"
                            onClick={() => (
                              this.state.client_filestack.picker(
                                this.state.options
                              ).open()
                            )}
                          >
                            {this.state.fileKHS}
                          </Button>
                        </div>                      
                      </FormGroup>
                    </div>                    
                  </div>                    
                  <FormGroup>
                    <label>Tempat / Tanggal Lahir</label>
                    <div className="form-input">
                      <FormControl
                        input='text'
                        value={this.state.ttl}
                        onChange={this.updateTTL}
                        readOnly
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
                        readOnly
                      />
                    </div>
                  </FormGroup>  
                  <FormGroup>
                    <label>Pilih Beasiswa (Input Kode Beasiswa)</label>
                    <div className="form-input">
                      <FormControl
                        input='text'
                        readOnly
                        value={this.state.beasiswa_id}
                        onChange={this.updateBeasiswaId}
                      />
                    </div>
                  </FormGroup>

                  <Button onClick={this.lamarBeasiswa} className="button-vote">
                    Daftar
                  </Button>
          </div>
          <div className="col-lg-1"></div>                
          
          </div>

          <script crossorigin src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
          <script type="javascript">
            const client = filestack.init("A9Cp7gizZS1uCciQzfBZSz");
            client.picker().open();
          </script>

        </div>
      );
    }
  }
}

export default RegistBeasiswa;
