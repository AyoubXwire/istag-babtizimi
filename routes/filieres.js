const express  = require('express')
const router   = express.Router()

router.get('/', (req, res) => {
    let command
    let params = []
    
    if(req.query.secteur) {
        command = `SELECT id, code, nom FROM filieres WHERE id_secteur = ?`
        params = [req.query.secteur]
    } else {
        command = `SELECT id, code, nom FROM filieres`
    }

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
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

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            
            let filiere = rows[0][0]
            let modules = rows[1]
            
            res.render('filiere', { filiere, modules })
            connection.release()
        })
    })
})

module.exports = router