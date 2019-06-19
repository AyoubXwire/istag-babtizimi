if(process.env.NODE_ENV === 'production') {
    module.exports = {
        dbUser: 'root',
        dbPassword: 'password',
        dbName: 'babtizimi'
    }
} else if((process.env.NODE_ENV === 'development')) {
    module.exports = {
        dbUser: 'root',
        dbPassowrd: 'xwire',
        dbName: 'babtizimi'
    }
}