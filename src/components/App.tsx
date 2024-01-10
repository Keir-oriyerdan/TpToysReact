import React, { useEffect, useState } from 'react';
import ToyFetcher from '../services/ToyFetcher';
import ToyInterface from '../interfaces/ToyInterface';
import Toy from './Toy';
import ToyForm from './ToyForm';
import ToyUpdateForm from './ToyUpdateForm';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';



function App() {
  const [toys, setToys] = useState<ToyInterface[]>([]);
  const [selectedToyId, setSelectedToyId] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<'default' | 'year' | 'price'>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    ToyFetcher.loadToys()
      .then((loadedToys: ToyInterface[]) => {
        const sortedToys = loadedToys.sort((a, b) => a.label.localeCompare(b.label));
        setToys(sortedToys || []);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des jouets:', error);
        setToys([]);
      });
  }, []);

  const handleToyUpdate = (updatedToy: ToyInterface): void => {
    setToys((prevToys) => {
      const updatedToys = prevToys.map((toy) =>
        toy.id === updatedToy.id ? { ...toy, ...updatedToy } : toy
      );
      return updatedToys.sort((a, b) => a.label.localeCompare(b.label));
    });
    setSelectedToyId(null);
  };

  const handleClickDelete = (toyId: number): void => {
    const updatedToys = toys.filter((toy) => toy.id !== toyId);
    setToys([...updatedToys]);
  };

  const handleToyAdd = (newToy: ToyInterface): void => {
    setToys((prevToys) => {
      const updatedToys = [...prevToys, newToy];
      return updatedToys.sort((a, b) => a.label.localeCompare(b.label));
    });
  };

  const handleSortChange = (mode: 'default' | 'year' | 'price') => {
    setSortMode(mode);
  };

  const handleSortDirectionChange = () => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const sortedToys = [...toys].sort((a: ToyInterface, b: ToyInterface) => {
    if (sortMode === 'default') {
      return a.label.localeCompare(b.label);
    } else if (sortMode === 'year') {
      return sortDirection === 'asc' ? a.year.localeCompare(b.year) : b.year.localeCompare(a.year);
    } else if (sortMode === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="App container">
      <h1>Liste des DigiToys</h1>
      <div>
      <h3>Trier par:</h3>
        <button onClick={() => handleSortChange('default')}>Tri par ordre alphabétique</button>
        <button onClick={() => handleSortChange('year')}>Tri par année</button>
        <button onClick={() => handleSortChange('price')}>Tri par prix</button>
        <button onClick={() => handleSortDirectionChange()}>Direction tri : Asc/Desc</button>
      </div>
      <ToyForm onToyAdd={handleToyAdd} />
      {sortedToys.map((toy: ToyInterface) => (
        <div key={toy.label}>
          {selectedToyId === toy.id ? (
            <ToyUpdateForm toyId={toy.id} onToyUpdate={handleToyUpdate} />
          ) : (
            <Toy
              toy={toy}
              onClickDelete={handleClickDelete}
              onClickUpdate={() => setSelectedToyId(toy.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
