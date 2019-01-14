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
function createPDF(str_a) {
  console.log("02-02");
  console.log(str_a);
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    var pdfCreation = false;
    var foamatObj = require('./formats/form1.json');

    foamatObj.content[0].text = str_a;                          // 発行日
    foamatObj.content[1].text = req.body.estimate_num;                       // 見積番号
    foamatObj.content[2].text = req.body.corp_name;                          // 社名
    foamatObj.content[4].columns[0].text[3].text = req.body.effective_name;  // 有効期限
    foamatObj.content[7].table.body[1].text = req.body.note;                 // 備考

    var docDefinition = JSON.stringify(foamatObj);
    const fontDescriptors = {
      Roboto: {
        normal:       './fonts/ipag.ttf',
        bold:         './fonts/ipag.ttf',
        italics:      './fonts/ipag.ttf',
        bolditalics:  './fonts/ipag.ttf',
      }
  };

  const printer = new PdfPrinter(fontDescriptors);
  const pdfDoc  = printer.createPdfKitDocument(foamatObj);
  const storage = new Storage();
  let file_name = uuidv4() + '.pdf';
  const myPdfFile = storage.bucket(BUCKET).file(file_name);

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

function authorized(res, str_a) {
  console.log("02-01");
  console.log(str_a);
  createPDF(str_a)
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
  console.log(req.body.issued_at);
  let str_a = req.body.issued_at;

  var accessToken = getAccessToken(req.get('Authorization'));
  var oauth = new Google.auth.OAuth2();
  oauth.setCredentials({access_token: accessToken});

  var permission = 'storage.buckets.get';
  var gcs = Google.storage('v1');
  gcs.buckets.testIamPermissions(
    {bucket: BUCKET, permissions: [permission], auth: oauth}, {},
    function (err, response, str_a) {
      if (response && response['permissions'] && response['permissions'].includes(permission)) {
        authorized(res, str_a);
      } else {
        console.log(response);
        console.log('---Error below---');
        console.log(err);
        res.status(403).send("The request is forbidden.");
      }
    }
  );
};