const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const config = require('./env');

var defaultApp = admin.initializeApp(config);
const app = express();

app.get('/show', ( req , res )=>{
    admin.database().ref('/').once('value',snap => {
        res.send(snap.val());
        res.status(200).json({message: '抓到資料'});
    })
} );

app.post('/create', ( req , res )=>{
    admin.database().ref('/').push({
        name : req.body.name,
        done : req.body.done,
        collected : req.body.collected,
        time : req.body.time,
        date : req.body.date,
        file : req.body.file,
        comment : req.body.comment
    }).then(()=>{
        res.status(201).json({message: '資料新增'});
    });
} );

app.put('/modify', ( req , res )=>{
    let key = req.body.key;
    let updateData = {}
    for (const key in req.body) {
        let reqProp = req.body[key];
        updateData[key] = reqProp;
    }
    admin.database().ref('/').child(key).update(updateData).then(()=>{
        res.status(200).json({message: '資料修改'});
    });
} );

app.delete('/delete', ( req , res )=>{
    let id = req.body.id;
    admin.database().ref('/').child(id).remove().then(()=>{
        res.status(200).json({message: '資料刪除'});
    });
} );




exports.app = functions.https.onRequest(app);


//for test

// const public = (folder) => {
//     return path.resolve(__dirname , `../public/${folder}`)
// }

// app.get('/',(req,res)=>{
//     res.sendFile(public('index.html'));
// });
// app.use('/dist',express.static(public('dist')));

// app.listen(3000,()=>{
//     console.log('3000');
// })
