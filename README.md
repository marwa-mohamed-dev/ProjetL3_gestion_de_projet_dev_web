# Utilisation de l'application

## Hébergement en ligne
Vous pouvez essayer directement l'application disponible en ligne sur le site d'hébergement Scalingo en cliquant sur le lien suivant : 
https://fenouildecoperso.osc-fr1.scalingo.io/.


## Connexion à l'application
Pour se connecter à l'application il faut avoir un identifiant et un mot de passe.
Voici la liste des couples identifiants/mots de passe qui modélisent les différents rôles au sein de l'entreprise :


- Amdministrateur référentiel : Administration du référentiel
{identifiant: "admin", mdp: "admin"}
- Gestionnaire administratif : Anomalies et envoie de courrier
{identifiant: "gest", mdp: "gest"}
- Assistant de saisie : Saisie des commandes
{identifiant: "saisie", mdp: "saisie"}
- Département de prospection : Prospection
{identifiant: "prosp", mdp: "prosp"}
- Directeur de la stratégie : valide cible de routage
{identifiant: "strat", mdp: "strat"}
- Responsable de routage : lance envoi des publicités
{identifiant: "pub", mdp: "pub"}
- Directeur de l'entreprise (accès à tous les modules, intégralité de l'application)
{identifiant: "global", mdp: "global"}


# Téléchargement du projet
## Module à installer
- Posséder NodeJS
- Avoir installé un environnement de développement (ex: Visual Studio Code)
- Ouvrir app.ejs
- Taper dans le terminal à la suite: npm init (lors du choix des options tapez Entrée) / npm install / npm install -g nodemon
 
- Taper "nodemon app" dans le terminal pour lancer l'application

## Erreur possible
".\script.ps1 : Impossible de charger le fichier C:\Users\WindowsFacile\Desktop\script.ps1, car l’exécution de scripts est désactivée sur ce système. Pour plus d’informations, consultez about_Execution_Policies à l’adresse https://go.microsoft.com/fwlink/?LinkID=135170.
Au caractère Ligne:1 : 1
+ .\script.ps1
+ ~~~~~~~~~~~~~~
+ CategoryInfo : Erreur de sécurité : (:) [], PSSecurityException
+ FullyQualifiedErrorId : UnauthorizedAccess"

Pour résoudre ce problème:
  - ouvrir le "Windows PowerShell"
  - Taper Set-ExecutionPolicy Unrestricted puis appuyer sur Entrée
  -  indiquez "O" pour Oui et appuyez sur Entrée


