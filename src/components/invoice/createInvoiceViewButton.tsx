'use client';
import React, { useState } from 'react';
import CreateInvoiceView from './createInvoiceView';

const CreateInvoiceViewButton = ({ getCllientList }: any) => {
  const [show, setShow] = useState(false);

  const showModal = async () => {
      setShow(true);
  };
  return (
    <>
      {show && (
        <CreateInvoiceView
        
          show={show}
          setShow={setShow}
          getCllientList={getCllientList}
        />
      )}
      <div className='button-container'>
        <button
          onClick={showModal}
          type='button'
          className='primaryaction_link'
          data-bs-target='#CreateInvoiceModal'
          data-bs-toggle='modal'
        >
          Create New Invoice
        </button>
      </div>
    </>
  );
};

export default CreateInvoiceViewButton;
