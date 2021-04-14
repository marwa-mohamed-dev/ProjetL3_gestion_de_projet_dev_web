const users = [ 
    {id: '1', identifiant: "winkler", mdp: "astrid", role: "all"},
    {id: '2', identifiant: "lee", mdp: "jiou", role: "all"}, 
    {id: '3', identifiant: "weber", mdp: "louise", role: "all"}, 
    {id: '4', identifiant: "gomes", mdp: "lucie", role: "all"}, 
    {id: '5', identifiant: "mohamed", mdp: "marwa", role: "all"},
    
    // Amdministrateur référentiel : Administration du référentiel
    {id: '6', identifiant: "admin", mdp: "admin", role: "admin"},
    // Gestionnaire administratif : Anomalies et envoie de courrier
    {id: '7', identifiant: "gest", mdp: "gest", role: "gest"},
    // Assistant de saisie : Saisie des commandes
    {id: '8', identifiant: "saisie", mdp: "saisie", role: "saisie"},
    // Département de prospection : Prospection
    {id: '9', identifiant: "prosp", mdp: "prosp", role: "prosp"},
    // Directeur de la stratégie : valide cible de routage
    {id: '10', identifiant: "strat", mdp: "strat", role: "strat"},
    // Responsable de routage : lance envoi des publicités
    {id: '11', identifiant: "pub", mdp: "pub", role: "pub"},

    // Directeur de l'entreprise
    {id: '12', identifiant: "global", mdp: "global", role: "all"}
]

module.exports = {
    users
}