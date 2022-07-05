import React from 'react'
import { CardGroup, Card, Image } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom';
import bestSellers from '../img/bestSellers.png'
import topReceipts from '../img/topReceipts.png'
import topArticle from '../img/topArticle.png'
import topCustomers from '../img/topCustomers.png'
import PinElektra_32 from '../img/elektraLogo32.png'
import AdminNavbar from './AdminNavbar.jsx';



function AdminStatistics() {

    const navigate = useNavigate()

    const bestSellersArticles = () => {
        navigate('Artikli/Najprodavaniji')
    }

    const topBiggestReceipts = () => {
        navigate('Racuni/Top10')
    }

    const topCustomersArticle = () => {
        navigate('Artikli/Top10')
    }

    const topCustomersReceipts = () => {
        navigate('Kupci/Top10')
    }

    return (
        <div style={{ overflowX: 'hidden' }}>
            <AdminNavbar />
            <div className='container'>
                <h1 className='statisticsTitle'>Statistika</h1>
            </div>
            <div style={{ marginTop: '50px' }}>
                <CardGroup style={{ margin: 'auto' }}>
                    <Card border='warning' style={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(255,235,1,0.36207986612613796) 100%)', margin: '0px 10px' }}>
                        <p>
                            <Image fluid rounded src={bestSellers} />
                        </p>
                        <Card.Body>
                            <Card.Title>Najprodavaniji artikli</Card.Title>
                            <Card.Text>
                                Prikaz tablice najprodavanijih artikala kod svih kupaca
                                <div style={{ marginTop: '25px' }}>
                                    <button onClick={bestSellersArticles} className='btn btn-warning btn-sm'>Pregled</button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small>Podaci korisnika se koriste <u>samo</u> sa svrhom poboljšanja poslovanja <img src={PinElektra_32} alt="" /></small>
                        </Card.Footer>
                    </Card>
                    <Card border='info' style={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,235,1,0.3984944319524685) 0%, rgba(22,95,198,0.49933476808692223) 100%)', margin: '0px 10px' }}>
                        <p>
                            <Image fluid rounded src={topCustomers} />
                        </p>                        <Card.Body>
                            <Card.Title>Top 10 kupaca</Card.Title>
                            <Card.Text>
                                Prikaz deset kupaca koji su imali najveći ukupan iznos računa
                                <div style={{ marginTop: '25px' }}>
                                    <button onClick={topCustomersReceipts} className='btn btn-primary btn-sm'>Pregled</button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small>Podaci korisnika se koriste <u>samo</u> sa svrhom poboljšanja poslovanja <img src={PinElektra_32} alt="" /></small>
                        </Card.Footer>
                    </Card>
                    <Card border='danger' style={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,235,1,0.3984944319524685) 0%, rgba(22,95,198,0.5637605383950455) 0%, rgba(237,41,56,0.47692580450148814) 100%)', margin: '0px 10px' }}>
                        <p>
                            <Image fluid rounded src={topArticle} />
                        </p>                        <Card.Body>
                            <Card.Title>Top 10 kupaca</Card.Title>
                            <Card.Text>
                                prikaz tablice s deset kupaca koji su najviše potrošili električnu energiju po niskoj tarifi
                                <div style={{ marginTop: '25px' }}>
                                    <button onClick={topCustomersArticle} className='btn btn-danger btn-sm'>Pregled</button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small>Podaci korisnika se koriste <u>samo</u> sa svrhom poboljšanja poslovanja <img src={PinElektra_32} alt="" /></small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
                <CardGroup>
                    <Card border='warning' style={{ background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(237,41,56,0.4433123591233369) 100%)', margin: '0px 10px' }}>
                        <p style={{ marginTop: '10px' }}>
                            <Image fluid rounded src={topReceipts} />
                        </p>
                        <Card.Body>
                            <Card.Title>Top 10 računa</Card.Title>
                            <Card.Text>
                                Prikaz tablice najvećih računa prema njihovom ukupnom iznosu
                                <div style={{ marginTop: '25px' }}>
                                    <button onClick={topBiggestReceipts} className='btn btn-outline-danger btn-sm'>Pregled</button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small>Podaci korisnika se koriste <u>samo</u> sa svrhom poboljšanja poslovanja <img src={PinElektra_32} alt="" /></small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
            </div>
        </div>
    )
}

export default AdminStatistics
