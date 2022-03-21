const { query } = require('express');
const express = require('express');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;

const fs = require('fs');


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if(query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    };

    return filteredResults;
}


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});


app.get('/api/notes', (req, res) => {
   
    fs.readFile(path.join(__dirname,'/db/db.json'), (err, data) => {
        if(err) {
            res.status(500);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
  
    let id = Math.floor(Math.random() * 10000);
    let note  = req.body;
    note.id = id;

    fs.readFile(path.join(__dirname,'/db/db.json'), (err, data) => {
        if(err){
            res.status(500);
        }
        let savedNotes = JSON.parse(data);
        savedNotes.push(note);

        fs.writeFile(path.join(__dirname,'/db/db.json'), JSON.stringify(savedNotes), (err) => {
            if(err) {
                res.status(500);
            }
            
            res.json(note);
        })
    });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});
