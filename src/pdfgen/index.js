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
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    let pdfCreation = false;
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 40, 60, 40, 60 ],
      pageSize: 'A4',
      pageMargins: [ 40, 25, 40, 25 ],
      content: [
        // ヘッダ - 発行日
        {
          text: 'issued at: 12345-12345',
          style: 'header',
          fontSize: 10,
          alignment: 'right',
        },
    
        // ヘッダ - 見積もり番号
        {
          text: 'estimate num: 12345-12345',
          style: 'header',
          fontSize: 10,
          alignment: 'right',
        },
    
        // ヘッダ - 社名
        {
          text: 'corp name. ',
          style: 'header',
        },
    
        // ヘッダ - タイトル
        {
          text: 'title',
          style: 'header',
          fontSize: 21,
          alignment: 'center',  
        },
    
        // body - 料金表
        {
          alignment: 'justify',
          columns: [ 
            // 左(説明)
            {
              text: [
                {text: 'chatbot release sale\n', color: 'red'},
                {text: 'desctiption\n'},
                {text: 'desctiption\n\n', margin: [ 2, 2, 2, 5 ]},
                {text: 'effective date: yyyy-mm-dd', fontSize: 12},
              ],
              width: '65%'
            },
            // 右(自社情報)
            {
              text: [
                {text: 'corp-name\n', fonrSize: 16, bold: true},
                {text: 'dept.lv1,\n'},
                {text: 'dept.lv2,\n'},
                {text: '\n'},
                {text: 'tel: 03-0000-0000\n'},
                {text: 'fax: 03-1000-1000\n'},
              ],
              width: '35%'
            }
          ]
        },
    
        // 料金表
        {
          style: 'tableExample',
          margin: [ 2, 10, 2, 2 ],
          table: {
            widths: ['30%','30%','40%'],
            body: [
              [
                { text: 'head1', alignment: 'center'},
                { text: 'head2', alignment: 'center'},
                { text: 'head3', alignment: 'center'},
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
              [
                { text: 'Sample value 1', alignment: 'center'},
                { text: '30,000', alignment: 'right' },
                { text: 'Sample value 2', alignment: 'center' },
              ],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex === 0) {
                return '#CCCCCC';
              }
            },
            alignment: function (rowIndex, node, columnIndex){
              if (columnIndex == 2) {
                return 'center';
              }
            }
          }
        },
        {
          text: '<Tax not included.>',
          fontSize: 10,
          alignment: 'right',
        },
    
        
        // 備考
        {
          style: 'tableExample',
          margin: [ 2, 10, 2, 2 ],
          table: {
            widths: ['100%'],
            heights: [20, 120],
            body: [
              [ { text: 'Bold value', bold: true,  alignment: 'center', fillColor: '#CCCCCC'} ],
              [ { text: 'Bold value', bold: false, alignment: 'left'  , }　],
            ]
          }
        },
    
        // フッター:注意事項
        {
            text: 'worning!! / xxxxxxxxxxxxxxxxxxxx',
            style: 'worning',
          },
        
        // フッター:注釈
        {
          text: '*1: xxxxxxxxxxxxxxxxxxxx',
        },
        {
          text: '*2: xxxxxxxxxxxxxxxxxxxx',
        },
        // フッター:条件
        {
          ul: [
            'description 1 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'description 2 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'description 3 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'description 4 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          ],
          margin: [ 2, 2, 2, 2 ],
        },
        // フッター:重要事項の通知
        {
          text: 'worning!!\n / xxxxxxxxxxxxxxxxxxxx\nOS: windows browser: Internet Exploer',
          style: 'worning',
          color: 'blue',
        },
        {
          ul: [
            'description 1 xxxxxxxx xxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxx xxxxxxxxxxxxx xxx xxxxxxxxxxxxxxxxxx xxxxxxxxxxx xxxxxxxxxxxxxx',
            'description 2 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          ],
          color: 'blue',
        },
      ],
      
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'justify',
          margin: [ 2, 2, 2, 5 ]
        },
        worning: {
          fontSize: 12,
          bold: true,
          alignment: 'left',
          margin: [ 2, 2, 2, 2 ],
          color: 'red'
        },
            
      },
    
      defaultStyle: {
        columnGap: 20
      }
    }
  
    const fontDescriptors = {
      Roboto: {
        normal:       './fonts/ipag.ttf',
        bold:         './fonts/ipag.ttf',
        italics:      './fonts/ipag.ttf',
        bolditalics:  './fonts/ipag.ttf',
      }
  };
    
  const printer = new PdfPrinter(fontDescriptors);
  const pdfDoc  = printer.createPdfKitDocument(docDefinition);
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