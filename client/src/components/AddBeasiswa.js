// deklarasi import
import React, { Component } from "react";
import Beasiswa from "../contracts/Beasiswa.json";
import getWeb3 from "../getWeb3";
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import emailjs from '@emailjs/browser';

class AddBeasiswa extends Component {
    constructor(props) {
        super(props)
//state/kondisi
        this.state = {
            BeasiswaInstance: undefined,
            account: null,
            web3: null,
            email_all_mhs: '',
            judul: '',
            deskrpsi: '',
            main_link: '',
            kuota: ''
        }
    }
    // deklarasi fungsi updateJudul untuk mengubah nilai dari state judul
    updateJudul = event => {
        this.setState({ judul: event.target.value });
    }
    // deklarasi fungsi updateDeskripsi untuk mengubah nilai dari state deskripsi
    updateDeskripsi = event => {
        this.setState({ deskrpsi: event.target.value });
    }
    // deklarasi fungsi updateMainLink untuk mengubah nilai dari state MainLink
    updateMainLink = event => {
        this.setState({ main_link: event.target.value });
    }
    // deklarasi fungsi updateKuota untuk mengubah nilai dari state kuota
    updateKuota = event => {
        //console.log(event.target.value);
        this.setState({ kuota: event.target.value });
    }

    sendNotifEmail = event => {
        // event.preventDefault();
        let data_email = {
            judul: this.state.judul,
            deskripsi: this.state.deskrpsi,
            kuota: this.state.kuota,
            from_name: 'SIP BEASISWA',
            to_name:'Sobat SIP Mahasiswa',
            // to_email:'muhammadasaadilhaqisya@gmail.com, aliyyailmi20@gmail.com',
            to_email:this.state.email_all_mhs,
            reply_to:'muhammadasaadilhaqisya@gmail.com',
            message: 'Pesan baru nih',
        };
        emailjs.send('service_pfikdd8', 'template_4ok708j', data_email, 'BEt5phAuTwtxz4Nhw');
    }

    //pemamggilan method penambahan beasiswa dan parameter2
    penambahanBeasiswa = async () => {
        console.log('OTW send email');
        this.sendNotifEmail();
        console.log('Beres send email');
        await this.state.BeasiswaInstance.methods.penambahanBeasiswa(this.state.judul, this.state.deskrpsi, this.state.main_link, this.state.kuota).send({ from: this.state.account, gas: 1000000 });
        window.location.href= '/ListBeasiswa';
    }
     //menyapkan 1 halaman yang siap digunakan
    componentDidMount = async () => {

        // SELEKSI KONDISI, SAAT HALAMAN SIAP DI JALANKAN-
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
        try {
            //Dapatkan penyedia jaringan dan instance web3.
            const web3 = await getWeb3();
            // Gunakan web3 untuk mendapatkan akun pengguna.
            const accounts = await web3.eth.getAccounts();

            // Dapatkan contoh kontrak.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Beasiswa.networks[networkId];
            const instance = new web3.eth.Contract(
                Beasiswa.abi,
                deployedNetwork && deployedNetwork.address,
            );
            // Setel web3, akun, dan kontrak ke negara bagian, lalu lanjutkan dengan
            // contoh interaksi dengan metode kontrak.

            this.setState({ BeasiswaInstance: instance, web3: web3, account: accounts[0] });

            let jumlah_all_mhs = await this.state.BeasiswaInstance.methods.getSumAllMahasiswa().call();
            
            let list_email_mhs = '';
            for (let i = 0; i < jumlah_all_mhs; i++) {
                let mhs = await this.state.BeasiswaInstance.methods.list_mahasiswa_admin(i).call();
                list_email_mhs += mhs.email + ', ';                
            }

            this.setState({email_all_mhs: list_email_mhs});

            // Memamnggil admin, Apakah orang yang login sekarang adalah orang yang bersangkutan
            const owner = await this.state.BeasiswaInstance.methods.Admin().call();
            if (this.state.account === owner) {
                this.setState({ isOwner: true });
            }

        } catch (error) {
            //Menangkap kesalahan untuk salah satu operasi di atas.

            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };
//menjalankan UI 
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

        if (!this.state.isOwner) {
            return (
                <div className="CandidateDetails">
                    {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                    <div className="CandidateDetails-title">
                        <h1>
                            HANYA ADMIN YANG BISA MENGAKSES
                        </h1>
                    </div>
                </div>
            );
        }
        return (
            <div className="">
                <div className="CandidateDetails">
                {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
                    <div className="CandidateDetails-title">
                        <h1>
                            Penambahan Beasiswa
                        </h1>
                    </div>
                </div>
                <br></br>
                <div className="row">
                <div className="col-lg-1"></div>
                <div className="col-lg-10">
                    <FormGroup>
                        <label>Masukan Judul</label>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.judul}
                                onChange={this.updateJudul}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label>Link Tahap Dua</label>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.main_link}
                                onChange={this.updateMainLink}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label>Kuota</label>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.kuota}
                                onChange={this.updateKuota}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                    <label>Deskripsi</label>
                    <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.deskrpsi}
                                onChange={this.updateDeskripsi}
                            />
                        </div>
                    </FormGroup>                    
                    <br></br>
                    <Button onClick={this.penambahanBeasiswa} className="btn btn-md btn-primary">
                        Tambah
                    </Button>
                    <br></br>
                    <br></br>
                </div>
                <div className="col-lg-1"></div>                
                </div>

            </div>
        );
    }
}

export default AddBeasiswa;
