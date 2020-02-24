function DeleteCharactersByCompId(compId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            GetCharactersByCompId(compId).then((chars) => {

                // My brain melts right here 
                Promise.all(chars.map(char => {
                    Promise.all([
                        DeleteLayersByCharId(char.id),
                        DeleteCharArtsByCharId(char.id)
                    ]);
                })).then(() => {
                    let sql = `DELETE FROM character WHERE comp = '${compId}'`;
                    db.all(sql, (err) => {
                        if (err) reject(err);
                        resolve(`Deleted characters from comp: [${compId}]`);
                    });
                });
            });
        });
    });
}

function DeleteLayersByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM layer WHERE character = '${charId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted layers of character: [${charId}]`);
            });
        });
    });
}

function DeleteCharArtsByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM character_article WHERE character = '${charId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted charArts of character: [${charId}]`);
            });
        });
    });
}