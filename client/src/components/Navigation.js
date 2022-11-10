import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Web3 from "web3";
import Beasiswa from "../contracts/Beasiswa.json";
const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:8545"
);
const web3 = new Web3('http://');

class Navigation extends Component {
    compareByteCode = async() => {
        try {
            const bchainCode = await web3.eth.getCode('0x7A2Fef8A2443836faE3bB2533950DCF8AF5B3260');
            const herexCode = "0x" + Beasiswa.deployedBytecode;
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

    render() {
        return (

            <header id="header" class="d-flex align-items-center">
                <div class="container d-flex align-items-center justify-content-between">
                <h1 class="logo"><a href="/">SIP BEASISWA</a></h1>
                <nav id="navbar" class="navbar">
                    <ul>
                    <li><a class="nav-link scrollto" href="/">HOME</a></li>
                    <li><a class="nav-link scrollto" href="/ListBeasiswa">INFO BEASISWA</a></li>
                    <li><a class="nav-link scrollto" href="/MyRegist">PENDAFTARAN SAYA</a></li>                    
                    <li><a className="nav-link scrollto" href="/DataDiri">DATA DIRI</a></li>                    
                    <li><a className="nav-link scrollto" href="#" onClick={this.compareByteCode}>Compare Byte Code</a></li>                    
                    </ul>
                    <i class="bi bi-list mobile-nav-toggle"></i>
                </nav>

                </div>
            </header>
        );
    }
}

export default Navigation;