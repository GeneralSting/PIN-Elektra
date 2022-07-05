import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpellCheck, faPlus, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import AdminNavbar from '../components/AdminNavbar'
import '../scss/css/Admin.css'
import Swal from 'sweetalert2';
import { Form, Button, Modal } from 'react-bootstrap'

function AdminCustomerCounters() {  //sve osim dugmića za napraviti račun

  let location = useLocation()  //dohvatit će se kupac

  const [renderSite, setRenderSite] = useState(0)
  const [customerCounters, setCustomerCounters] = useState([])
  const [addFormData, setAddFormData] = useState('')  //lokacija novog brojila
  const [addCounterType, setAddCounterType] = useState('')  //tip novog brojila
  const [checkCounterType, setCheckCounterType] = useState('')  //provjera vrijednosti brojila kod edita brojila pa će se odmah radio button kliknuti
  const [showEditForm, setShowEditForm] = useState(false) //prikaz inputa za edit brojila
  const [editCustomerCounter, setEditCustomerCounter] = useState('')  //ID brojila kojeg uređujemo
  const [editForm, setEditForm] = useState('')  //edit lokacija brojila
  const [editCounterType, setEditCounterType] = useState('')  //edit tip brojila

  useEffect(() => {
    var params = new URLSearchParams()
    params.append('id', location.state.customer.sifra_kupca)

    setTimeout(() => {
      axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_readCustomerCounters.php", params)
      .then((response) => {
        setCustomerCounters(response.data)  //dohvaćanje svih brojila odabranog kupca
      })
    }, 100);
  }, [renderSite])

  useEffect(() => { //kod edita se provjerava vrijednost tako da određeni radio button može biti odabran
    if (checkCounterType === 'Kućanstvo') {
      setEditCounterType('Kućanstvo')
    }
    if (checkCounterType === 'Poduzetništvo') {
      setEditCounterType('Poduzetništvo')
    }
  }, [checkCounterType])

  const tableData = {
    columns: [
      {
        label: 'Lokacija mjernog mjesta',
        field: 'mjestoBrojila',
        sort: 'asc'
      },
      {
        label: 'Šifra brojila',
        field: 'sifraBrojila',
        sort: 'asc'
      },
      {
        label: 'Tip brojila',
        field: 'tipBrojila',
        sort: 'asc'
      },
      {
        label: 'Obriši',
        field: 'obrisi',
        width: 100
      },
      {
        label: 'Uredi',
        field: 'uredi',
        width: 100
      },
      {
        label: 'Račun',
        field: 'racun',
        width: 100
      }
    ],
    rows:
      customerCounters.map((customer) => ({
        mjestoBrojila: customer.mjesta_brojila,
        sifraBrojila: customer.sifra_brojila,
        tipBrojila: customer.tip_brojila,
        obrisi: <button className='btn btn-danger btn-sm' onClick={() => handleDeleteCounter(customer.sifra_brojila, customer.broj_mjernih_mjesta, customer.sifra_kupca)}><FontAwesomeIcon icon={faTrash} /></button>,
        uredi: <button className='btn btn-warning btn-sm' onClick={() => handleEditCounter(customer.sifra_brojila)}><FontAwesomeIcon icon={faSpellCheck} /></button>,
        racun: <CounterBill customer={customer} />
      })),
  }

  const handleCounterType = event => {
    setAddCounterType(event.target.value)
  }

  const handleAddFormChange = (event) => {
    event.preventDefault();
    setAddFormData(event.target.value)
  }

  const handleAddFormSubmit = (event) => {  //Dodavanje novog brojila
    event.preventDefault();
    if (addCounterType === "") {
      Swal.fire({
        icon: 'error',
        title: 'Neuspješno!',
        text: 'Nije odabran tip brojila!',
      })
    }
    else {
      var params = new URLSearchParams()
      params.append('id', location.state.customer.sifra_kupca)
      params.append('countersNumber', (parseInt(customerCounters[0].broj_mjernih_mjesta) + 1))
      params.append('counterLocation', addFormData)
      params.append('counterType', addCounterType)
      axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_addCustomerCounter.php", params)

      setRenderSite(renderSite + 1)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Uspješno dodano!',
        showConfirmButton: false,
        timer: 1200
      })
      setAddFormData(null)
      setAddCounterType('')
    }
  }

  const handleEditCounter = (editCounter) => {    //popunjavanje inputa vrijednostima iz baze
    var params = new URLSearchParams();
    params.append('id', editCounter)  //šifra brojila
    axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_readCustomerCounter.php", params)
      .then((response) => {
        response.data.forEach(counter => {
          setEditForm(counter.mjesta_brojila)
          setEditCustomerCounter(counter.sifra_brojila)
          setCheckCounterType(counter.tip_brojila)
        });
      })
    setShowEditForm(true)
  }

  const handleEditCounterType = (event) => {
    setEditCounterType(event.target.value)
  }

  const handleEditFormChange = (event) => {
    event.preventDefault();
    setEditForm(event.target.value)
  }

  const handleEditFormSubmit = (event) => {
    event.preventDefault()
    if (editCounterType === "") {
      if (checkCounterType === 'Kućanstvo') {
        setEditCounterType('Kućanstvo')
      }
      else {
        setEditCounterType('Poduzetništvo')
      }
    }
    var params = new URLSearchParams()
    params.append('id', editCustomerCounter)
    params.append('counterLocation', editForm)
    params.append('counterType', editCounterType)
    axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_editCustomerCounter.php", params)

    setRenderSite(renderSite + 1)
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Uspješno ažurirano!',
      showConfirmButton: false,
      timer: 1200
    })
    setEditCounterType('')
    setShowEditForm(false)
    setEditForm(null)
    setCheckCounterType('')
  }

  const handleDeleteCounter = (deleteCounter, customerCountersNumber, customerId) => {  //upit da li zelimo obrisati brojilo
    Swal.fire({
      title: 'Jeste li sigurni',
      text: "Brojilo će trajno bit obrisano",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Odustani',
      confirmButtonText: 'Obriši'
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCounter(deleteCounter, customerCountersNumber, customerId)
        Swal.fire(
          'Obrisano!',
          'Brojilo je obrisano.',
          'success'
        )
      }
    })
  }

  const DeleteCounter = (deleteCounter, customerCountersNumber, customerId) => {  //brisanje brojila
    var params = new URLSearchParams()
    params.append('id', deleteCounter)
    params.append('countersNumber', (parseInt(customerCountersNumber) - 1)) //smanji korisnikov broj brojila za jedan
    params.append('customer', customerId)
    axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_deleteCustomerCounter.php", params)

    setRenderSite(renderSite + 1)
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <div className="container" style={{ marginBottom: '50px' }}>
        <hr className='customerHR' style={{ height: '5px', border: '0', boxShadow: '0 20px 10px -10px #8c8b8b inset', marginBottom: '8px' }} />
        <div className='row'>
          <div className="col-md-2 offset-md-2" style={{ marginTop: '2px' }}>
            <h4>Kupac:</h4> {/*Informacije o kupcu */}
          </div>
          <div className="col-md-3">
            <h3>{location.state.customer.oib}</h3>
          </div>
          <div className="col-md-3" style={{ marginTop: '2px' }}>
            <h4>{location.state.customer.ime} {location.state.customer.prezime}</h4>
          </div>
        </div>
        <hr className='customerHR' style={{ height: '5px', border: '0', boxShadow: '0 20px 10px -10px #8c8b8b inset', marginTop: '1px' }} />
      </div>
      <div className='container'>   {/*Dio za dodavanje brojila*/}
        <div className='row'>
          <div className="col-sm">
            <form onSubmit={handleAddFormSubmit}>
              <input
                type='text'
                name='newCounterLocation'
                required='required'
                placeholder='Lokacija...'
                autoComplete='off'
                value={addFormData || ""}
                onChange={handleAddFormChange}
              />
              <div style={{ display: 'inline', marginLeft: '30px' }}>
                <input
                  name='counterType'
                  type='radio'
                  value='Kućanstvo'
                  checked={addCounterType === 'Kućanstvo'}
                  onChange={handleCounterType}
                />
                Kućanstvo
              </div>
              <div style={{ display: 'inline', marginLeft: '30px' }}>
                <input
                  name='counterType'
                  type='radio'
                  value='Poduzetništvo'
                  checked={addCounterType === 'Poduzetništvo'}
                  onChange={handleCounterType}
                />
                Poduzetništvo
              </div>

              <button type='submit' className='btn btn-success btn-sm' onSubmit={handleAddFormSubmit} style={{ marginLeft: '50px', marginBottom: '6px' }}><FontAwesomeIcon icon={faPlus} /></button>
            </form>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className="col-sm">
            {showEditForm ? ( //prikaži dio za ažuriranje brojila
              <form onSubmit={handleEditFormSubmit}>
                <input
                  type='text'
                  name='editCounterLocation'
                  required='required'
                  autoComplete='off'
                  value={editForm || ""}
                  onChange={handleEditFormChange}
                />

                {(checkCounterType == 'Kućanstvo') ? (  //tip brojila u bazi ima vrijednost kućanstvo
                  <>
                    <div style={{ display: 'inline', marginLeft: '30px' }}>
                      <input
                        name='counterEditTypeK'
                        type='radio'
                        value='Kućanstvo'
                        checked={editCounterType === 'Kućanstvo'}
                        onChange={handleEditCounterType}
                      />
                      Kućanstvo
                    </div>
                    <div style={{ display: 'inline', marginLeft: '30px' }}>
                      <input
                        name='counterEditTypeK'
                        type='radio'
                        value='Poduzetništvo'
                        checked={editCounterType === 'Poduzetništvo'}
                        onChange={handleEditCounterType}
                      />
                      Poduzetništvo
                    </div>

                  </>
                ) : (   //tip brojila u bazi ima vrijednost kućanstvo
                  <>
                    <div style={{ display: 'inline', marginLeft: '30px' }}>
                      <input
                        name='counterEditTypeP'
                        type='radio'
                        value='Kućanstvo'
                        checked={editCounterType === 'Kućanstvo'}
                        onChange={handleEditCounterType}
                      />
                      Kućanstvo
                    </div>
                    <div style={{ display: 'inline', marginLeft: '30px' }}>
                      <input
                        name='counterEditTypeP'
                        type='radio'
                        value='Poduzetništvo'
                        checked={editCounterType === 'Poduzetništvo'}
                        onChange={handleEditCounterType}
                      />
                      Poduzetništvo
                    </div>
                  </>
                )}

                <button type='submit' className='btn btn-success btn-sm' onSubmit={handleEditFormSubmit} style={{ marginLeft: '50px', marginBottom: '6px' }}><FontAwesomeIcon icon={faSpellCheck} /></button>
              </form>
            ) : (<p><i>Kliknuti uredi dugme za pojavu polja</i></p>)}
          </div>
        </div>
      </div>
      <hr style={{ width: '85%', marginLeft: 'auto', marginRight: 'auto' }} />
      <div className='container'>
        <div className='row'>
          <div className="col-sm">
            <MDBDataTable
              displayEntries={false}
              paging={false}
              searchLabel='Traži...'
              striped
              hover
              theadColor='red'
              data={tableData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


export function CounterBill(props) {

  let location = useLocation()  //dohvatit će se kupac

  const [formInputs, setFormInputs] = useState({})
  const [show, setShow] = useState(false)
  const [articles, setArticles] = useState([])

  const [firstItem, setFirstItem] = useState(0)
  const [secondItem, setSecondItem] = useState(0)
  const[totalPrice, setTotalPrice] = useState(0)

  const[firstArticleId, setFirstArticleId] = useState(0)
  const[secondArticleId, setSecondArticleId] = useState(0)

  useEffect(() => {
    axios.get('http://localhost/PIN-ELEKTRA/src/php/admin_readArticles.php')
    .then((response) => {
      setArticles(response.data)
    })
  }, [])

  useEffect(() => {
    setFirstItem(0)
    setSecondItem(0)
    setFormInputs({})
  }, [show])

  useEffect(() => {
    let inTotalPrice = parseFloat(firstItem) + parseFloat(secondItem)
    inTotalPrice = inTotalPrice.toFixed(2)
    setTotalPrice(inTotalPrice)
  }, [firstItem, secondItem])

  const handleDelete = () => {
    setFirstItem(0)
    setSecondItem(0)
    setFormInputs({})
  }


  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)


  const handleNumberChange = (event) => {
    const oibRegex = /^[0-9\b]+$/
    if (event.target.value === '' || oibRegex.test(event.target.value)) {
      handleChange(event)
    }
  }

  const handleChange = (event) => {
    if(event.target.name === 'householdFirstArticle')
    {
      if(props.customer.tip_brojila === 'Kućanstvo')
      {
        var number = ((event.target.value * articles[0].cijena_artikla)).toFixed(2)
        setFirstArticleId(articles[0].sifra_artikla)

        setFirstItem(number)
      }
      else
      {
        var number = ((event.target.value * articles[2].cijena_artikla)).toFixed(2)
        setFirstArticleId(articles[2].sifra_artikla)

        setFirstItem(number)
      }
    }
    else
    {
      if(props.customer.tip_brojila === 'Kućanstvo')
      {
        var number = ((event.target.value * articles[1].cijena_artikla)).toFixed(2)
        setSecondArticleId(articles[1].sifra_artikla)

        setSecondItem(number)
      }
      else
      {
        var number = ((event.target.value * articles[3].cijena_artikla)).toFixed(2)
        setSecondArticleId(articles[3].sifra_artikla)

        setSecondItem(number)
      }
    }
    const name = event.target.name
    const value = event.target.value
    setFormInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = () => {
    if(formInputs.householdSecondArticle === undefined || formInputs.householdSecondArticle === ""
      || formInputs.householdFirstArticle === undefined || formInputs.householdFirstArticle === "")
    {
      Swal.fire({
        icon: 'error',
        title: 'Neuspješno!',
        text: 'Popunite sva polja!',
      })
    }
    else
    {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Uspješno kreiran račun!',
        showConfirmButton: false,
        timer: 1200
      })

      var params = new URLSearchParams()
      params.append('firstArticleId', firstArticleId)
      params.append('secondArticleId', secondArticleId)
      params.append('firstItemPrice', firstItem)
      params.append('secondItemPrice', secondItem)
      params.append('firstArticleAmount', formInputs.householdFirstArticle)
      params.append('secondArticleAmount', formInputs.householdSecondArticle)
      params.append('TotalPrice', totalPrice)
      params.append('CustomerId', location.state.customer.sifra_kupca)
      params.append('CounterId', props.customer.sifra_brojila)

      axios.post("http://localhost/PIN-ELEKTRA/src/php/admin_addReceipt_Items.php", params)

      setShow(false)
    }
  }

  return (
    <>
      <button onClick={handleShow} className='btn btn-primary btn-sm'>
        <FontAwesomeIcon icon={faFileInvoiceDollar} />
      </button>
      <Modal show={show} onHide={handleClose} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Račun za brojilo: {props.customer.sifra_brojila}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(props.customer.tip_brojila == 'Kućanstvo') ? (  //tip brojila je kućanstvo
            <Form onSubmit={handleSubmit}>
              <div className="container">
                <div className='row'>
                  <p style={{ display: 'inline', width: '25%' }}>Visoka tarifa: </p>
                  <div className="col-md-2">
                    <input
                      placeholder='kW/h'
                      type="number"
                      name="householdFirstArticle"
                      value={formInputs.householdFirstArticle || ""}
                      onKeyDown={(event) => {
                        if (event.keyCode === 8) {

                        }
                        else if (!(/^[0-9]\d*$/).test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={handleNumberChange}
                    />
                  </div>
                  <div className="offset-md-7">
                    <p>Cijena: {firstItem } kn</p>
                  </div>
                </div>
                <br />
                <div className='row'>
                  <p style={{ display: 'inline', width: '25%' }}>Niska tarifa: </p>
                  <div className="col-md-2">
                    <input
                      placeholder='kW/h'
                      type="number"
                      name="householdSecondArticle"
                      value={formInputs.householdSecondArticle || ""}
                      onKeyDown={(event) => {
                        if (event.keyCode === 8) {

                        }
                        else if (!(/^[0-9]\d*$/).test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={handleNumberChange}
                    />
                  </div>
                  <div className="offset-md-7">
                    <p>Cijena: {secondItem }kn</p>
                  </div>
                </div>
                <hr />
                <p className='offset-md-4'><i><b>Ukupno: {totalPrice }kn</b></i></p>
              </div>
            </Form>
          ) : (   //tip brojila je poduzetništvo
          <Form onSubmit={handleSubmit}>
          <div className="container">
            <div className='row'>
              <p style={{ display: 'inline', width: '35%' }}>Industrijska tip 1: </p>
              <div className="col-md-2">
                <input
                  placeholder='kW/h'
                  type="number"
                  name="householdFirstArticle"
                  value={formInputs.householdFirstArticle || ""}
                  onKeyDown={(event) => {
                    if (event.keyCode === 8) {

                    }
                    else if (!(/^[0-9]\d*$/).test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="offset-md-8">
                <p>Cijena: {firstItem } kn</p>
              </div>
            </div>
            <br />
            <div className='row'>
              <p style={{ display: 'inline', width: '35%' }}>Industrijska tip 2: </p>
              <div className="col-md-2">
                <input
                  placeholder='kW/h'
                  type="number"
                  name="householdSecondArticle"
                  value={formInputs.householdSecondArticle || ""}
                  onKeyDown={(event) => {
                    if (event.keyCode === 8) {

                    }
                    else if (!(/^[0-9]\d*$/).test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="offset-md-8">
                <p>Cijena: {secondItem }kn</p>
              </div>
            </div>
            <hr />
            <p className='offset-md-4'><i><b>Ukupno: { totalPrice}kn</b></i></p>
          </div>
        </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Obriši
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Zatvori
          </Button>
          <Button variant="primary" type='submit' onClick={handleSubmit}>
            Dodaj
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminCustomerCounters
