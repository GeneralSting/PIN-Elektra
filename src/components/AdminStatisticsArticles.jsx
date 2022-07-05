import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar'

function AdminStatisticsArticles() {

    let tierArticles = 1

    const [articles, setArticles] = useState([])
    const [emptyArray, setEmptyArray] = useState(0)

    useEffect(() => {
        const readStatisticsArticles = "http://localhost/pin-elektra/src/php/admin_statistics.php"
        axios.post(readStatisticsArticles).then((response) => {
            setArticles(response.data)
        })
    }, [emptyArray])

    if (articles === []) {
        setEmptyArray(emptyArray + 1)
    }


    return (
        <div style={{ overflowX: 'hidden', height: '100vh', background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(255,235,1,0.36207986612613796) 100%)' }}>
            <AdminNavbar />
            <div className='container' style={{ marginTop: '8%' }}>
                <div className='row'>
                    <div className="col-sm">
                        <table class="table table-striped table-hover table-light">
                            <thead>
                                <tr>
                                    <th scope="col">Rbr.</th>
                                    <th scope="col">Artikl ID</th>
                                    <th scope="col">Artikl naziv</th>
                                    <th scope="col">Prodana količina</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    articles.map((item) => (
                                        <tr key={item.sifra_stavke}>
                                            <th scope='row'>{tierArticles++}</th>
                                            <td>{item.sifra_artikla}</td>
                                            <td>{item.naziv_artikla}</td>
                                            <td>{item.kolicina_artikla} kWh</td>
                                        </tr>
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

export default AdminStatisticsArticles
