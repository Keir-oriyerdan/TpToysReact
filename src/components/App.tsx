import React, { useEffect, useState } from 'react';
import ToyFetcher from '../services/ToyFetcher';
import ToyInterface from '../interfaces/ToyInterface';
import Toy from './Toy';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App() {
  const [toys, setToys] = useState<ToyInterface[]>([]);

  useEffect(() => {
    ToyFetcher.loadToys()
      .then((loadedToys: ToyInterface[]) => {
        // Tri des jouets par ordre alphabétique du label
        const sortedToys = loadedToys.sort((a, b) => a.label.localeCompare(b.label));
        setToys(sortedToys || []);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des jouets:', error);
        setToys([]);
      });
  }, []);

  function handleClickUpdate(toyId: number): void {
    console.log(`handleClickUpdate`, toyId);
    let propertyToPatch: Partial<ToyInterface> | null = null;
    const copyToys = ToyInterface[] = toy.map(toy) => {
      propertyToPatch = {
        label= toy.label,
        year: toy.year,
        price= toy.price
      }
    }
    return toy;

  }) 

  function handleClickDelete(toyId: number): void {
    const updatedToys = toys.filter((toy) => toy.id !== toyId);
    setToys([...updatedToys]);

    ToyFetcher.deleteToy(toyId)
      .catch((error) => {
        console.error("Erreur lors de la suppression du jouet : ", error);
      });
  }

  return (
    <div className="App container">
      <h1>Toy List</h1>
      <ul>
        {toys.map((toy) => (
          <li key={toy.id}>
            {toy.label} - {toy.price}€ - {toy.year}
          </li>
        ))}
      </ul>
      {[...toys].sort((a: ToyInterface, b: ToyInterface) => (Number(a.done) - Number(b.done)))
        .map((toy: ToyInterface) => (
          <Toy key={toy.id} toy={toy} onClickDelete={handleClickDelete} />
        ))}
    </div>
  );
}

export default App;

