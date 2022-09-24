import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
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
                    </ul>
                    <i class="bi bi-list mobile-nav-toggle"></i>
                </nav>

                </div>
            </header>
        );
    }
}

export default Navigation;