import React from 'react';
import ToyInterface from './../interfaces/ToyInterface';

interface ToyProps {
  toy: ToyInterface;
 
  onClickDelete: (toyId: number) => void;
}

const Toy: React.FC<ToyProps> = ({ toy, onClickDelete }) => {
  return (
    <section className='d-flex justify-content-between my-3'>
      <h2 className={toy.done ? "h4 text-decoration-line-through" : "h4"}>{toy.label}</h2>
      <div>
        
        <button
          onClick={() => {
            onClickDelete(toy.id);
          }}
          className="btn btn-danger">Supprimer</button>
      </div>
    </section>
  );
};

export default Toy;
