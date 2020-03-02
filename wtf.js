function DeleteCharactersByCompId(compId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            GetCharactersByCompId(compId).then((chars) => {

                // My brain melts rght here
                Promise.all(chars.map(char => {
                    Promise.all([
                        DeleteLayersByCharId(char.id),
                        DeleteCharArtsByCharId(char.id)
                    ]);
                })).then(() => {
                    let stmt = db.prepare(`DELETE FROM character WHERE _id = $id`);
                    stmt.all({ $id: compId }, (err) => {
                        if (err) reject(err);
                        resolve(`Deleted characters from comp: [${compId}]`);
                    });
                    stmt.finalize();
                });
            });
        });
    });
}

function DeleteCharacterById(charId) {
    return new Promise((resolve, reject) => {
        Promise.all([
            DeleteLayersByCharId(charId),
            DeleteCharArtsByCharId(charId)
        ]).then(() => {
            let stmt = db.prepare(`DELETE FROM character WHERE _id = $id`);
            stmt.all({ $id: charId }, (err) => {
                if (err) reject(err);
                resolve(`Deleted character: [${charId}]`);
            });
            stmt.finalize();
        });

    });
}

function DeleteLayersByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare(`DELETE FROM layer WHERE character = $id`);
            stmt.all({ $id: charId }, (err) => {
                if (err) reject(err);
                resolve(`Deleted layers of character: [${charId}]`);
            });
            stmt.finalize();
        });
    });
}

function DeleteCharArtsByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare(`DELETE FROM character_article WHERE character = $id`);
            stmt.all({ $id: charId }, (err) => {
                if (err) reject(err);
                resolve(`Deleted charArts of character: [${charId}]`);
            });
            stmt.finalize();
        });
    });
}