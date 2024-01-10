
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
      [name]: value,
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
      <form>
        <label>
          Label:
          <input type="text" name="label" value={newToy.label} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Prix:
          <input type="number" name="price" value={newToy.price} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Année:
          <input type="text" name="year" value={newToy.year} onChange={handleInputChange} />
        </label>
        <br />
        <button type="button" onClick={handleAddToy}>
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default ToyForm;