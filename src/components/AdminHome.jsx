import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar'
import { MDBDataTable } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSlash, faUserPen, faUserTag, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Form, Button, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { useBetween } from 'use-between';


const useSherableState = () => {      //useBetween
  const [renderSite, setRenderSite] = useState(0) //za render stranice kada se u drugoj komponenti dogodi promjena
  return {
    renderSite, setRenderSite
  }
}

function AdminHome() {  //glavna tablica

  const { renderSite } = useBetween(useSherableState) //useBetween za render stranice

  const navigate = useNavigate()  //prosljeđuje na pregled brojila odabranog kupca

  const readUrlCustomers = "http://localhost/pin-elektra/src/php/admin_readCustomers.php"

  let data = sessionStorage.getItem('admin')  //prijavljeni admin
  data = JSON.parse(data)

  const [customers, setCustomers] = useState([])  //svi kupci

  useEffect(() => {
    axios.get(readUrlCustomers).then((response) => {
      setCustomers(response.data)
    })
  }, [renderSite])

  const tableData = { //podaci za popuniti tablicu
    columns: [
      {
        label: 'Šifra',
        field: 'sifra',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Ime',
        field: 'ime',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Prezime',
        field: 'prezime',
        sort: 'asc',
        width: 250
      },
      {
        label: 'OIB',
        field: 'oib',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Datum rođenja',
        field: 'datumRodenja',
        sort: 'disabled',
        width: 100
      },
      {
        label: 'Pbr',
        field: 'pbr',
        sort: 'asc',
        width: 120
      },
      {
        label: 'Brojila',
        field: 'brojBrojila',
        sort: 'asc',
        width: 30
      },
      {
        label: "Uredi",
        field: "uredi",
      },
      {
        label: 'Obriši',
        field: 'obrisi'
      },
      {
        label: 'Brojila',
        field: 'brojila'
      }
    ],
    rows: customers.map((customer) => ({
      sifra: customer.sifra_kupca,
      ime: customer.ime,
      prezime: customer.prezime,
      oib: customer.oib,
      datumRodenja: customer.datum_rodenja.split("-").reverse().join("-").replaceAll("-", "."), //pretvorba datuma u hrvatski tip, nemoguće sortirati
      pbr: customer.postanski_broj,
      brojBrojila: customer.broj_mjernih_mjesta,
      email: customer.email_kupca,
      uredi: <EditCustomer customer={customer} />,
      obrisi: <DeleteCustomer customer={customer} />,
      brojila: <button className='btn btn-warning btn-sm' onClick={() => handleCustomerCounters(customer)}><FontAwesomeIcon icon={faUserTag} /></button>
    })),
  };

  const handleCustomerCounters = (clickedCustomer) => { //pregled brojila odabranog kupca
    navigate('/Admin/Counters', { state: { customer: clickedCustomer } });
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <AdminNavbar />
      <ModalAddCustomer />  {/* Modal za dodavanje novog kupca */}
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
              data={tableData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}



export function ModalAddCustomer() {  //Modal za dodavanje novoga kupca

  const checkOib = require('oib.js')  //objekt koji ce omoguciti provjeru unesenog OIB-a

  const { renderSite, setRenderSite } = useBetween(useSherableState)  //useBetween render stranice

  var minDate = new Date().toISOString().split("T")[0]  //minimalni datum za datum rodenja -> ne moze biti starije od danas 

  const [show, setShow] = useState(false) //otvori/zatvori modal
  const [customerCounters, setCustomerCounters] = useState([])  //brojila novo dodanog kupca
  const [formInputs, setFormInputs] = useState({})  //vrijednosti polja bit ce spremljena kao podatkovni clanovi objekta formInputs
  const [customersId, setCustomersId] = useState([])  //sifre svih korisnika
  const [newCustomerId, setNewCustomerId] = useState('')  //nova sifra, do sad ne upotrebljena, pridjeljuje se novom kupcu
  const [tryNewId, setTryNewId] = useState(0)   //kod neuspješnog dodjeljivanja nove šifre, tražit će se nova / govori programu kada da traži novu šifru
  const [allCustomersOib, setAllCustomersOib] = useState([])

  useEffect(() => {
    const readUrlCustomers = "http://localhost/pin-elektra/src/php/admin_readCustomers.php"
    axios.get(readUrlCustomers).then((response) => {
      setAllCustomersOib(response.data)
    })
  }, [renderSite])

  useEffect(() => {   //dohvaćanje svih kupaca kako bi se provjerila šifra
    const readUrlCustomers = "http://localhost/pin-elektra/src/php/admin_readCustomers.php"; //svi kupci
    axios.get(readUrlCustomers).then((response) => {
      setCustomersId(response.data)
    })
  }, [newCustomerId])


  useEffect(() => {   //postavljanje nove 9-znamenkaste šifre kupcu
    setNewCustomerId(Math.floor(100000000 + Math.random() * 900000000))  //9-znamenkasti broj, prva znamenka neće biti 0
    customersId.forEach(element => {
      if (element.sifra_kupca === newCustomerId) {  //provjera da li netko od kupaca već ima tu šifru
        setTryNewId(tryNewId + 1) //novi pokušaj
      }
    })
  }, [tryNewId])

  const handleClose = () => setShow(false)  //zatvori modal
  const handleShow = () => setShow(true)    //otvori modal
  const handleDelete = () => {  //dugme Obriši u modalu briše sve vrijednosti u poljima
    setFormInputs({})
    setCustomerCounters([])
  }

  const handleCustomersCounters = (value) => {  //prema broju unesenom u polje, dodavat će se nova polja za unos brojila
    setCustomerCounters([])
    for (var i = 0; i < value; i++) {
      let oInput = {  //polje lokacija brojila
        "id": i, "className": "offset-md-2", "placeholder": "Mjerno mjesto", "type": "text", "inputName": "counterPlace" + i,
      }
      setCustomerCounters(oldArray => [...oldArray, oInput])
    }
  }

  const handleCounterNumberChange = (event) => {  //provjerava polje za unos broja brojila
    const checkIntRegex = /^[0-9\b]+$/
    if (event.target.value === '' || checkIntRegex.test(event.target.value)) {
      handleChange(event)
      handleCustomersCounters(event.target.value)
    }
  }

  const handleNumberChange = (event) => { //provjera polja sa brojevima
    const checkIntRegex = /^[0-9\b]+$/
    if (event.target.value === '' || checkIntRegex.test(event.target.value)) {
      handleChange(event)
    }
  }

  const handleChange = (event) => { //postavlja formInputs-u podatkovne članove-> ime polja: vrijednost polja
    const name = event.target.name
    const value = event.target.value
    setFormInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => { //submit
    event.preventDefault()
    CheckInputs()
  }

  const CheckInputs = () => { //provjera da li su sva polja unesena, i da li pbr ima 5 znamenaka
    if (formInputs.name === undefined || formInputs.name === "" || formInputs.surname === undefined || formInputs.surname === "" || formInputs.oib === undefined || formInputs.oib === "" ||
      formInputs.birthDate === undefined || formInputs.birthDate === "" || formInputs.residencePlace === undefined || formInputs.residencePlace === "" || formInputs.pbr === undefined
      || formInputs.pbr === "" || formInputs.counterNumber === undefined || formInputs.counterNumber === "" || formInputs.pbr.length !== 5) {
      Swal.fire({
        icon: 'error',
        title: 'Neuspješno!',
        text: 'Polja nisu popunjena ispravno!',
      })
    }
    else {
      if (checkOib.validate(formInputs.oib)) {  //provjera točnosti OIB-a
        let checkAllOibs = true
        allCustomersOib.forEach(element => {        //OIB-i ostalih kupaca    //!!!!!!!!!!!!!ovo je promjenjeno dodano allCustomersOib!!!!!!!!!!!!!!
          if (element.oib === formInputs.oib) {
            checkAllOibs = false
          }
        })
        if (checkAllOibs) {         //Zadovoljeni svi uvjeti
          setTryNewId(tryNewId + 1)
          AddNewCustomer()
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Neuspješno!',
            text: 'Uneseni OIB se nalazi u sustavu',
          })
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Neuspješno!',
          text: 'OIB nije točan',
        })
      }

    }
  }

  const AddNewCustomer = () => {
    var params = new URLSearchParams()  //dohvaćeni podaci polja koja nisu dinamički dodana
    params.append('name', formInputs.name)
    params.append('surname', formInputs.surname)
    params.append('oib', formInputs.oib)
    params.append('birthDate', formInputs.birthDate)
    params.append('residencePlace', formInputs.residencePlace)
    params.append('pbr', formInputs.pbr)
    params.append('id', newCustomerId)
    params.append('counterNumber', formInputs.counterNumber)

    const sortedFormInputs = {}
    Object.keys(formInputs).sort().forEach(key => { //sortiranje podatkovnih članova po abecedi objekta formInputs
      sortedFormInputs[key] = formInputs[key]       //dodavanje u novi objekt->sortedFormInputs
    })
    var sortedValues = Object.values(sortedFormInputs)
    var currentCounter = 0;
    var formInputsCounter = parseInt(formInputs.counterNumber) + 1
    for (var i = 2; i <= formInputsCounter; i++) {
      params.append('counterPlace' + currentCounter, sortedValues[i])  //dodavanje svih lokacija brojila u params
      currentCounter = currentCounter + 1;
    }
    currentCounter = 0
    var formInputsCounter2 = (parseInt(formInputs.counterNumber) + 1 + parseInt(formInputs.counterNumber))
    for (var i = (2 + parseInt(formInputs.counterNumber)); i <= formInputsCounter2; i++) {
      params.append('counterType_counterPlace' + currentCounter, sortedValues[i])  //dodavanje svih tipova brojila u params
      currentCounter = currentCounter + 1;
    }

    var allFieldFilled = true;  //provjera da li su sva polja ispunjena
    var inputsFieldCounter = 0; //broj polja za unos
    sortedValues.forEach(element => {
      if (element === "") {
        allFieldFilled = false; //polje lokacija brojila ima vrijednost ""
      }
      inputsFieldCounter++
    });
    if (allFieldFilled)  //sva polja su popunjena, nisu prazna
    {
      if (inputsFieldCounter === (7 + (2 * parseInt(formInputs.counterNumber)))) {  //ako ne zadovoljava uvjet onda znači da nisu označeni svi tipovi brojila
        axios.post("http://localhost/PIN-ELEKTRA/src/php/modal_addNewCustomer.php", params)
          .then(response => {
          })

        setShow(false)

        setRenderSite(renderSite + 1)

        Swal.fire({
          icon: 'success',
          title: 'Dodano!',
          text: 'Kupac je uspješno dodan',
        })

        setFormInputs({})         //objektu formInputs-u se brišu svi podatkovni članovi i njegove vrijednosti
        setCustomerCounters([])   //biršu se svi dinamički dodana polja za brojila

      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Neuspješno!',
          text: 'Brojila nisu potpuno ispunjena',
        })
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Neuspješno!',
        text: 'Nisu popunjene sve lokacije brojila',
      })
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ marginTop: '20px', padding: '5px 45px' }}>
        <FontAwesomeIcon icon={faUserPlus} />   {/* Dugme za dodavanje novog kupca */}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj kupca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="container">
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    style={{ textTransform: 'capitalize' }}
                    placeholder='Ime...'
                    type="text"
                    name="name"
                    autoComplete='off'
                    value={formInputs.name || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    style={{ textTransform: 'capitalize' }}
                    placeholder='Prezime...'
                    type="text"
                    name="surname"
                    autoComplete='off'
                    autoCapitalize=''
                    value={formInputs.surname || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='OIB...'
                    type="text"
                    name="oib"
                    autoComplete='off'
                    value={formInputs.oib || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Datum rođenja...'
                    type="date"
                    name="birthDate"
                    max={minDate}
                    value={formInputs.birthDate || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Mjesto stanovanja...'
                    type="text"
                    name="residencePlace"
                    autoComplete='off'
                    autoCapitalize=''
                    value={formInputs.residencePlace || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Pbr...'
                    type="number"
                    name="pbr"
                    value={formInputs.pbr || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Broj mjernih mjesta...'
                    type="number"
                    name="counterNumber"
                    value={formInputs.counterNumber || ""}
                    onChange={handleCounterNumberChange}
                  />
                </div>
              </div>
              <br />
              <hr />
              {customerCounters.map((counterPlace) => ( //dinamička polja
                <>
                  <div style={{ display: 'block' }}>
                    <input
                      style={{ marginRight: '5px' }}
                      className='offset-md-2'
                      type='radio'
                      name={'counterType_' + counterPlace.inputName}
                      value='Kućanstvo'
                      onChange={handleChange}
                    />
                    Kućanstvo
                    <input
                      style={{ marginRight: '5px' }}
                      className='offset-md-1'
                      type='radio'
                      name={'counterType_' + counterPlace.inputName}
                      value='Poduzetništvo'
                      onChange={handleChange}
                    />
                    Poduzetništvo
                  </div>
                  <input key={counterPlace.id}
                    autoComplete='off'
                    className={counterPlace.className}
                    style={{ marginBottom: '25px' }}
                    placeholder={counterPlace.placeholder}
                    type={counterPlace.type}
                    name={counterPlace.inputName}
                    value={formInputs[counterPlace.inputName] || ""}
                    onChange={handleChange}
                  />
                </>
              ))}
            </div>
          </Form>
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


export function EditCustomer(props) {   //Modal za ažuriranje vrijednosti kupaca

  const checkOib = require('oib.js')    //provjera oiba

  var minDate = new Date().toISOString().split("T")[0]  //minimalni datum za datum rođenja polje

  const { renderSite, setRenderSite } = useBetween(useSherableState)  //useBetween, za render stranice
  const [customersOib, setCustomersOib] = useState([])  //Svi oibi kupaca u bazi
  const [show, setShow] = useState(false)   //otvori/zatvori modal
  const [formInputs, setFormInputs] = useState({})  //vrijednosti unesene u polja
  const [name, setName] = useState(props.customer.ime)  //ime
  const [surname, setSurname] = useState(props.customer.prezime)  //prezime
  const [birthDate, setBirthDate] = useState(props.customer.datum_rodenja)  //datum rodenja
  const [residencePlace, setResidencePlace] = useState(props.customer.mjesto_stanovanja)  //mjesto stanovanja
  const [oib, setOib] = useState(props.customer.oib)  //oib
  const [pbr, setPbr] = useState(props.customer.postanski_broj)   //poštanski broj

  useEffect(() => {   //kada opet otvorimo ažuriraj modal, polja će biti popunjena sa najnovijim podacima, već smo prije toga ažurirali tog kupca
    setName(props.customer.ime)
    setSurname(props.customer.prezime)
    setBirthDate(props.customer.datum_rodenja)
    setResidencePlace(props.customer.mjesto_stanovanja)
    setOib(props.customer.oib)
    setPbr(props.customer.postanski_broj)
  }, [renderSite])

  useEffect(() => { //pri prvom ažuriranju kupca, popunjavaju se polja s vrijednostima
    setFormInputs(values => ({ ...values, ['name']: props.customer.ime }))
    setFormInputs(values => ({ ...values, ['surname']: props.customer.prezime }))
    setFormInputs(values => ({ ...values, ['birthDate']: props.customer.datum_rodenja }))
    setFormInputs(values => ({ ...values, ['residencePlace']: props.customer.mjesto_stanovanja }))
    setFormInputs(values => ({ ...values, ['oib']: props.customer.oib }))
    setFormInputs(values => ({ ...values, ['pbr']: props.customer.postanski_broj }))
  }, [show])

  useEffect(() => {
    const readUrlCustomers = "http://localhost/pin-elektra/src/php/admin_readCustomers.php"; //svi kupci
    axios.get(readUrlCustomers).then((response) => {
      setCustomersOib(response.data)    //spremanje svih OIB-a
    })
  }, [renderSite])

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)
  const handleDelete = () => {  //dugme obriši u modalu
    setFormInputs({})
  }

  const handleChange = (event) => { //promjenom vrijednosti ažurira se objekt formInputs
    const name = event.target.name
    const value = event.target.value
    setFormInputs(values => ({ ...values, [name]: value }))
  }

  const handleNumberChange = (event) => {
    const checkIntRegex = /^[0-9\b]+$/
    if (event.target.value === '' || checkIntRegex.test(event.target.value)) {
      handleChange(event)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    CheckInputs()
  }

  const CheckInputs = () => {
    if (formInputs.name === undefined || formInputs.name === "" || formInputs.surname === undefined || formInputs.surname === "" || formInputs.oib === undefined || formInputs.oib === "" ||
      formInputs.birthDate === undefined || formInputs.birthDate === "" || formInputs.residencePlace === undefined || formInputs.residencePlace === "" || formInputs.pbr === undefined
      || formInputs.pbr === "" || formInputs.pbr.length !== 5) {
      Swal.fire({
        icon: 'error',
        title: 'Neuspješno!',
        text: 'Nisu popunjena sva polja!',
      })
    }
    else {
      if (checkOib.validate(formInputs.oib)) {
        let checkAllOibs = true
        customersOib.forEach(element => {
          if (element.oib === formInputs.oib) {
            if (props.customer.oib != element.oib) {
              checkAllOibs = false
            }
          }
        });
        if (checkAllOibs) {
          InsertChanges()
          setRenderSite(renderSite + 1)
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Neuspješno!',
            text: 'Uneseni OIB se nalazi u sustavu!',
          })
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Neuspješno!',
          text: 'Netočan OIB!',
        })
      }
    }
  }


  const InsertChanges = () => {
    var params = new URLSearchParams()
    params.append('name', formInputs.name)
    params.append('surname', formInputs.surname)
    params.append('oib', formInputs.oib)
    params.append('birthDate', formInputs.birthDate)
    params.append('residencePlace', formInputs.residencePlace)
    params.append('pbr', formInputs.pbr)
    params.append('id', props.customer.sifra_kupca)
    let readUrl = "http://localhost/pin-elektra/src/php/modal_editCustomer.php"
    setShow(false)
    axios.post(readUrl, params).then()
    {
      Swal.fire({
        icon: 'success',
        title: 'Uspješno!',
        text: 'Podaci su ažurirani',
      })
    }
  }

  return (
    <>
      <button onClick={handleShow} className='btn btn-primary btn-sm'>
        <FontAwesomeIcon icon={faUserPen} />
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Uredi kupca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="container">
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Ime...'
                    type="text"
                    name="name"
                    autoComplete='off'
                    value={formInputs.name || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Prezime...'
                    type="text"
                    name="surname"
                    autoComplete='off'
                    value={formInputs.surname || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='OIB...'
                    type="text"
                    name="oib"
                    autoComplete='off'
                    value={formInputs.oib || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Datum rođenja...'
                    type="date"
                    name="birthDate"
                    max={minDate}
                    value={formInputs.birthDate || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Mjesto stanovanja...'
                    type="text"
                    name="residencePlace"
                    autoComplete='off'
                    value={formInputs.residencePlace || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className='row'>
                <div className="offset-md-2">
                  <input
                    placeholder='Pbr...'
                    type="number"
                    name="pbr"
                    autoComplete='off'
                    value={formInputs.pbr || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
              <br />
            </div>
          </Form>
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


export function DeleteCustomer(props) {

  const { renderSite, setRenderSite } = useBetween(useSherableState)  //useBetween render stranice

  const handleDeleteCustomer = () => {
    Swal.fire({
      title: 'Jeste li sigurni',
      text: "Kupac će trajno bit obrisan",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Odustani',
      confirmButtonText: 'Obriši'
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCustomer()
        Swal.fire(
          'Obrisano!',
          'Kupac je obrisan.',
          'success'
        )
      }
    })
  }

  const DeleteCustomer = () => {
    var params = new URLSearchParams()
    params.append('id', props.customer.sifra_kupca)

    axios.post("http://localhost/PIN-ELEKTRA/src/php/modal_deleteCustomer.php", params)

    setRenderSite(renderSite + 1)
  }

  return (
    <button onClick={handleDeleteCustomer} className='btn btn-danger btn-sm'>
      <FontAwesomeIcon icon={faUserSlash} />
    </button>
  )
}


export default AdminHome
