import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar'
import { MDBDataTable } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar, faStamp } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { useBetween } from 'use-between';
import { CircleLoader } from 'react-spinners';

const useSherableState = () => {      //useBetween
    const [renderSite, setRenderSite] = useState(0) //za render stranice kada se u drugoj komponenti dogodi promjena
    return {
        renderSite, setRenderSite
    }
}

function AdminCustomersBills() {

    const navigate = useNavigate();

    let billsCounter = 1;

    const { renderSite } = useBetween(useSherableState) //useBetween za render stranice
    const [customersBills, setCustomersBills] = useState([])

    const [selectedCustomer, setSelectedCustomer] = useState({})
    const [selectedReceipt, setSelectedReceipt] = useState()
    const [receiptItems, setReceiptItems] = useState([])
    const [articlesPrice, setArticlesPrice] = useState([])
    const [change, setChange] = useState(false)


    useEffect(() => {
        const readCustomersBills = "http://localhost/pin-elektra/src/php/admin_readCustomersBills.php" //svi racuni
        axios.get(readCustomersBills).then((response) => {
            setCustomersBills(response.data)
        })
    }, [renderSite])

    useEffect(() => {
        if (change) {
            var params = new URLSearchParams()
            params.append('customerId', selectedReceipt.sifra_kupca)
            const readCustomer = 'http://localhost/pin-elektra/src/php/admin_readCustomer.php'
            axios.post(readCustomer, params).then((response) => {
                setSelectedCustomer(response.data)
            })
            var receiptParams = new URLSearchParams()
            receiptParams.append('receiptId', selectedReceipt.sifra_racuna)
            const readReceiptItems = 'http://localhost/pin-elektra/src/php/admin_readReceiptItems.php'
            axios.post(readReceiptItems, receiptParams).then((response) => {
                setReceiptItems(response.data)
            })
        }
    }, [change])

    useEffect(() => {
        if (change) {
            var articleParams = new URLSearchParams()
            articleParams.append('firstArticleId', receiptItems[0].sifra_artikla)
            articleParams.append('secondArticleId', receiptItems[1].sifra_artikla)
            const readArticle = 'http://localhost/pin-elektra/src/php/admin_readArticle.php'
            axios.post(readArticle, articleParams).then((response) => {
                setArticlesPrice(response.data)
            })
        }
    }, [receiptItems])

    useEffect(() => {
        if (receiptItems !== undefined && receiptItems.length != 0) {
            navigate('Racun', {
                state: {
                    paramsCustomer: selectedCustomer, paramsReceiptItem: receiptItems[0], paramReceiptSecondItem: receiptItems[1],
                    paramsArticlePrice: articlesPrice[0], paramsSecondArticlePrice: articlesPrice[1]
                }
            })

        }
    }, [articlesPrice])

    const OpenInovice = (recievedBill) => {
        setSelectedReceipt(recievedBill)
        setTimeout(() => {
            setChange(true)
        }, 100);
    }

    const tableData = { //podaci za popuniti tablicu
        columns: [
            {
                label: '#',
                field: 'broj_racuna',
            },
            {
                label: 'Šifra računa',
                field: 'sifra_racuna',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Šifra kupca',
                field: 'sifra_kupca',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Šifra brojila',
                field: 'sifra_brojila',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Datum računa',
                field: 'datum_racuna',
                sort: 'disabled',
                width: 100
            },
            {
                label: 'Iznos',
                field: 'iznos',
                sort: 'disabled',
                width: 120
            },
            {
                label: 'Stavke',
                field: 'stavke'
            },
            {
                label: 'Storniraj',
                field: 'storniraj'
            }
        ],
        rows: customersBills.map((bill) => ({
            broj_racuna: billsCounter++,
            sifra_racuna: <h5 onClick={() => OpenInovice(bill)} className='showReceiptLink' searchvalue={bill.sifra_racuna}>{bill.sifra_racuna}</h5>, 
            sifra_kupca: bill.sifra_kupca,
            sifra_brojila: bill.sifra_brojila,
            datum_racuna: (bill.datum_racuna).split("-").reverse().join("-").replaceAll("-", "."), //pretvorba datuma u hrvatski tip, nemoguće sortirati
            iznos: (parseFloat(bill.iznos_racuna).toFixed(2) + 'kn'),
            stavke: <ModalItems bill={bill} />,
            storniraj: <CancelReceipt bill={bill} />
        })),
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            <AdminNavbar />
            <div className='container' style={{ marginTop: '30px' }}>
                <div className='row'>
                    <div className="col-sm">
                        <MDBDataTable
                            entriesOptions={[5, 10, 20, 50]}
                            entrieslabel='Broj kupaca'    //ovo ne radi...
                            paginationLabel={['Prethodna', 'Sljedeća']}
                            searchLabel='Pretraživanje'
                            infoLabel={['Prikaz', '-', 'od ukupno', '']}
                            striped
                            bordered
                            hover
                            responsive
                            sortRows={['sifra_racuna']}
                            data={tableData}
                        />
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
                    <Modal.Title>Pregled stavki za račun: <p style={{ display: 'inline', fontWeight: '700', fontFamily: 'cursive' }}>{props.bill.sifra_racuna}</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalShowItems bill={props.bill} />
                </Modal.Body>
                <Modal.Footer>
                    <p style={{marginRight: '20%'}}>Ukupan iznos: <b>{parseFloat(props.bill.iznos_racuna).toFixed(2)}kn</b></p>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export function ModalShowItems(props) {

    const [customersBills, setCustomersBills] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        var params = new URLSearchParams();
        params.append('receiptId', props.bill.sifra_racuna)
        const readReceiptItems = "http://localhost/pin-elektra/src/php/admin_readReceiptItems.php"
        axios.post(readReceiptItems, params).then((response) => {
            setCustomersBills(response.data)
            setLoaded(true)
        })
    }, [])

    return (
        <div style={{ overflowX: 'hidden' }}>
            <div className='container' style={{ marginTop: '30px' }}>
                <div className='row'>
                    <div className="col-sm">
                        {loaded ? (
                            (parseInt(customersBills[0].sifra_artikla) === 100) ? (
                                <table class="table table-striped table-hover table-borderless table-info">
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

export function CancelReceipt(props) {

    const { renderSite, setRenderSite } = useBetween(useSherableState) //useBetween za render stranice

    const confirmCancelReceipt = () => {
        Swal.fire({
            title: 'Račun: ' + props.bill.sifra_racuna,
            text: "Želite li odabrani račun stornirati",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Odustani',
            confirmButtonText: 'Storniraj'
        }).then((result) => {
            if (result.isConfirmed) {
                cancelReceipt()

            }
        })
    }

    const cancelReceipt = () => {
        var params = new URLSearchParams()
        params.append('receiptId', props.bill.sifra_racuna)
        const cancelReceiptUrl = "http://localhost/pin-elektra/src/php/admin_cancelReceipt.php" //obriši račun
        axios.post(cancelReceiptUrl, params).then((response) => {
            Swal.fire(
                'Stornirano!',
                'Račun je prebačen u stornirane račune',
                'success'
            )
        })
        setTimeout(() => {
            setRenderSite(renderSite + 1)
        }, 100);
    }

    return (
        <>
            <button className='btn btn-danger btn-sm' onClick={confirmCancelReceipt}><FontAwesomeIcon icon={faStamp} /></button>
        </>
    )
}

export default AdminCustomersBills
