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
  // trier par année ou prix
  const [sortMode, setSortMode] = useState<'default' | 'year' | 'price'>('default');
  //changer l'ordre des jouets < et/ou >
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  //ajouter des jouet au panier
  const [cart, setCart] = useState<ToyInterface[]>([]);
  //calcul du total des prix des jouets
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    Promise.all([ToyFetcher.loadToys(), fetch('http://localhost:3000/panier')])
    .then(([loadedToys, cartResponse]) => {
      const sortedToys = loadedToys.sort((a, b) => a.label.localeCompare(b.label));
      setToys(sortedToys || []);

      return cartResponse.json();
    })
    .then((cartData) => {
      console.log('Données du panier reçues du serveur :', cartData);
      setCart(cartData);
      setTotal(calculateTotal(cartData));
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des jouets ou du panier :', error);
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
    ToyFetcher.deleteToy(toyId)
      .then(() => {
        setToys((prevToys) => prevToys.filter((toy) => toy.id !== toyId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du jouet :", error);
      });
  };

  const handleToyAdd = (newToy: ToyInterface): void => {
    ToyFetcher.addToy(newToy as Omit<ToyInterface, 'id'>)
      .then(() => {
        setToys((prevToys) => [...prevToys, newToy]);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du jouet :", error);
      });
  };

  const handleSortChange = (mode: 'default' | 'year' | 'price') => {
    setSortMode(mode);
  };

  const handleSortDirectionChange = () => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  //Tentative de sauver le panier sur le server Json
  const saveCartToServer = (cartData: any, total: number): void => {
    ToyFetcher.saveCartToServer(cartData, total).subscribe(
      () => {
        console.log('Le panier est sauvegardé dans le fichier Json');
      },
      (error) => {
        console.error('Erreur de sauvegarde:', error);
      }
    );
  };


  //ajout au panier
  const handleAddToCart = (toy: ToyInterface): void => {
    const updatedCart = [...cart, { ...toy }];
    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    saveCartToServer(updatedCart, calculateTotal(updatedCart));
  };
  
  //supp du panier
  const handleRemoveFromCart = (toyId: number): void => {
    const updatedCart = cart.filter((toy) => toy.id !== toyId);
    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    saveCartToServer(updatedCart, calculateTotal(updatedCart));
  };
  
  
  //calcul du total du panier
  const calculateTotal = (cartItems: ToyInterface[]): number => {
    //parseFloat converti string en un nombre avant de l'additionner
    return cartItems.reduce((total, toy) => total + parseFloat(String(toy.price)), 0);
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
        <button onClick={() => handleSortChange('default')} className="triList">Tri par ordre alphabétique</button>
        <button onClick={() => handleSortChange('year')} className="triList">Tri par année</button>
        <button onClick={() => handleSortChange('price')} className="triList">Tri par prix</button>
        <button onClick={() => handleSortDirectionChange()} className="triList">Direction tri : Asc/Desc</button>
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
              onAddToCart={(toy) => handleAddToCart(toy)} 
            />
          )}
        </div>
      ))}
      <div className="cart">
        <h2>Panier</h2>
        <ul>
          {cart.map((cartItem) => (
            <li key={cartItem.id}>
              {cartItem.label} - {cartItem.price}€
              <button onClick={() => handleRemoveFromCart(cartItem.id)} className="addRemove">Retirer du panier</button>
            </li>
          ))}
        </ul>
        <p>Total du panier: {calculateTotal(cart)}€</p>
      </div>
    </div>
  );
}

export default App;

