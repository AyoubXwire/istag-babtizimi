const express  = require('express')
const router   = express.Router()

const pool = require('../config/pool')
const { isAdmin } = require('../helpers/power')

router.get('/', isAdmin, (req, res) => {
    let command = `SELECT COUNT(id) AS numPosts FROM posts;
    SELECT COUNT(id) AS numUsers FROM users WHERE power = ?;
    SELECT COUNT(id) AS numAdmins FROM users WHERE power > ?;
    SELECT COUNT(id) AS numPendingPosts FROM posts WHERE pending = true;`
    let params = [1, 1]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let numPosts = rows[0][0].numPosts
            let numUsers = rows[1][0].numUsers
            let numAdmins = rows[2][0].numAdmins
            let numPendingPosts = rows[3][0].numPendingPosts

            res.render('administration', { numPosts, numUsers, numAdmins, numPendingPosts })
            connection.release()
        })
    })
})

module.exports = router