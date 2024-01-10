
import ToyInterface from "../interfaces/ToyInterface";
export default class ToyFetcher {
  static url: string = "http://localhost:3000/toys";

  static loadToys(): Promise<ToyInterface[]> {
    return fetch(this.url)
      .then((response) => {
        if (response.status === 200) return response.json();
        else
          throw new Error(
            "Le serveur n'a pas répondu correctement. Statut de l'erreur : " +
              response.status
          );
      })
      .then((toys) => {
        console.log(`toys : `, toys);
        return toys;
      })
      .catch((error) => {
        console.error("Erreur attrapée dans loadToys " + error);
      });
  }
  /**
   * Permet de modifier un jouet
   * @param {number} toyId
   * @param {object} propertieToPatch
   */
  static patchToy(
    toyId: number,
    propertieToPatch: Partial<ToyInterface>
  ): Promise<void> {
    return fetch(`${this.url}/${toyId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      //body: JSON.stringify({ "title": "Simon", "author": "Yvan" })
      body: JSON.stringify(propertieToPatch),
    }).then(function (res) {
      if (res.status === 200) {
        console.log(`La modification s'est bien passée`);
      } else throw new Error("Problème serveur lors du patch. Statut : " + res.status);
    });
  }
  /**
   * Permet de supprimer une tâche
   * @param {number} toyId
   */
  static deleteToy(toyId: number): Promise<void> {
    return fetch(`${this.url}/${toyId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    }).then(function (res) {
      if (res.status === 200) console.log(`La suppression s'est bien passée`);
      else
        throw new Error(
          "Problème serveur lors du delete. Statut : " + res.status
        );
    });
  }
  /**
   * Permet d'ajouter une tâche
   * @param {object} toy
   */
  static addToy(toy: Omit<ToyInterface, "id">): Promise<void> {
    return fetch(`${this.url}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      //body: JSON.stringify({ "title": "Simon", "author": "Yvan" })
      body: JSON.stringify(toy),
    }).then(function (res) {
      if (res.status === 201) console.log(`L'ajout s'est bien passé`);
      else
        throw new Error(
          "Problème serveur lors du post. Statut : " + res.status
        );
    });
  }
}
