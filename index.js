const dotenv = require("dotenv")
dotenv.config()

// configs
const BASE_FILE_ID = '1fveIbEjAxoESW8wK00-2tAaB9XuYqo9q2YqCnUt4bTY'
const OUTPUT_FOLDER_ID = '1kUp1FgOnwVe-FrXqDvhbft812ltfm864'

// initializing google's sdk - this expects there to be a GOOGLE_APPLICATION_CREDENTIALS env var pointing to a config file
const { google } = require('googleapis')

// initializing with required scopes
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata'
  ]
});

// initialize clients
console.log('initializing drive & docs clients')
const drive = google.drive({ version: 'v3', auth })
const docs = google.docs({ version: 'v1', auth })

async function copy() {
  // grab template file and make a copy
  console.log('creating a copy of the base file')
  const newFile = await drive.files.copy({
    fileId: BASE_FILE_ID,
    fields: ['id'],
    requestBody: {
      name: "PDF Export - " + Date.now(),
      parents: [OUTPUT_FOLDER_ID]
    }
  })
  return newFile.data
}

async function insertImages(documentId) {
  
  // this is not replacements per se, but rather insertions. the replacements API is pretty similar though
  var reqs = [{
    insertInlineImage: {
      location: { index: 23 },
      uri: "https://cdn.dribbble.com/users/2612518/screenshots/14214624/media/fe923054e908490bdea953e6d55a6655.png"
    }
  },
  {
    insertInlineImage: {
      location: { index: 49 },
      uri: "https://cdn.dribbble.com/users/700165/screenshots/14484139/media/6898d6bc693d7d0abc9887234b6b2000.png?resize=1600x1200&vertical=center"
    }
  },
  {
    insertInlineImage: {
      location: { index: 62 },
      uri: "https://cdn.dribbble.com/users/22878/screenshots/14802010/media/220f574deacb04955b65d9f53ba1c170.png?resize=1200x900&vertical=center"
    }
  }]
  
  await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: reqs
    }
  })
}

async function share(fileId, userEmail) {
  console.log('sharing file publicly')
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      type: "anyone",
      role: "reader"
    }
  })
  if (userEmail) {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        type: "user",
        emailAddress: userEmail,
        role: "writer"
      }
    })
  }
}
async function exportPDF(fileId) {

  var aa = await drive.files.export({ fileId: fileId, mimeType: "application/pdf" });
  //console.log (aa)
}

async function uploadBasic(cuerpo) {


  const requestBody = {
    name: 'photo.pdf',
    fields: 'id',
  };
  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream('files/photo.jpg'),
  };
  try {
    const file = await service.files.create({
      cuerpo,
      media: media,
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

async function main() {
  console.log('--> Copying the template');
  const { id } = await copy();
  console.log('--> Performing replacements');
  await insertImages(id);
  console.log('--> Setting document\' permissions to public');
  await share(id)
  //const expo = await exportPDF(id)
  console.log(`--> Success! Download the PDF here: https://docs.google.com/document/d/${id}/export?format=pdf`)
}

main();