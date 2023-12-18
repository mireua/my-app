import { cookies } from 'next/headers'


export async function GET(req, res) {
  console.log("in the api page");

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');
  console.log(email);
  console.log(pass);

  const { MongoClient } = require('mongodb');
  const url = 'mongodb+srv://samuelmuan:T4yzGVayKT7a9Bte@cluster0.giwsfqt.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(url);
  const dbName = 'app';

  await client.connect();
  console.log('Connected successfully to the server');

  const db = client.db(dbName);
  const collection = db.collection('login');
  const findResult = await collection.find({"username":
        email}).toArray();
        console.log('Found documents =>', findResult);
        let valid = false
        const bcrypt = require('bcrypt');
        let hashResult = bcrypt.compareSync(pass, findResult[0].pass); // true
        console.log("checking " + findResult[0].pass);
        console.log("Hash Comparison Result " + hashResult);

        if(findResult.length >0 && hashResult == true){
            valid = true;
            console.log("login valid")
            // save a little cookie to say we are authenticated
            console.log("Saving username and auth status")
            cookies().set('auth', true);
            cookies().set('username',email)
            } else {
            valid = false;
            console.log("login invalid")
            }
            return Response.json({ "data":"" + valid + ""})
            }
            