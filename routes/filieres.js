const express  = require('express')
const router   = express.Router()

const pool = require('../config/pool')

router.get('/', (req, res) => {
    let command
    let params = []
    
    if(req.query.secteur) {
        command = `SELECT id, code, nom FROM filieres WHERE id_secteur = ?`
        params = [req.query.secteur]
    } else {
        command = `SELECT id, code, nom FROM filieres`
    }

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let filieres = rows

            res.render('filieres', { filieres })
            connection.release()
        })
    })
})

router.get('/:id', (req, res) => {
    let command = `SELECT code, nom, description FROM filieres WHERE id = ?;
    SELECT nom FROM modules WHERE id_filiere = ?;`
    let params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let filiere = rows[0][0]
            let modules = rows[1]
            
            res.render('filiere', { filiere, modules })
            connection.release()
        })
    })
})

module.exports = router