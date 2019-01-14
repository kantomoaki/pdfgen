require('@google-cloud/debug-agent');
const Storage     = require('@google-cloud/storage');
const fs          = require('fs');
const request     = require('request');
const PdfPrinter  = require('pdfmake/src/printer');
const uuidv4      = require('uuid/v4');
const Google      = require('googleapis');
const BUCKET      = 'pdfgen-01-01'; // bucket-name

/*------------------------------------------------------
  1. アクセストークンをチェックする。
  2. PDFを生成する。
  3. PDFをbuketに保存する。
--------------------------------------------------------*/

// アクセストークンの抽出
function getAccessToken(header) {
  if (header) {
    var match = header.match(/^Bearer\s+([^\s]+)$/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// pdfの生成
function createPDF() {
  console.log('01');

  // Return a new promise.
  return new Promise(function(resolve, reject) {
    console.log('02-1');
    var pdfCreation = false;
    console.log('02-2');
    var foamatObj = require('./formats/form1.json');
    console.log('02-3');
//    var foamatObj = JSON.parse(foamatConfig);

    console.log('03');
    foamatObj.content[0].text = 'a';                      // 発行日
    foamatObj.content[1].text = 'b';                      // 見積番号
    foamatObj.content[2].text = 'c';                      // 社名
    foamatObj.content[4].columns[0].text[3].text = 'd';   // 有効期限
    foamatObj.content[7].table.body[2].text = 'e';        // 備考

    console.log('04');
    var docDefinition = JSON.stringify(foamatObj);
    const fontDescriptors = {
      Roboto: {
        normal:       './fonts/ipag.ttf',
        bold:         './fonts/ipag.ttf',
        italics:      './fonts/ipag.ttf',
        bolditalics:  './fonts/ipag.ttf',
      }
  };

  console.log('05');
  const printer = new PdfPrinter(fontDescriptors);
  const pdfDoc  = printer.createPdfKitDocument(docDefinition);
  const storage = new Storage();
  let file_name = uuidv4() + '.pdf';
  const myPdfFile = storage.bucket(BUCKET).file(file_name);

  console.log('06');
  pdfDoc
    .pipe(myPdfFile.createWriteStream())
    .on('finish', function (){
      console.log('Pdf successfully created!');
      resolve(file_name);
    })
    .on('error', function(err){
      console.log('Error during the wirtestream operation in the new file');
      reject('Error: something goes wrong ! '+ err);
    });
    pdfDoc.end();
  });
}

function authorized(res) {
  createPDF()
  .then(function(file_name){
    res.status(200).send("The request was successfully authorized and pdf generated.\n You can find your pdf in the cloud storage " + file_name);
  })
  .catch( function(error) {
    console.error("Failed!" + error);
    res.status(400).send("Error: Pdf generation failed!");
  });
}

/*
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.pdfgen = function pdfgen(req, res) {
  console.log('this is the request');
  console.log(req);

  var accessToken = getAccessToken(req.get('Authorization'));
  var oauth = new Google.auth.OAuth2();
  oauth.setCredentials({access_token: accessToken});

  var permission = 'storage.buckets.get';
  var gcs = Google.storage('v1');
  gcs.buckets.testIamPermissions(
    {bucket: BUCKET, permissions: [permission], auth: oauth}, {},
    function (err, response) {
      if (response && response['permissions'] && response['permissions'].includes(permission)) {
        authorized(res);
      } else {
        console.log(response);
        console.log('---Error below---');
        console.log(err);
        res.status(403).send("The request is forbidden.");
      }
    }
  );
};