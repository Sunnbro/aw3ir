/*
store.js
Script pour gérer la liste de contact en JSON

Pour ajouter un contact:  contactStore.add(_name, _firsname, _date, _adress, _mail);
Pour récupérer la liste:  contactStore.getList();
Pour remettre à zéro:     contactStore.reset();
*/

var contactStore = (function () {
  // Récupération de la liste depuis le localStorage
  let contactListString = localStorage.getItem("contactList");
  var contactList = contactListString ? JSON.parse(contactListString) : [];

  return {
    add: function (_name, _firsname, _date, _adress, _mail) {
      var contact = {
        name: _name,
        firstname: _firsname,
        date: _date,
        adress: _adress,
        mail: _mail,
      };
      contactList.push(contact);
      localStorage.setItem("contactList", JSON.stringify(contactList));
      return contactList;
    },

    reset: function () {
      localStorage.removeItem("contactList");
      contactList = [];
      return contactList;
    },

    getList: function () {
      return contactList;
    },
  };
})();
