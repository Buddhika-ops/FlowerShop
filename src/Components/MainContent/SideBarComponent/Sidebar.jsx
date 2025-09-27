import React from 'react';
import home from '../../../assets/home.svg';
import shop from '../../../assets/shop.svg';
import change from '../../../assets/change.svg';
import orders from '../../../assets/Orders.svg';
import customer from '../../../assets/Customer.svg';
import analytics from '../../../assets/analytics.svg';
import Setting from '../../../assets/setting.svg';
import support from '../../../assets/support.svg';
import inbox from '../../../assets/inbox.svg';

import SidebarButtons from './SidebarButtons';
import SidebarTopics from './SidebarTopics';

function Sidebar({ sidebarClick }) {
  return (
    <div>
      <div className="fixed flex flex-col w-1/4 h-screen bg-gray-100 top-24">
        <SidebarTopics topic="Main Menu" />
        <SidebarButtons
          lable="Home"
          icon={home}
          onClick={() => sidebarClick('Home')}
        />
        <SidebarButtons
          lable="Add New Product"
          icon={shop}
          onClick={() => sidebarClick('add_item')}
        />

        <SidebarButtons
          lable="Update Items"
          icon={change}
          onClick={() => sidebarClick('manage_items')}
        />
        <SidebarButtons
          lable="Orders"
          icon={orders}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          lable="Customers"
          icon={customer}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          lable="Analytics Report"
          icon={analytics}
          onClick={() => sidebarClick('order')}
        />
        <SidebarTopics topic="Other" />
        <SidebarButtons
          lable="Settings"
          icon={Setting}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          lable="Inbox"
          icon={inbox}
          onClick={() => sidebarClick('order')}
        />
        <SidebarButtons
          lable="Help & support"
          icon={support}
          onClick={() => sidebarClick('order')}
        />
      </div>
    </div>
  );
}

export default Sidebar;
