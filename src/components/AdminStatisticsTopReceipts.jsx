import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import AdminNavbar from './AdminNavbar'
import { MDBDataTable } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar, faStamp } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'react-bootstrap'
import { CircleLoader } from 'react-spinners';

function AdminStatisticsTopReceipts() {

    let tierCustomers = 1

    const [articles, setArticles] = useState([])
    const [emptyArray, setEmptyArray] = useState(0)

    useEffect(() => {
        const readStatisticsArticles = "http://localhost/pin-elektra/src/php/admin_statisticsCustomerReceipt.php"
        axios.post(readStatisticsArticles).then((response) => {
            setArticles(response.data)
            console.log(response.data)
        })
    }, [emptyArray])

    if (articles === []) {
        setEmptyArray(emptyArray + 1)
    }

    return (
        <div style={{ overflowX: 'hidden', height: '100vh', background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(237,41,56,0.4433123591233369) 100%)' }}>
            <AdminNavbar />
            <div className='container' style={{ marginTop: '10px' }}>
                <div className='row'>
                    <div className="col-sm">
                        <table class="table table-striped table-hover table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Rbr.</th>
                                    <th scope="col">Kupac ID</th>
                                    <th scope="col">Ime</th>
                                    <th scope="col">Prezime</th>
                                    <th scope="col">OIB</th>
                                    <th scope="col">Račun ID</th>
                                    <th scope="col">Račun iznos</th>
                                    <th scope='col'>Stavke</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    articles.map((item) => (
                                        item.iznos_racuna != null ? (
                                            <tr key={item.sifra_stavke}>
                                                <th scope='row'>{tierCustomers++}.</th>
                                                <td>{item.sifra_kupca}</td>
                                                <td>{item.ime_kupca}</td>
                                                <td>{item.prezime_kupca}</td>
                                                <td>{item.oib_kupca}</td>
                                                <td>{item.sifra_racuna}</td>
                                                <td>{parseFloat(item.iznos_racuna).toFixed(2)} kn</td>
                                                <td><ModalItems bill={item.sifra_racuna} /></td>
                                            </tr>
                                        ) : (
                                            <tr key={item.sifra_stavke}>
                                                <th scope='row'>{tierCustomers++}.</th>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                                <td>Kupac obrisan</td>
                                            </tr>
                                        )
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ModalItems(props) {
    const [show, setShow] = useState(false) //otvori/zatvori modal

    const handleClose = () => setShow(false)  //zatvori modal
    const handleShow = () => setShow(true)    //otvori modal

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='btn btn-warning btn-sm'>
                <FontAwesomeIcon icon={faFileInvoiceDollar} />   {/* Dugme za dodavanje novog kupca */}
            </Button>

            <Modal show={show} onHide={handleClose} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Pregled stavki za račun: <p style={{ display: 'inline', fontWeight: '700', fontFamily: 'cursive' }}>{props.bill}</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalShowItems bill={props.bill} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export function ModalShowItems(props) {

    const [customersBills, setCustomersBills] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        var params = new URLSearchParams();
        params.append('receiptId', props.bill)
        const readReceiptItems = "http://localhost/pin-elektra/src/php/admin_readReceiptItems.php"
        axios.post(readReceiptItems, params).then((response) => {
            setCustomersBills(response.data)
            setLoaded(true)
            console.log(response.data)
        })
    }, [])

    return (
        <div style={{ overflowX: 'hidden' }}>
            <div className='container' style={{ marginTop: '10px' }}>
                <div className='row'>
                    <div className="col-sm">
                        {loaded ? (
                            (parseInt(customersBills[0].sifra_artikla) === 100) ? (
                                <table class="table table-striped table-hover table-borderless table-info ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Stavka ID</th>
                                            <th scope="col">Artikl ID</th>
                                            <th scope="col">Naziv artikla</th>
                                            <th scope="col">Račun ID</th>
                                            <th scope="col">Količina artikla</th>
                                            <th scope="col">Iznos stavke</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            customersBills.map((item) => (
                                                <tr key={item.sifra_stavke}>
                                                    <th scope='row'>{item.sifra_stavke}</th>
                                                    <td>{item.sifra_artikla}</td>
                                                    <td>{item.naziv_artikla}</td>
                                                    <td>{item.broj_racuna}</td>
                                                    <td>{item.kolicina_artikla}</td>
                                                    <td>{parseFloat(item.iznos_stavke).toFixed(2) + 'kn'}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            ) : (
                                <table class="table table-striped table-hover table-borderless table-danger ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Stavka ID</th>
                                            <th scope="col">Artikl ID</th>
                                            <th scope="col">Naziv artikla</th>
                                            <th scope="col">Račun ID</th>
                                            <th scope="col">Količina artikla</th>
                                            <th scope="col">Iznos stavke</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            customersBills.map((item) => (
                                                <tr key={item.sifra_stavke}>
                                                    <th scope='row'>{item.sifra_stavke}</th>
                                                    <td>{item.sifra_artikla}</td>
                                                    <td>{item.naziv_artikla}</td>
                                                    <td>{item.broj_racuna}</td>
                                                    <td>{item.kolicina_artikla}</td>
                                                    <td>{parseFloat(item.iznos_stavke).toFixed(2) + 'kn'}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                        ) : (
                            <div style={{ marginTop: '5vh', marginLeft: '30vw' }}>
                                <CircleLoader loading speedMultiplier={1} color='#165FC6' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminStatisticsTopReceipts
