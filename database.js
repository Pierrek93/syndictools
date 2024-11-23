console.log('Database.js is succesfully loaded')


let database = {
    buildings: [
        { id: 1, name: 'Ech20', Bce: '123.134.567', adress:'Av Ech 20' },
        { id: 2, name: 'Ech30', Bce: '123.134.568', adress:'Av Ech 30' }
    ]
};

function getBuildings() {
    return database.buildings;
}

module.exports = { getBuildings};
