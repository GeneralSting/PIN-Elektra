import React, { useRef, useState, useEffect, } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../scss/css/Login.css'



const Login = () => {

    if(sessionStorage.getItem('admin') !== null)
    {
        sessionStorage.removeItem('admin')
    }
    if(sessionStorage.getItem('customer') !== null)
    {
        sessionStorage.removeItem('customer')
    }

    const navigate = useNavigate()  //uspješnu prijavu prosljeđuje sljedećoj komponenti

    var falseLogin = false; //korisnik nije prijavljen - pristup zabranjen
    var trueLogin = true;   //korisnik prijavljen - pristup odobren
    localStorage.setItem('loginVerification', JSON.stringify(falseLogin))   //provjera prijave

    const userRef = useRef();   //fokus postavljen na unos E-maila
    const errRef = useRef();    //fokus postavljen na error

    const readUrl = "http://localhost/pin-elektra/src/php/login_readCustomers.php"; //svi korisnici
    const readUrlAdmins = "http://localhost/pin-elektra/src/php/login_readAdmins.php"; //svi admini

    const [loginAdmins, setLoginAdmins] = useState([]);         //svi admini spremljeni
    const [loginCustomers, setLoginCustomers] = useState([]);   //svi korisnici spremljeni
    const [user, setUser] = useState('')                //email
    const [password, setPassword] = useState('')        //lozinka
    const [errMessage, setErrMessage] = useState('')    //error

    useEffect(() => {
        axios.get(readUrlAdmins).then((response) => {
            setLoginAdmins(response.data)    //spremanje admina iz baze
        })
    }, [])

    useEffect(() => {
        axios.get(readUrl).then((response) => {
            setLoginCustomers(response.data)    //spremanje korisnika iz baze
        })
    }, [])

    useEffect(() => {
        userRef.current.focus() //postavljanje fokusa na e-mail input
    }, [])

    useEffect(() => {
        setErrMessage('')       //pri unosu uklanja se error
    }, [user, password])

    const handleSubmit = async (e) => {     //submit-provjera prijave
        e.preventDefault();
        let checkEmail = false;     //provjera postojanja e-maila
        let checkCustomer = false;  //provjera da li je korisnik ili admin
        loginCustomers.forEach(loginUser => {     
            if (loginUser.email_kupca === user) {
                checkCustomer = true;
                checkEmail = true;
                if (loginUser.lozinka_kupca === password) {
                    try {   //uspješna prijava
                        setUser('')
                        setPassword('')
                        localStorage.setItem('loginVerification', JSON.stringify(trueLogin))
                        sessionStorage.setItem('customer', JSON.stringify(loginUser))
                        navigate('/Customer', { state: { user: loginUser  } });
                    }
                    catch (err) {
                        setErrMessage(err);
                    }
                }
                else {  //e-mail točan, lozinka nije
                    setErrMessage('Podaci se ne podudaraju!');
                    errRef.current.focus();
                }
            }
        });
        if(!checkCustomer)  //nije pronađen nijedan kupac -> traženje admina
        {
            loginAdmins.forEach(loginUser => {   
                if (loginUser.email_admina === user) {
                    checkEmail = true;
                    if (loginUser.lozinka_admina === password) {
                        try {   //uspješna prijava
                            localStorage.setItem('loginVerification', JSON.stringify(trueLogin))
                            sessionStorage.setItem('admin', JSON.stringify(loginUser))
                            navigate('/Admin', { state: { user: loginUser  } });
                        }
                        catch (err) {
                            setErrMessage(err);
                        }
                    }
                    else {  //e-mail točan, lozinka nije
                        setErrMessage('Podaci se ne podudaraju!');
                        errRef.current.focus();
                    }
                }
            });
            if(!checkEmail)
            {
                setErrMessage('E-mail ne postoji!');
                errRef.current.focus();
            }
        }
    }

    return (
        <div className='userLogin'>
            <section className='loginSection'>
                <p ref={errRef} className={errMessage ? 'errmsg' : 'offscreen'} aria-live='assertive'>
                    {errMessage}
                </p>
                <h1>Prijava</h1>
                <form onSubmit={handleSubmit}>
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
                    />

                    <button className='btn' id='btn-login'>Prijavi se</button>
                </form>
                <p id='registration-part'>
                    Niste registrirani?
                    <br />
                    <span className='line'>
                        <Link to={'/Registration/'}>Registracija</Link>
                    </span>
                </p>
            </section>
        </div>
    )
}
export default Login