import React from 'react';
import ToyInterface from './../interfaces/ToyInterface';
import './App.css';

interface ToyProps {
  toy: ToyInterface;
  onClickDelete: (toyId: number) => void;
  onClickUpdate: (toyId: number) => void;
}

const Toy: React.FC<ToyProps> = ({ toy, onClickUpdate, onClickDelete }) => {
  return (
    <section className='d-flex justify-content-between my-3'>
      <h2 className={toy.done ? "h4 text-decoration-line-through" : "h4"}>{toy.label} - {toy.price}€ - {toy.year}</h2>
      <div>
      <button
          onClick={() => {
            onClickUpdate(toy.id);
          }}
          className="btn btn-success">Modifier</button>
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
