import React, { useRef, useState, useEffect, } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../scss/css/Login.css'
import Tippy from '@tippy.js/react';
import Swal from 'sweetalert2';


function Registration() {

    const navigate = useNavigate()  //uspješnu prijavu prosljeđuje sljedećoj komponenti

    const userRef = useRef();   //fokus postavljen na unos E-maila
    const errRef = useRef();    //fokus postavljen na error


    const readUrl = "http://localhost/pin-elektra/src/php/login_readCustomers.php"; //svi korisnici

    const [loginCustomers, setLoginCustomers] = useState([]);   //svi korisnici spremljeni
    const [counterCode, setCounterCode] = useState('')          //šifra kupca
    const [correctCounterCode, setCorrectCounterCode] = useState(false)    //provjera unesenog kupca
    const [enableSubmit, setEnableSubmit] = useState(false)     //dozvoli submit dugme
    const [user, setUser] = useState('')                        //email
    const [password, setPassword] = useState('')                //lozinka
    const [confirmPassword, setConfirmPassword] = useState('')  //potvrde lozinke
    const [errMessage, setErrMessage] = useState('')    //error

    useEffect(() => {
        axios.get(readUrl).then((response) => {
            setLoginCustomers(response.data)    //spremanje korisnika iz baze
        })
    }, [])

    useEffect(() => {
        setErrMessage('')            
    }, [counterCode, user, password, confirmPassword])

    useEffect(() => {
        userRef.current.focus() //postavljanje fokusa na e-mail input
    }, [correctCounterCode])

    useEffect(() => {
        EnableSubmitButton()
    }, [user, password, confirmPassword])

    const CounterCodeCheck = (customerId) => {
        let correctnes = false;
        setErrMessage('')
        setCounterCode(customerId)
        loginCustomers.forEach(customer => {
            if (customer.sifra_kupca === customerId) {    //Traženje kupca s unesnom šifrom kupca
                if(customer.email_kupca === "")
                {
                    correctnes = true;
                    setCorrectCounterCode(true)
                }
                if(correctnes === false)
                {
                    if (customer.email_kupca !== null) {    //provjera da li je kupac već registriran, tj. da li je email zauzet
                        setTimeout(() => {
                            setErrMessage('Korisnik je već registriran s unesenom šifrom kupca')                
                        }, 200);
                    }
                    else {
                        correctnes = true;
                        setCorrectCounterCode(true)
                    }
                }
            }
        });
        if (!correctnes) {
            setCorrectCounterCode(false)
        }
    }

    const DeleteInputs = () => {
        setUser('')
        setPassword('')
        setConfirmPassword('')
    }

    const EnableSubmitButton = () => {  //provjera unesene vrijednosti te pri ispunjenju uvjeta omogućava submit dugme
        if(user.length > 5 && user.includes('@') && password.length > 7 && confirmPassword.length > 7 && password === confirmPassword)
        {
            setEnableSubmit(true)
        }
        else
        {
            setEnableSubmit(false)
        }
    }

    const handleSubmit = async (e) => {     //submit-provjera prijave
        e.preventDefault();
        let emailCheck = true;
        loginCustomers.forEach(registeredUser => {
            if(registeredUser.email_kupca === user)
            {
                emailCheck = false;
                setErrMessage('E-mail je povezan s drugom šifrom kupca!')
            }
        });
        if(emailCheck)
        {
            Swal.fire({
                icon: 'success',
                title: 'Uspješno ste registrirani!',
                showConfirmButton: false,
                timer: 1500
              })
            setTimeout(() => {
                var params = new URLSearchParams()
                params.append('kupac_sifra', counterCode)
                params.append('kupac_email', user)
                params.append('kupac_lozinka', password)
                axios.post("http://localhost/pin-elektra/src/php/registration_addCustomer.php", params)
                .then((response)=>{navigate('/', {replace:true})})
            }, 1500);
        }
    }

    return (
        <div className='registration'>
            {correctCounterCode ? (     //provjera ispravnosti unesene šifre kupca
                <section className='sectionRegistration'>
                    <p ref={errRef} className={errMessage ? 'errmsg' : 'offscreen'} aria-live='assertive'>  {/*postavljanje greške ako je ima*/}
                        {errMessage}
                    </p>
                    <h1>Registracija</h1>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="username">Šifra kupca: </label>
                        <Tippy content={<span style={{color: 'rgb(245, 128, 128)', fontSize: '1rem'}}>Promjenom vrijednosti obrisat će se ostale unesene vrijednosti </span>} 
                        position='bottom'
                        >
                            <input
                                type="number"
                                id="counterCode"
                                ref={userRef}
                                min="0"
                                autoComplete='off'
                                onChange={(e) => {CounterCodeCheck(e.target.value); DeleteInputs()}}
                                value={counterCode}
                                required
                            />
                        </Tippy>

                        <label htmlFor="username">E-mail: </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required

                        />

                        <label htmlFor="password">Lozinka: </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            placeholder='8+ znakova'
                        />

                        <label htmlFor="confirmPassword">Potvrdi lozinku: </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder='8+ znakova'
                            required
                        />
                        {enableSubmit ?  (  //omogućeno submit dugme
                            <button className='btn' id='btn-login'>Prijavi se</button>
                        ) : (   //onemogućeno submit dugme
                            <button className='btn button-disabled' id='btn-login' disabled>Prijavi se</button>
                        )}

                    </form>
                    <p id='registration-part'>
                        Već ste registrirani?
                        <br />
                        <span className='line'>
                            <Link to={'/'}>Prijava</Link>
                        </span>
                    </p>
                </section>
            ) : (   //šifra kupca nije zadovoljila uvjet
                <section className='sectionRegistration'>
                    <p ref={errRef} className={errMessage ? 'errmsg' : 'offscreen'} aria-live='assertive'>
                        {errMessage}
                    </p>
                    <h1>Registracija</h1>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="counterCode">Šifra kupca: </label>
                        <input
                            type="number"
                            id="counterCode"
                            ref={userRef}
                            onKeyDown={(event) => {
                                if(event.keyCode === 8)
                                {

                                }
                                else if(!(/^[0-9]\d*$/).test(event.key)){
                                    event.preventDefault();
                                }
                                
                            }}
                            min='1'
                            autoComplete='off'
                            onChange={(e) => CounterCodeCheck(e.target.value)}
                            value={counterCode}
                            required
                        />

                        <label htmlFor="username">E-mail: </label>
                        <Tippy content='Prvo ispunite polje "Šifra kupca"'>
                            <span>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete='off'
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    disabled

                                />
                            </span>
                        </Tippy>

                        <label htmlFor="password">Lozinka: </label>
                        <Tippy content='Prvo ispunite polje "Šifra kupca"'>
                            <span>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    disabled
                                />
                            </span>
                        </Tippy>

                        <label htmlFor="confirmPassword">Potvrdi lozinku: </label>
                        <Tippy content='Prvo ispunite polje "Šifra kupca"'>
                            <span>
                                <input
                                    type="text"
                                    id="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    required
                                    disabled
                                />
                            </span>
                        </Tippy>

                        <button className='btn' id='btn-login' disabled>Prijavi se</button>

                    </form>
                    <p id='registration-part'>
                        Već ste registrirani?
                        <br />
                        <span className='line'>
                            <Link to={'/'}>Prijava</Link>
                        </span>
                    </p>
                </section>
            )}
        </div>
    )
}

export default Registration
