import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar'


function AdminStatisticsTopArticle() {

    let tierCustomers = 1

    const [articles, setArticles] = useState([])
    const [emptyArray, setEmptyArray] = useState(0)

    useEffect(() => {
        const readStatisticsArticles = "http://localhost/pin-elektra/src/php/admin_statisticsCustomerArticle.php"
        axios.post(readStatisticsArticles).then((response) => {
            setArticles(response.data)
        })
    }, [emptyArray])

    if (articles === []) {
        setEmptyArray(emptyArray + 1)
    }


    return (
        <div style={{ overflowX: 'hidden', height: '100vh', background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,235,1,0.3984944319524685) 0%, rgba(22,95,198,0.5637605383950455) 0%, rgba(237,41,56,0.47692580450148814) 100%)' }}>
            <AdminNavbar />
            <div className='container' style={{ marginTop: '10px' }}>
                <div className='row'>
                    <div className="col-sm">
                        <table class="table table-striped table-hover table-light">
                            <thead>
                                <tr>
                                    <th scope='col'>Rbr.</th>
                                    <th scope="col">Šifra kupca</th>
                                    <th scope="col">Ime</th>
                                    <th scope="col">Prezime</th>
                                    <th scope="col">OIB</th>
                                    <th scope="col">Artikl ID</th>
                                    <th scope="col">Artikl naziv</th>
                                    <th scope="col">Količina</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    articles.map((item) => (
                                        item.sifra_kupca != null ? (
                                            <tr key={item.sifra_stavke}>
                                            <th scope='row'>{tierCustomers++}</th>
                                            <td>{item.sifra_kupca}</td>
                                            <td>{item.ime_kupca}</td>
                                            <td>{item.prezime_kupca}</td>
                                            <td>{item.oib_kupca}</td>
                                            <td>{item.sifra_artikla}</td>
                                            <td>{item.naziv_artikla}</td>
                                            <td>{item.kolicina_artikla} kWh</td>
                                        </tr>
                                        ) : (
                                            <tr key={item.sifra_stavke}>
                                            <th scope='row'>{tierCustomers++}</th>
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

export default AdminStatisticsTopArticle
