module.exports = {
    server: {
        project: "@TarsusNginxProject/NodeHttpServer -l node -t @tarsus/http -h 127.0.0.1 -p 17011",
        servant: [
            "@TarsusDemoProject/NodeServer -l node -t @tarsus/ms -h 127.0.0.1 -p 17021",
            // '@TarsusNginxProject/JavaServer -l java -t @tarsus/ms -h 127.0.0.1 -p 12013 -w 10'
        ],
        database: {
            default: true,
            type: "mysql2",
            host: "127.0.0.1",
            username: "root",
            password: "123456",
            database: "tarsus_nginx_test", //所用数据库
            port: 3306,
            connectionLimit: 10,
        },
    },
};
