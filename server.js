const express = require('express');
const { dirname } = require('path');
const {static} = express;
const path = require('path');
const { user } = require('pg/lib/defaults');

const app = express();

app.use('/dist', static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/users', async(req, res, next) => {
    try {
        res.send(await User.findAll());
    }
    catch(e){
        next(e)
    }
});

const init = async() => {
    try{
        await syncAndSeed();
    }
    catch(e){
        next(e)
    }
};

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/db');

const User = sequelize.define('user', {
    name: Sequelize.STRING
});
const syncAndSeed = async() => {
    await sequelize.sync({force:true});
    await Promise.all([
        User.create({name: 'moe' }),
        User.create({name: 'lucy' }),
        User.create({name: 'curly' }),
    ])
};

init();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

