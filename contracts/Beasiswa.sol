// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.17;
// pragma experimental ABIEncoderv2;

//atribut dan fungsi
contract Beasiswa {
    address public admin;
    uint jumlah_beasiswa;
    uint jumlah_pendaftar_all;
    uint jumlah_mahasiswa;

    function Beasiswa() public {     
        admin = msg.sender; 
        jumlah_beasiswa = 0;
        jumlah_pendaftar_all = 0;
        jumlah_mahasiswa = 0;
    }
    // Fungsi restrict / batas agar hanya bisa diakses oleh admin
    function Admin() public view returns(address) {
        return admin;
    }
    // hanya admin yang bisa mengakses
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // Set up struktur data Beasiswa
    struct Data_Beasiswa{
        uint id;
        string judul;
        string deskripsi;
        string main_link;
        bool is_active;
        uint kuota;
        uint jumlah_pendaftar;
    }

    // Pemetaan atau memasukkan data tunggal beasiswa agar menjadi suatu kumpulan data beasiswa
    mapping(uint => Data_Beasiswa) public List_Beasiswa;

    // memiliki beberapa parameter yang hanya dapat di akses oleh admin saja 
        function penambahanBeasiswa(string _judul, string _deskripsi, string _main_link, uint _kuota) public onlyAdmin() {
    // membuat data beasiswa baru dari atribut-atribut yang sudah di sediakan     
        Data_Beasiswa memory newBeasiswa = Data_Beasiswa({
            id : jumlah_beasiswa,
            judul : _judul,
            deskripsi : _deskripsi,
            main_link : _main_link,
            is_active : true,
            kuota : _kuota,
            jumlah_pendaftar : 0
        });
        // menambahkan list beasiswa menggunkan array
        List_Beasiswa[jumlah_beasiswa] = newBeasiswa;
        jumlah_beasiswa += 1;
    }
    // fungsi mengmbalikan jumalah beasisawa yang terdaftar di sistem
    function getSumBeasiswa() public view returns (uint) {
        return jumlah_beasiswa;
    }

    // Set up data pelamar beasiswa
    struct MahasiswaPelamar {
        address id_mhs;
        uint is_verified;
        string ipk;
        string alasan;
        uint beasiswa_id;
    }

    mapping(uint => MahasiswaPelamar) public list_mahasiswa_pendaftar;

    function mendaftarBeasiswa(uint _beasiswa_id, string _ipk) public {
        uint kuota = List_Beasiswa[_beasiswa_id].kuota;
        uint jumlah_pendaftar = List_Beasiswa[_beasiswa_id].jumlah_pendaftar;
        // Harus masih ada kuota tersisa
        require((kuota - jumlah_pendaftar) > 0);
        require(List_Beasiswa[_beasiswa_id].is_active);
        // string [] initArr;
        // initArr.push("0");
        // initArr.push("-");
        MahasiswaPelamar memory newMahasiswaPelamar = MahasiswaPelamar({
            id_mhs : msg.sender,
            is_verified : 0,
            alasan : "",
            ipk : _ipk,
            beasiswa_id : _beasiswa_id
        });
        list_mahasiswa_pendaftar[jumlah_pendaftar_all] = newMahasiswaPelamar;
        List_Beasiswa[_beasiswa_id].jumlah_pendaftar += 1;
        jumlah_pendaftar_all += 1;
    }

    //fungsi mengmbalikan total jumalah semua pendaftar yang terdaftar di sistem 
    function getSumAllPendaftar() public view returns (uint) {
        return jumlah_pendaftar_all;
    }
    // fungsi mengembalikan jumlah pendaftar di setiap beasiswa
    function getSumPendaftar(uint beasiswa) public view returns (uint) {
        return List_Beasiswa[beasiswa].jumlah_pendaftar;
    }

    // Untuk admin memverifikasi tahap 1 pendaftaram, sebelum mhs lanjut ke situs utama
    function verify_mahasiswa(uint _id_mhs, uint status, string alasan) public onlyAdmin() {
        list_mahasiswa_pendaftar[_id_mhs].is_verified = status;
        list_mahasiswa_pendaftar[_id_mhs].alasan = alasan;
    }    

    // function ubahStatusBeasiswa(uint _id_beasiswa, bool status) public onlyAdmin() {
    //     List_Beasiswa[_id_beasiswa].is_active = status;
    // }    

//mencegah pendaftaran lebih dari sekali di beasiswa yang sama 
    function cek_regist_exist(address mhs, uint beasiswa_id) public view returns (bool){
        bool terdaftar = false;
        for (uint i = 0; i < jumlah_pendaftar_all; i++) {
            if (list_mahasiswa_pendaftar[i].id_mhs == mhs && list_mahasiswa_pendaftar[i].beasiswa_id == beasiswa_id) {
                terdaftar = true;
                break;
            }
        }    
        return terdaftar;
    }

    // Set up mahasiswa, data diri saja. Bukan data pelamar.
    struct Mahasiswa {
        address id_mhs;
        string nama;
        string nim;
        // string ipk;
        string ttl;
        string alamat;
        string email;
    }

    //Pemetaan atau memasukkan data tunggal mahasiswa yang mendaftar agar menjadi suatu kumpulan data mahasiswa
    mapping(address => Mahasiswa) public list_mahasiswa;
    mapping(uint => Mahasiswa) public list_mahasiswa_admin;

    function simpanDataDiri(string _nama, string _nim, string _ttl, string _alamat, string _email) public {
        Mahasiswa memory newMahasiswa = Mahasiswa({
            id_mhs : msg.sender,
            nama : _nama,
            nim : _nim,
            // ipk : _ipk,
            ttl : _ttl,
            alamat : _alamat,
            email : _email
        });
        list_mahasiswa[msg.sender] = newMahasiswa;
        list_mahasiswa_admin[jumlah_mahasiswa] = newMahasiswa;
        jumlah_mahasiswa += 1;
    }
    
    function getSumAllMahasiswa() public view returns (uint) {
        return jumlah_mahasiswa;
    }

    function getAllMahasiswa() public view returns (Mahasiswa[] memory) {
        Mahasiswa[] memory allMhs = new Mahasiswa[](jumlah_mahasiswa);
        for (uint i = 0; i < jumlah_mahasiswa; i++) {
            Mahasiswa storage mhs = list_mahasiswa_admin[i];
            allMhs[i] = mhs;
        }
        return allMhs;
        // return list_mahasiswa_admin[0];
    }

    function getMahasiswa(address mhs) public view returns (Mahasiswa memory) {
        return list_mahasiswa[mhs];
    }   

    
    
    
}