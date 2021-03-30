const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByIdentifiant, getUserById) {
    const authenticateUser = async (identifiant, mdp, done) => {
        const user = getUserByIdentifiant(identifiant)
        if (user == null){
            return done(null, false, { message : "Pas d'utilisateur avec cet identifiant"})
        }

        try {
            if (await mdp === user.mdp){
                return done(null, user)
            } else {
                return done(null, false, { message : 'Mot de passe incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'identifiant', passwordField: 'mdp'},
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
};

module.exports = initialize
