//components/commonComponets/Delete
'use client';
import React, { useState } from 'react';
import DeleteInvoiceModal from './deleteInvoiceModal';

type Props = {
  id: string;
};

const DeleteInvoice = ({ id }: Props) => {

  const [show, setShow] = useState(false);

  const showModal = async () => {
      setShow(true);
       
  };

  

  return (
    <>
    {show && <DeleteInvoiceModal show ={show} setShow ={setShow} id={id}/>}
      <button  onClick={() => showModal()}>
      <i className="bi bi-trash text-red"></i>
      </button>
    </>
  );

};
export default DeleteInvoice;
