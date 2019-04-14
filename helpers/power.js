module.exports = {
    isAdmin: (user) => {
        return (user && user.power > 1)
    },
    isOwner: (user, postId) => {
        let command = `SELECT user_id FROM posts WHERE id = ?`
        let params = [postId]
        
        pool.getConnection((error, connection) => {
            if(error) throw error

            connection.query(command, params, (error, rows) => {
                if(error) throw error
                
                connection.release()
                const post = rows[0]
                
                // Check existence
                if(post === undefined && !user) {
                    return false
                }

                // Check ownership
                return (user.id === post.user_id)
            })
        })
    }
}