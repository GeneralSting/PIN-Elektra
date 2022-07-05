import React from 'react';
import {Routes, Route} from 'react-router-dom'
import './App.css';
import AdminCustomersBills from './components/AdminCustomersBills';
import AdminCustomerCounters from './components/AdminCustomerCounters';
import AdminHome from './components/AdminHome';
import AdminNavbar from './components/AdminNavbar';
import CustomerHome from './components/CustomerHome';
import CustomerSide from './components/CustomerSide';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Registration from './components/Registration';
import AdminCustomerBill from './components/AdminCustomerBill';
import AdminCanceledBills from './components/AdminCanceledBills';
import AdminStatistics from './components/AdminStatistics';
import AdminStatisticsArticles from './components/AdminStatisticsArticles';
import AdminStatisticsTopReceipts from './components/AdminStatisticsTopReceipts';
import AdminStatisticsTopArticle from './components/AdminStatisticsTopArticle';
import CustomerBill from './components/CustomerBill';
import AdminStatisticsTopCustomers from './components/AdminStatisticsTopCustomers';



function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Login />}  />
          <Route path='/Customer' element={<CustomerSide/>} />
          <Route path='/Registration' element={<Registration />} />
          <Route path='/home' element={<CustomerHome />}/>
          <Route path='/Admin' element={<AdminHome />} />
          <Route path='/navbar' element={<AdminNavbar /> }/>
          <Route path='/Admin/Counters/' element={<AdminCustomerCounters />} />
          <Route path='Admin/Racuni/' element={<AdminCustomersBills />} />
          <Route path='Admin/Racuni/racun' element={<AdminCustomerBill />} />
          <Route path='Admin/Racuni/stornirano' element={<AdminCanceledBills />} />
          <Route path='Admin/Statistika' element={<AdminStatistics />} />
          <Route path='Admin/Statistika/Artikli/Najprodavaniji' element={<AdminStatisticsArticles />} />
          <Route path='Admin/Statistika/Racuni/Top10' element={<AdminStatisticsTopReceipts />} />
          <Route path='Admin/Statistika/Artikli/Top10' element={<AdminStatisticsTopArticle />} />   
          <Route path='Admin/Statistika/Kupci/Top10' element={<AdminStatisticsTopCustomers />} />       
          <Route path='home/Racun' element={<CustomerBill />} />

          <Route path='*' element={<PageNotFound />} />
        </Routes>

    </div>
  );
}

export default App;
