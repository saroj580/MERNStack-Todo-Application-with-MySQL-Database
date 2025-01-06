import express from 'express';
const app = express();
const port = 5000;
import cors from 'cors';
import mysql from 'mysql2';


app.use(express.json());
app.use(cors());  //cross origin resource sharing, it is used to share the resources between different domains i.e from frontend to backend and vice versa

//Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#SJB@098saroj',
    database: 'sys'
});
db.connect((err) => {
    if (err) {
        console.log('Failed to connect the database',err);
    } else {
        console.log('MySQL connected');
    }
});


//routing
app.post('/new-task', (req, res) => { 
    console.log(req.body); //req.body is used to get the data from the frontend
    const queries = `INSERT INTO todos (task, createdAt, status) VALUES (?, ?, ?)`;
    db.query(queries, [req.body.task, new Date(), 'active'], (err, result) => { 
        if (err) {
            console.log('Failed to add task', err);
        } else {
            console.log('Task added successfully');
            // res.send(result);
            const updatedTaks = `SELECT * FROM todos`;
            db.query(updatedTaks, (error, newList) => {
                res.send(newList);
            })
        }
    })
})

app.post('/update-task', (req, res) => { 
    console.log(req.body);
    const q = 'update todos set task = ? where id = ?';
    db.query(q, [req.body.task, req.body.updateId], (err, result) => {
        if (err) {
            console.log('Failed to update task', err);
        } else {
            console.log('Task updated successfully');
            const updatedTaks = `SELECT * FROM todos`;
            db.query(updatedTaks, (error, newList) => {
                if (error) {
                    console.log('Failed to update task', error);
                } else {
                    res.send(newList);
                }
            })
        }
    })
    
})

app.post('/delete-task', (req, res) => { 
    const q = 'delete from todos where id = ?';
    db.query(q, [req.body.id], (err, result) => {
        if (err) {
            console.log('Failed to delete task', err);
        } else {
            console.log('Task deleted successfully');
            const deletedTask = `SELECT * FROM todos`;
            db.query(deletedTask, (error, newList) => {
                if (error) {
                    console.log('Failed to delete task', error);
                } else {
                    res.send(newList);
                }
            }) 
        }
    })
})

app.post('/complete-task', (req, res) => { 
    const q = 'update todos set status = ? where id = ?';
    db.query(q, ['completed', req.body.id], (err, result) => {
        if (err) {
            console.log('Failed to complete task', err);
        } else {
            console.log('Task completed successfully');
            const completedTask = `SELECT * FROM todos`;
            db.query(completedTask, (error, newList) => {
                if (error) {
                    console.log('Failed to complete task', error);
                } else {
                    res.send(newList);
                }
            })
        }
    })
})

app.get('/read-task', (req, res) => {
    const queries = `SELECT * FROM todos`;
    db.query(queries, (err, result) => {
        if (err) {
            console.log("failed to read task", err);            
        } else {
            console.log('Task read successfully');
            // console.log(res.send(result));
            res.send(result);
        }
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})