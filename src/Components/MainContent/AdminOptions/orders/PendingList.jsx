import React from 'react'
import OrderList from './OrderList'


function PendingList() {
  return (
    <OrderList
      topic = 'Pending List'
      status = 'pending'
      />
  )
}

export default PendingList
