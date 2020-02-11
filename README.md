# CharaNav
---
## SQLite3.js resources:
- [SQLite3 npm](https://www.npmjs.com/package/sqlite3)
- [Query value via Callback](https://stackoverflow.com/questions/39639056/sqlite3-nodejs-get-value-from-table)
- [SQLite3 Query Cheet Sheet](https://d17h27t6h515a5.cloudfront.net/topher/2016/September/57ed880e_sql-sqlite-commands-cheat-sheet/sql-sqlite-commands-cheat-sheet.pdf)
- [SQLite3 Data Types](https://www.sqlite.org/datatype3.html)
- [SQLite3 Foreign Key Documentation](https://www.sqlite.org/foreignkeys.html)
- [nodeJS SQLite3 Query Reference](https://www.sqlitetutorial.net/sqlite-nodejs/query/)
---
- When making a model with a foreign key, the foreign key points to a LOCAL field, and references a foreign table that holds that value: 
``` javascript
{
    tableName: 'character',
    name: { foreignKey: false, string: 'TEXT NOT NULL' },
    comp: { foreignKey: false, string: 'TEXT NOT NULL' }, // <-- Local field
    compkey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' } // <-- Foreign table
}
```
- Data fetch methods should return as a promise, as they are ALWAYS asynchronous!
``` javascript
function InsertChar(comps) {
    return new Promise((resolve, reject) => { // Declares and returns new promise
        db.serialize(() => { // SQLite3 serialize, keeps queries in order
            db.all(`SELECT _id as id, name FROM character`, (err, chars) => { // SQL Query
                console.log(chars);
                resolve(chars); // Data returns with the promise via .then() :)
            });
        });
    });
}
```
- Fetch data asynchronously with promises, keep daisy chaining promise methods until you get your target data, then finally close the database:
``` javascript
function CreateModelsAndCharacters() {
    CheckOrCreateModels().then(comp => {
        InsertChar(comp).then(char => {
            console.log(char);
            db.close(); // <-- AT THE END OF THE PROMISE CHAIN IS WHERE YOU FINALLY CLOSE THE DB!!!
        })
    });
}
```
---