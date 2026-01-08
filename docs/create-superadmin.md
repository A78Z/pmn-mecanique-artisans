# Création du Compte Super Admin - Back4App

Ce document explique comment créer le compte Super Administrateur dans Back4App.

## Informations du Compte

- **Email**: `syllaharouna740@gmail.com`
- **Mot de passe**: `Admin@2025`
- **Rôle**: `superAdmin`

---

## Méthode 1: Via le Dashboard Back4App (Recommandée)

### Étapes:

1. **Connectez-vous** à [Back4App Dashboard](https://www.back4app.com/)

2. **Sélectionnez** votre application

3. **Naviguez** vers **Database** > **_User** (ou User)

4. **Cliquez** sur **Add Row** ou **+ Add a row**

5. **Remplissez** les champs:
   - `username`: `syllaharouna740@gmail.com`
   - `email`: `syllaharouna740@gmail.com`
   - `password`: `Admin@2025`
   - ⚠️ **Créez une nouvelle colonne** `role` de type **String**
   - `role`: `superAdmin`

6. **Sauvegardez** l'entrée

> ⚠️ **Important**: Le mot de passe sera automatiquement hashé par Parse. Ne jamais stocker de mots de passe en clair.

---

## Méthode 2: Via Cloud Code (Alternative)

Si vous préférez utiliser Cloud Code, ajoutez cette fonction dans **Cloud Code** > **main.js**:

```javascript
Parse.Cloud.define("createSuperAdmin", async (request) => {
    // Vérification basique (à améliorer en production)
    const user = new Parse.User();
    
    user.set("username", "syllaharouna740@gmail.com");
    user.set("email", "syllaharouna740@gmail.com");
    user.set("password", "Admin@2025");
    user.set("role", "superAdmin");
    
    try {
        await user.signUp(null, { useMasterKey: true });
        return { success: true, message: "Super Admin créé avec succès" };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
```

Puis appelez la fonction via l'API REST ou le Dashboard.

---

## Vérification

Après création, vérifiez que:

1. L'utilisateur existe dans la table `_User`
2. Le champ `role` contient exactement `superAdmin`
3. L'email est vérifié (optionnel selon config)

---

## Test de Connexion

1. Accédez à `/admin-mecanique/login`
2. Entrez les identifiants
3. Vérifiez l'accès au dashboard

---

## Sécurité

- ⚠️ Changez le mot de passe après la première connexion
- Activez les ACLs appropriées sur la classe `_User`
- Considérez l'activation de la vérification email
