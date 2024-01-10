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

  //mettre a jour un jouet.
  const handleToyUpdate = (updatedToy: ToyInterface): void => {
    setToys((prevToys) => {
      const updatedToys = prevToys.map((toy) =>
        toy.id === updatedToy.id ? { ...toy, ...updatedToy } : toy
      );
      return updatedToys.sort((a, b) => a.label.localeCompare(b.label));
    });
    setSelectedToyId(null); // Réinitialiser l'ID du jouet sélectionné après la mise à jour
  };

  //Supprimer un jouet
  function handleClickDelete(toyId: number): void {
    const updatedToys = toys.filter((toy) => toy.id !== toyId);
    setToys([...updatedToys]);
  
    ToyFetcher.deleteToy(toyId)
      .catch((error) => {
        console.error("Erreur lors de la suppression du jouet : ", error);
      });
  }

  //ajout d'un nouveau jouet via le ToyForm
  const handleToyAdd = (newToy: ToyInterface): void => {
    //Mise a jour de l'état de toys
    setToys((prevToys) => {
      const updatedToys = [...prevToys, newToy];
      /*methode sort utilisée avec une fonction de comparaison pour 
      trier par ordre alphabétique du label.*/
      return updatedToys.sort((a, b) => a.label.localeCompare(b.label));
    });
  };


  return (
    <div className="App container">
      <h1>Toy List</h1>
      <ToyForm onToyAdd={handleToyAdd} />
      {[...toys].sort((a: ToyInterface, b: ToyInterface) => (Number(a.done) - Number(b.done)))
        .map((toy: ToyInterface) => (
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

