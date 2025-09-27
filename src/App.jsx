import './App.css';

import { useState } from 'react';

import Sidebar from './Components/MainContent/SideBarComponent/Sidebar';
import InsertForm from './Components/MainContent/AdminOptions/Insert/InsertForm';
import ProductList from './Components/MainContent/AdminOptions/manageProducts/ProductList';
import DeleteProduct from './Components/MainContent/AdminOptions/manageProducts/DeleteProduct'
import UpdateForm from './Components/MainContent/AdminOptions/manageProducts/UpdateForm';
import CustomersList from'./Components/MainContent/AdminOptions/customers/CustomersList'
import OrderList from './Components/MainContent/AdminOptions/orders/OrderList'
function App() {
  const [activeContent, setActiveContent] = useState('dashBord');

  const sidebarClick = (type) => {
    setActiveContent(type);
  };

  return (
    <>
      <div className="bg-white min-h-screen grid grid-cols-4 grid-rows-[6rem_1fr]">
        <div className="fixed top-0 left-0 right-0 z-50 h-24 bg-yellow-300"></div>
        <Sidebar sidebarClick={sidebarClick} />

        <div className="grid grid-cols-2 col-span-3 gap-4 mt-24">
          
          
          {activeContent === 'add_item' && <InsertForm />}
          {activeContent === 'manage_items' && <ProductList/>}
          {activeContent === 'order' && <OrderList/>}
        </div>
      </div>
    </>
  );
}

export default App;
