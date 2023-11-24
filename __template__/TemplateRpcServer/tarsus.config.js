module.exports = {
    server: {
        project: "@TarsusDemoProject/NodeServer -l node -t @tarsus/ms -h 127.0.0.1 -p 17021",
        database: {
            default: true,
            type: "mysql2",
            host: "localhost",
            username: "root",
            password: "123456",
            database: "tarsus_nginx_test", //所用数据库
            port: 3306,
            connectionLimit: 10,
        },
        proxy:'http://127.0.0.1/proxy/invoke'
    },
};
