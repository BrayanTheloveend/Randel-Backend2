const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
require('dotenv').config()


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const KEYFILEPATH = path.join(process.cwd(), '/Middleware/CREDENTIALS.json');


const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const uploadFile = (fileObject, folderId) => {
    return new Promise(async (resolve, rejected)=>{
        google.drive({ version: "v3", auth }).files.create({
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(fileObject.path),
            },
            requestBody: {
                name: `${fileObject.originalname}_${Date.now()}`,
                parents: [folderId],
            },
            fields: "id,name",
        }, (err, file)=>{
            if(err){
                rejected(err)
            }else{
                resolve(file)
            }
        })
    })
    
}


const getUrlFile =(filename, folderId)=>{
    const id = filename.splice('_id').pop()
    return new Promise((resolve, rejected)=>{
        google.drive({ version: "v3", auth }).files.copy({
            fileId: id,
            requestBody: {
                parents: [folderId],
            },
        },(err, copiedFile)=>{
            if(err){
                rejected(err)
            }else{
                resolve(copiedFile)
                console.log(copiedFile.data.id)
            }
        })
    })
}

module.exports = { uploadFile } 


