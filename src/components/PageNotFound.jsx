import React from 'react'
import ErrorNotFound from '../img/error404.png'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {

  const navigate = useNavigate()

  return (
    <div className='welcomeCustomer'>
      <section className='section_unauthorizedAccess'>
        <h1>Page not found</h1>
        <img src={ErrorNotFound} alt="" />
        <p className='paragraph_unauthorizedAccess'>Stranica ne postoji! <b><button className='btn btn-secondary' onClick={ () => navigate(-1)}>Vrati se</button></b></p>
      </section>
    </div>
  )
}

export default PageNotFound
