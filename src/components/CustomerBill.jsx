import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import PinElektra_128 from '../img/elektraLogo128.png'
import PinElektra_32 from '../img/elektraLogo32.png'
import pdfCode from '../img/pdfCode.png';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBContainer,
    MDBRow,
    MDBCol,
} from "mdbreact";

const CustomerBill = () => {

    const [loaded, setLoaded] = useState(false)

    setTimeout(() => {
        setLoaded(true)
    }, 1000);

    let location = useLocation()

    var totalCost = (parseFloat(location.state.paramsReceiptItem.iznos_stavke) + parseFloat(location.state.paramReceiptSecondItem.iznos_stavke)).toFixed(2)

    
    return (
        <>
            {loaded ? (
                <MDBContainer style={{marginTop: '10px'}}>
                    <MDBRow>
                        <MDBCol size="3">
                            <MDBCard>
                                <MDBCardBody style={{ boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset' }}>
                                    <MDBCardTitle tag="h5">PIN-elektra d.o.o.</MDBCardTitle>
                                    <MDBCardText style={{ fontSize: '10px' }}>
                                        <p style={{ margin: '0px' }}><b>Matični broj: 04622430</b></p>
                                        <p style={{ margin: '0px' }}><b>OIB: 43965974818</b></p>
                                        <p style={{ margin: '0px' }}>Zagreb, Ulica grada Vukovara 37</p>
                                        <p style={{ margin: '0px' }}>TEL (bespl. potroš. broj): 0800 300 303</p>
                                    </MDBCardText>
                                    <MDBCardText small muted>
                                        Tvrtka koja je izdala račun
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="1" className='offset-md-2'>
                            <img src={PinElektra_128} alt="" style={{ marginTop: '20px', marginLeft: '35%' }} />
                        </MDBCol>
                        <MDBCol size="4" style={{ marginLeft: '16.5%' }}>
                            <MDBCard>
                                <MDBCardBody style={{ boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' }}>
                                    <MDBCardTitle tag="h5"></MDBCardTitle>
                                    <MDBCardText>
                                        <p style={{ margin: '0px' }}><b>{location.state.paramsCustomer.ime + ' ' + location.state.paramsCustomer.prezime}</b></p>
                                        <p style={{ margin: '0px' }}>{location.state.paramsCustomer.postanski_broj} </p>
                                        <p style={{ margin: '0px' }}>{location.state.paramsCustomer.mjesto_stanovanja} </p>

                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="3">
                            <MDBCard>
                                <MDBCardBody style={{ boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset' }}>
                                    <MDBCardTitle tag="h5">Kupac({location.state.paramsCustomer.sifra_kupca})</MDBCardTitle>
                                    <MDBCardText>
                                        <p style={{ margin: '0px' }}>OIB: {location.state.paramsCustomer.oib}</p>
                                        <p style={{ margin: '0px' }}>Šifra računa: {location.state.paramsReceiptItem.broj_racuna}</p>
                                    </MDBCardText>
                                    <MDBCardText small muted>
                                        Pravna osoba koja prima račun
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="9">
                            <MDBCard>
                                <MDBCardBody style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px' }}>
                                    <MDBCardTitle tag="h5">Kupac</MDBCardTitle>
                                    <MDBCardText>
                                        <table className="table table-striped table-bordered table-sm table-light border-dark">

                                            <thead>
                                                <tr>
                                                    <th scope="col">Naziv artikla</th>
                                                    <th scope='col'>Jed. mjere</th>
                                                    <th scope="col">Količina artikla</th>
                                                    <th scope='col'>Jed. cijena</th>
                                                    <th scope="col">Iznos stavke</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={location.state.paramsReceiptItem.sifra_stavke}>
                                                    <th scope='row'>{location.state.paramsReceiptItem.naziv_artikla}</th>
                                                    <td>kWh</td>
                                                    <td>{location.state.paramsReceiptItem.kolicina_artikla}</td>
                                                    <td>{parseFloat(location.state.paramsArticlePrice.cijena_artikla).toFixed(2)}kn</td>
                                                    <td>{parseFloat(location.state.paramsReceiptItem.iznos_stavke).toFixed(2)}kn</td>
                                                </tr>
                                                <tr key={location.state.paramReceiptSecondItem.sifra_stavke}>
                                                    <th scope='row'>{location.state.paramReceiptSecondItem.naziv_artikla}</th>
                                                    <td>kWh</td>
                                                    <td>{location.state.paramReceiptSecondItem.kolicina_artikla}</td>
                                                    <td>{parseFloat(location.state.paramsSecondArticlePrice.cijena_artikla).toFixed(2)}kn</td>
                                                    <td>{parseFloat(location.state.paramReceiptSecondItem.iznos_stavke).toFixed(2)}kn</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </MDBCardText>
                                    <MDBCardText small>
                                        Ukupan iznos računa: {totalCost}kn
                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="3">
                            <p style={{margin: '0px', fontSize: '15px'}}>Članak 105. stavka 8. točka 5. Zakona o trošarinama</p>
                            <p style={{margin: '0px', fontSize: '15px'}}><b>Na dan izdavanja računa, podmireni su svi Vaši dospjeli računi. Hvala!</b></p>
                            <img src={PinElektra_32} alt="" />
                        </MDBCol>
                        <MDBCol size="6" className='offset-md-2'>
                            <img src={pdfCode} alt="" style={{marginTop: '30px'}}/>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>

            ) : (
                <div style={{ marginTop: '45vh', marginLeft: '46vw' }}>
                    <BarLoader loading speedMultiplier={1} color='#165FC6' />
                    <br />
                    <BarLoader loading speedMultiplier={2} color='#FFEB01' />
                    <br />
                    <BarLoader loading speedMultiplier={1} color='#ED2938' />
                </div>
            )
            }
        </>

    );
};

export default CustomerBill;