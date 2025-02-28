//components/commonComponets/Delete
'use client';
import React, { useState } from 'react';
import DeleteModal from '@/components/common/Modal/deleteModal';

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const [show, setShow] = useState(false);

  const showModal = async () => {
      setShow(true);
       
  };

  return (
    <>
    {show && <DeleteModal show ={show} setShow ={setShow} id={id}/>}
      <button  onClick={() => showModal()}>
      <i className="bi bi-trash text-red"></i>
      </button>
    </>
  );

};
export default DeleteButton;
