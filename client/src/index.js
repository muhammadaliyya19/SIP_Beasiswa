import React from 'react';
import ReactDOM from 'react-dom';
import './assets/vendor/aos/aos.css';
import './assets/vendor/bootstrap/css/bootstrap.min.css';
import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './assets/vendor/boxicons/css/boxicons.min.css';
import './assets/vendor/glightbox/css/glightbox.min.css';
import './assets/vendor/swiper/swiper-bundle.min.css';
import './assets/css/style.css';
import DataDiri from './components/DataDiri';
import ListMahasiswa from './components/ListMahasiswa';
import AddBeasiswa from './components/AddBeasiswa';
import ListBeasiswa from './components/ListBeasiswa';
import RegistBeasiswa from './components/RegistBeasiswa';
import VerifyRegist from './components/VerifyRegist';
import LihatPeserta from './components/LihatPeserta';
import MyRegist from './components/MyRegist';
import Home from './components/Home';

// import * as serviceWorker from './serviceWorker';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
ers: https://bit.ly/CRA-PWA

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/AddBeasiswa' component={AddBeasiswa} />
            <Route path='/ListBeasiswa' component={ListBeasiswa} />
            <Route path='/ListMahasiswa' component={ListMahasiswa} />
            <Route path='/RegistBeasiswa/:id_beasiswa' component={RegistBeasiswa} />
            <Route path='/LihatPeserta/:id_beasiswa' component={LihatPeserta} />
            <Route path='/VerifyRegist/:id_beasiswa' component={VerifyRegist} />
            <Route path='/VerifyRegist/VerifyMhs/:id_mahasiswa' component={VerifyRegist} />
            <Route path='/MyRegist' component={MyRegist} />            
            <Route path='/DataDiri' component={DataDiri} />            
        </Switch>
    </Router>,
    document.getElementById('root')
);

// serviceWorker.unregister();
