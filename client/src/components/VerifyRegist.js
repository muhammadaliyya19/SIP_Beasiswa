import React, { Component } from "react";
import Beasiswa from "../contracts/Beasiswa.json";
import getWeb3 from "../getWeb3";
import { Form, FormGroup, FormControl, Button, Modal } from 'react-bootstrap';
import '../index.css';
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
// import { Link, useParams, useRoute } from 'react-router-dom';

class VerifyRegist extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BeasiswaInstance: undefined,
      account: null,
      web3: null,
      BeasiswaId : null,
      SemuaRegist: null,
      show: false,
      id_mhs: "",
      nama: "",
      nim: "",
      is_verified: 0,
      alasan: "",
      isOwner: false
    }
//inisiasi fungsi menampilkan pop up
    this.handleClose = this.handleClose.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  handleShowModal(id_mhs){
    let nama = this.state.SemuaRegist[id_mhs].nama;
    let nim = this.state.SemuaRegist[id_mhs].nim;
    this.setState({
        show: true, id_mhs: id_mhs, nama: nama, nim: nim
    })
  }

  handleClose(){
      this.setState({
          show:false
      })
  }

  updateStatus = event => {
    this.setState({ is_verified: event.target.value });
  }  

  updateAlasan  = event => {
    this.setState({ alasan: event.target.value });
  }

  verifikasi = async (id_mhs) => {
    let alasan = this.state.alasan;
    let is_verified = this.state.is_verified;
    console.log(alasan);
    console.log(is_verified);    
    // this.state.BeasiswaInstance.methods.verify_mahasiswa(mhs, is_verified, alasan).send({ from: this.state.account, gas: 1000000 });    
    await this.state.BeasiswaInstance.methods.verify_mahasiswa(id_mhs, is_verified, alasan).send({ from: this.state.account, gas: 1000000 });    
    window.location.reload(false);
    // // window.location.href= '/ListBeasiswa';
    
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

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ BeasiswaInstance: instance, web3: web3, account: accounts[0] });

      // Get params
    const this_params = this.props.match.params;
    this.setState({ BeasiswaId: this_params.id_beasiswa });
      
    let jumlah_beasiswa = await this.state.BeasiswaInstance.methods.getSumBeasiswa().call();
    let daftar_beasiswa = [];
    for (let i = 0; i < jumlah_beasiswa; i++) {
        let beasiswa = await this.state.BeasiswaInstance.methods.List_Beasiswa(i).call();
        daftar_beasiswa.push(beasiswa);
    }
      
      //   Populasi pendaftaran saya
    let jumlahPendaftar = await this.state.BeasiswaInstance.methods.getSumAllPendaftar().call();
    let ListPendaftaran = [];
      for (let i = 0; i < jumlahPendaftar; i++) {
        let detailPendaftar = await this.state.BeasiswaInstance.methods.list_mahasiswa_pendaftar(i).call();                
        
        let biodataPendaftar = await this.state.BeasiswaInstance.methods.list_mahasiswa(detailPendaftar[0]).call();                
        
        // Set biodata p[endaftar]
        detailPendaftar.nama = biodataPendaftar.nama;
        detailPendaftar.nim = biodataPendaftar.nim;
        detailPendaftar.alamat = biodataPendaftar.alamat;
        // detailPendaftar.ipk = biodataPendaftar.ipk;

        // Set judul beasiswa
        detailPendaftar.namaBeasiswa = daftar_beasiswa[detailPendaftar.beasiswa_id].judul;        
        
        ListPendaftaran.push(detailPendaftar);        
      }
      this.setState({ SemuaRegist: ListPendaftaran });      
      
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
    // let id;          
    let idB = this.state.BeasiswaId;
    let allRegist = [];    
    if (this.state.SemuaRegist) {
      if (this.state.SemuaRegist.length > 0) {
        for (let j = 0; j < this.state.SemuaRegist.length; j++) {
          // console.log("Cek Data",this.state.SemuaRegist[j]);
          if(this.state.SemuaRegist[j].beasiswa_id == idB){
            let statusVerif = [];
            let buttonVerif = [];
            let alasanLolos = [];
            switch (this.state.SemuaRegist[j].is_verified) {
              case '1':
                buttonVerif.push("");
                statusVerif.push(<span className="text-success">Lolos Verifikasi</span>);
                alasanLolos.push("Alasan Kelolosan : ");
                alasanLolos.push(this.state.SemuaRegist[j].alasan);              
                break;
              case '2':
                buttonVerif.push("");
                statusVerif.push(<span className="text-danger">Tidak Lolos Verifikasi</span>);
                alasanLolos.push("Alasan Tidak Lolos : ");
                alasanLolos.push(this.state.SemuaRegist[j].alasan);              
                break;
              default:
              buttonVerif.push(<Button variant="primary" onClick={() => this.handleShowModal(j)}>Verifikasi</Button>);              
              statusVerif.push(<span className="text-primary">Belum Diverifikasi</span>);
              break;
            }
            allRegist.push(
              <div className="candidate">
                <div className="candidateName">{this.state.SemuaRegist[j].nama} || {statusVerif}</div>
                <div className="CandidateDetails">            
                  <div>NIM : {this.state.SemuaRegist[j].nim}</div>
                  <div>Alamat : {this.state.SemuaRegist[j].alamat}</div>
                  <div>IPK : {this.state.SemuaRegist[j].ipk}</div>
                  <div>ID Beasiswa : {this.state.SemuaRegist[j].beasiswa_id}</div>
                  <div>Nama Beasiswa : {this.state.SemuaRegist[j].namaBeasiswa}</div>
                  <div>File KHS : <a class="nav-link h4 scrollto" target="_blank" href={this.state.SemuaRegist[j].urlKHS}>{this.state.SemuaRegist[j].fileKhs}</a></div>
                  <div>{alasanLolos}</div>
                </div>
                <div className="CandidateDetails">            
                  {buttonVerif}
                  {
                    <Modal show={this.state.show} onHide={this.handleClose} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Verifikasi Pendaftaran</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                          <label>Nama</label>
                          <div className="form-input">
                            <FormControl
                              input='text'
                              disabled='true'
                              value={this.state.nama}
                            />
                          </div>
                        </FormGroup>          
                        <FormGroup>
                          <label>NIM</label>
                          <div className="form-input">
                            <FormControl
                              input='text'
                              disabled='true'
                              value={this.state.nim}
                            />
                          </div>
                        </FormGroup>
                        <FormGroup>
                        <label>Status Verifikasi</label>
                          
                          <Form.Control 
                            as="select"
                            className="form-control"
                            custom
                            onChange={this.updateStatus.bind(this)}
                          >
                            <option value="0"> -- Pilih Status Verifikasi -- </option>
                            <option value="1"> Lolos Verifikasi </option>
                            <option value="2"> Tidak Lolos Verifikasi </option>                    
                          </Form.Control>
                        </FormGroup>
                        <FormGroup>
                          <label>Alasan Status Verifikasi</label>
                          <div className="form-input">
                            <FormControl
                              input='text'
                              onChange={this.updateAlasan.bind(this)}
                            />
                          </div>
                        </FormGroup>                
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { this.verifikasi(this.state.id_mhs) }}>
                            Simpan
                        </Button>
                        <Button variant="danger" onClick={this.handleClose}>
                            Batal
                        </Button>
                    </Modal.Footer>
                </Modal>
                  }
                </div>
                <br></br>
              </div>
            );
          }        
        }    
      }else{
        allRegist.push(
            <h1> BELUM ADA DATA PENDAFTAR </h1>
          );
      }
    }

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

    if (!this.state.isOwner) {
      return (        
            <h1>
              HANYA ADMIN YANG BISA MENGAKSES
            </h1>
      );
    }

    return (
      <div>
        <div className="CandidateDetails">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <div className="CandidateDetails-title">
            <h1>
              VERIFIKASI PENDAFTARAN {/*this.state.SemuaRegist[this.state.BeasiswaId].namaBeasiswa*/}
            </h1>
          </div>
        </div>

        <div>
          {allRegist}
        </div>
      </div>
    );
  }
}

export default VerifyRegist;
