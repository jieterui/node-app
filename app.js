var express = require('express');
var app = express();
var mysql = require('mysql');
var md5 = require('md5');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
    port: '3306',
});
app.get('/', function (req, res) {
    res.sendfile(__dirname + "/" + "index.html");
});
//实现登录验证功能
app.get('/login', (req, res) => {
    const { name, pwd } = req.query;
    console.log(name, pwd);
    // 从数据库中检索与提供的用户名匹配的用户信息
    connection.query('SELECT * FROM information WHERE useName = ?', [name], (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        else{
            console.log('ok');
        }

        if (results.length === 0) {
            // 用户不存在
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        else {
            console.log('oks')
        }
        const user = results[0];
        console.log('jiw',user)
        // 比较提供的密码与数据库中存储的加密密码是否匹配
        const hashedPassword = md5(pwd);
     //   console.log('haxipa',hashedPassword)
        if (hashedPassword === user.password) {
            // 登录成功
            console.log('登录成功')
            res.status(200).json({ message: 'Login successful' });
        } else {
            // 密码错误
            res.status(401).json({ error: 'Unauthorized' });
        }
    });
});
app.get('/Register.html', function (req, res) {
    res.sendfile(__dirname + "/" + "Register.html");
});
//实现注册功能
app.get('/Register', function (req, res) {
    var name = req.query.name;
    var pwd = md5(req.query.pwd);
    console.log('name', name);
    var user = { useName: name, password: pwd };
    connection.query('insert into information set ?', user, function (err, rs) {
        if (err) throw err;
        console.log('ok');
         res.sendfile(__dirname + "/" + "index.html");
    })
})
var server = app.listen(7744, function () {
    console.log('server is running at http://localhost:7744');
})
