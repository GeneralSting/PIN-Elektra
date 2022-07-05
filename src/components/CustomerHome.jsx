import React, { useState, useEffect, } from 'react'
import axios from 'axios';
import PinElektra_32 from '../img/elektraLogo32.png'
import { MDBDataTable } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'react-bootstrap'
import { CircleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'


import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdbreact";

function CustomerHome() {

  const navigate = useNavigate()

  var billsCounter = 1;

  const [totalBills, setTotalBills] = useState(0)
  const [customerBills, setCustomerBills] = useState([])

  const [selectedCustomer, setSelectedCustomer] = useState({})
  const [selectedReceipt, setSelectedReceipt] = useState()
  const [receiptItems, setReceiptItems] = useState([])
  const [articlesPrice, setArticlesPrice] = useState([])
  const [change, setChange] = useState(false)

  let loginCustomer = sessionStorage.getItem('customer')
  loginCustomer = JSON.parse(loginCustomer)

  useEffect(() => {
    const readCustomerBills = "http://localhost/pin-elektra/src/php/customer_readCustomerBills.php";
    var params = new URLSearchParams()
    params.append('customerId', loginCustomer.sifra_kupca)
    axios.post(readCustomerBills, params).then((response) => {
      setCustomerBills(response.data)
      setTotalBills(response.data.length)
    })
  }, [])

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

  const LogOut = () => {
    navigate('/')
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
      }
    ],
    rows: customerBills.map((bill) => ({
      broj_racuna: billsCounter++,
      sifra_racuna: <h5 onClick={() => OpenInovice(bill)} className='showReceiptLink' searchvalue={bill.sifra_racuna}>{bill.sifra_racuna}</h5>,   //nije moguće pretraživati jer to h5 element
      sifra_brojila: bill.sifra_brojila,
      datum_racuna: (bill.datum_racuna).split("-").reverse().join("-").replaceAll("-", "."), //pretvorba datuma u hrvatski tip, nemoguće sortirati
      iznos: (parseFloat(bill.iznos_racuna).toFixed(2) + 'kn'),
      stavke: <ModalItems bill={bill} />,
    })),
  };

  return (
    <div>
      <MDBContainer style={{ marginTop: '10px' }}>
        <MDBRow>
          <MDBCol size="3" style={{ marginTop: '40px' }}>
            <MDBCard>
              <MDBCardBody style={{
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                background: 'linear-gradient(90deg, rgba(255,235,1,0.49093140674238445) 0%, rgba(22,95,198,0.6029762246695554) 100%)'
              }}>
                <MDBCardTitle tag="h5">
                  <h4>PIN-elektra</h4>
                  <img src={PinElektra_32} alt="" />
                </MDBCardTitle>
                <MDBCardText style={{ fontSize: '10px' }}>
                </MDBCardText>
                <MDBCardText small muted>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol size="6" className='offset-md-2'>
            <MDBCard>
              <MDBCardBody style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                <MDBCardTitle tag="h5">Dobrodošao: {loginCustomer.ime}</MDBCardTitle>
                <MDBCardText style={{ fontSize: '16px', textAlign: 'left' }}>
                  <div className="row">
                    <div className="col-md-5">
                      <p style={{ margin: '0px', textAlign: 'center' }}>OIB:</p>
                    </div>
                    <div className="col-md-4 offset-md-2">
                      <b> {loginCustomer.oib}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <p style={{ margin: '0px', textAlign: 'center' }}>Broj mjernih mjesta: </p>
                    </div>
                    <div className="col-md-4 offset-md-2">
                      <b>{loginCustomer.broj_mjernih_mjesta}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <p style={{ margin: '0px', textAlign: 'center' }}>Poštanski broj: </p>
                    </div>
                    <div className="col-md-4 offset-md-2">
                      <b>{loginCustomer.postanski_broj}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <p style={{ margin: '0px', textAlign: 'center' }}>Ukupno računa: </p>
                    </div>
                    <div className="col-md-4 offset-md-2">
                      <b>{totalBills}</b>
                    </div>
                  </div>
                </MDBCardText>
                <MDBCardText small muted>
                  <hr />
                  <button className='btn btn-secondary btn-sm' onClick={LogOut}>Odjavi se</button>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol size='12' style={{ marginTop: '20px', background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,235,1,0.1716036756499475) 50%, rgba(255,255,255,1) 100%)' }}>
            <p><i>Tablica Vaših računa</i></p>
            <MDBDataTable
              entriesOptions={[1, 3, 5, 10]}
              entries={3}
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
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
          <p style={{ marginRight: '20%' }}>Ukupan iznos: <b>{parseFloat(props.bill.iznos_racuna).toFixed(2)}kn</b></p>
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
    <div style={{ overflowX: 'hidden', textAlign: 'center' }}>
      <div className='container' style={{ marginTop: '30px' }}>
        <div className='row'>
          <div className="col-sm">
            {loaded ? (
              (parseInt(customersBills[0].sifra_artikla) === 100) ? (
                <table class="table table-striped table-hover table-borderless table-info ">
                  <thead>
                    <tr>
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
                          <th scope='row'>{item.naziv_artikla}</th>
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

export default CustomerHome
