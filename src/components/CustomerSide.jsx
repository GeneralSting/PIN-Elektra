import React, { useEffect } from 'react'
import ErrorUnauthorized from '../img/error401.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PinElektra from '../img/elektraLogo128.png'

function ForwardHome() {  //prosljeđuje do home stranice, pregled računa
  let location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/home', {state:{user: location.state.user}})
    }, 3000)
  }, [])
}

function CustomerSide() { 
  let checkOib = JSON.parse(localStorage.getItem('loginVerification'))  //da li je korisnik uspješno prijavljen
  let location = useLocation();
  if (checkOib === true) {
    ForwardHome();
  }

  if (localStorage.getItem('loginVerification'))
    return (
      <div className='welcomeCustomer'>
        {checkOib ? (   //korisnik prijavljen
          <>
            <img src={PinElektra} alt="" />
            <section>
              <h1>Dobrodošao!</h1>
              <br/>
              <p className='paragraph_welcome'><b>{location.state.user.ime + " " + location.state.user.prezime}</b></p>
              <br/>
              <p><u style={{borderBottom: '2px solid orange', textDecorationColor: 'blue'}}>Uspješno ste prijavljeni</u></p>
            </section>
          </>
        ) : (           //korisnik nije prijavljen, pokušaj preko URL-a
          <section className='section_unauthorizedAccess'>
            <h1>Zalutao si?</h1>
            <img src={ErrorUnauthorized} alt="" />
            <p className='paragraph_unauthorizedAccess'>Za pristup stranici molimo Te da se <b><Link to='/'>prijaviš</Link></b></p>
          </section>
        )}
      </div>
    )
}

export default CustomerSide
