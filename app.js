const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app.use(express.json());
const dbpath = path.json(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () =>{
    try{
        db = await open({
            filename:dbpath,
            driver:sqlite3.Database,
        });
        app.listen(3000,() =>{
            console.log("Server Running at http://localhost:3000/");
        });
    }catch(e){
        console.log(`DB Error:${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();

//Get list of Players

const convertDbobjectToResponseObject = (dbobject) =>{
    return {
        playerId : dbObject.player_id,
        playerName: dbObject.player_name,
        jerseyNumber: dbObject.jersey_number,
        role: dbObject.role,
    };
};
app.get("/players/", async (request,response)=>{
    const getplayersQuery=`SELECT * FROM cricket_team;`;
    const playersArray = await db.all(getplayersQuery);
    response.send(
        playersArray.map((eachPlayer)=>
        converDbObjectToResponseObject (eachPlayer))
    );
    
});

//Creat a New Player 

app.post("/players/",async (request, response)=>{
    const playerDetails = request.body;
    const {playerName, jerseyNumber, role}= playerDetails;
    const addPlayerQuery=`INSERT INTO cricket_team (player_name,jersey_number,role)
        VALUES
        (
            '${playerName}',
            '${jerseyNumber}',
            '${role}'

        );`;
    const dbResponse = await db.run(addPlayerQuery);
    const playerId = dbResponse.lastID;
    response.send("Player Add to Team");    
});

// Update Palyer 
app.put("/players/:playerId/", async (request, response)=>{
    const {playerId}=request.params;
    const playerDetails = request.body;
    const {playerName, jerseyNumber, role} = playerDetails;
    const UpdatePlayerQuery =`
    UPDATE cricket_team
    SET
        player_name = '${playerName}',
        jersey_number = '${jerseyNumber}',
        role = '${role}'
        WHERE player_id = ${playerId}`;
        await db.run(UpdatePlayerQuery);
        response.send("Player Details Updated");
});
//Delete Player

app.delete(" /players/:playerId/", async (request, response)=>{
    const {playerId} = request.params;
    const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");  
});
module.exports = app;
