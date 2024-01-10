import React, { useState, useEffect } from 'react';
import ToyFetcher from '../services/ToyFetcher';
import ToyInterface from '../interfaces/ToyInterface';

interface ToyUpdateFormProps {
  toyId: number;
  onToyUpdate: (updatedToy: ToyInterface) => void;
}

const ToyUpdateForm: React.FC<ToyUpdateFormProps> = ({ toyId, onToyUpdate }) => {
  const [updatedToy, setUpdatedToy] = useState<Partial<ToyInterface>>({
    label: '',
    price: 0,
    year: '',
  });

  useEffect(() => {
    // Charger les détails du jouet à partir du server
    ToyFetcher.loadToys()
      .then((toys: ToyInterface[]) => {
        const toyToUpdate = toys.find((toy) => toy.id === toyId);
        if (toyToUpdate) {
          setUpdatedToy({
            label: toyToUpdate.label,
            price: toyToUpdate.price,
            year: toyToUpdate.year,
          });
        }
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des jouets pour la mise à jour :', error);
      });
  }, [toyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedToy((prevToy) => ({
      ...prevToy,
      [name]: value,
    }));
  };

  const handleUpdateToy = () => {
    ToyFetcher.patchToy(toyId, updatedToy as Partial<ToyInterface>)
      .then(() => {
        onToyUpdate({ ...updatedToy, id: toyId } as ToyInterface);
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du jouet :', error);
      });
  };

  return (
    <div>
      <h2>Modifier le jouet</h2>
      <form>
        <label>
          Label:
          <input type="text" name="label" value={updatedToy.label} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Prix:
          <input type="number" name="price" value={updatedToy.price} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Année:
          <input type="text" name="year" value={updatedToy.year} onChange={handleInputChange} />
        </label>
        <br />
        <button type="button" onClick={handleUpdateToy}>
          Modifier
        </button>
      </form>
    </div>
  );
};

export default ToyUpdateForm;