
import React, { useState } from 'react';
import ToyFetcher from '../services/ToyFetcher';
import ToyInterface from '../interfaces/ToyInterface';

interface ToyFormProps {
  onToyAdd: (newToy: ToyInterface) => void;
}

const ToyForm: React.FC<ToyFormProps> = ({ onToyAdd }) => {
  const [newToy, setNewToy] = useState<Partial<ToyInterface>>({
    label: '',
    price: 0, 
    year: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewToy((prevToy) => ({
      ...prevToy,
      [name]: name === 'price' ? parseFloat(value) : value, 
    }));
  };

  const handleAddToy = () => {
    ToyFetcher.addToy(newToy as Omit<ToyInterface, 'id'>)
      .then(() => {
        onToyAdd({ ...newToy, id: Date.now(), done: false } as ToyInterface);
        setNewToy({ label: '', price: 0, year: '' });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du jouet :', error);
      });
  };

  return (
    <div>
      <h2>Ajouter un nouveau jouet</h2>
      <form className="addToys">
        <label className="addToysLabel">
          Label:
          <input type="text" name="label" value={newToy.label} onChange={handleInputChange} className="addHandle"/>
        </label>
        <br />
        <label className="addToysLabel">
          Prix:
          <input type="number" name="price" value={newToy.price} onChange={handleInputChange} className="addHandle"/>
        </label>
        <br />
        <label className="addToysLabel">
          Année:
          <input type="text" name="year" value={newToy.year} onChange={handleInputChange} className="addHandle"/>
        </label>
        <br />
        <button type="button" onClick={handleAddToy} className="addRemove">
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default ToyForm;