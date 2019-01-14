{
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
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
					[
            { alignment: 'center', text: 'Sample value 1'},
            { alignment: 'right',  text: '30,000'},
            { alignment: 'center', text: 'Sample value 1'},
          ],
				]
			},
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {
          if (rowIndex === 0) {
            return '#CCCCCC';
          }
				},
				alignment: function (rowIndex, node, columnIndex) {
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
          [ { bold: true,  alignment: 'center', fillColor: '#CCCCCC', text: 'Bold value'} ],
          [ { bold: false, alignment: 'left'  , fillColor: '#000000', text: 'Bold value'} ],
        ]
      }
    },

    // フッター:注釈
    { text: '*1: xxxxxxxxxxxxxxxxxxxx',
    },
    { text: '*2: xxxxxxxxxxxxxxxxxxxx',
    },

    // フッター: 注意事項１
    {
      text: 'worning!! / xxxxxxxxxxxxxxxxxxxx',
      style: 'worning',
    },
    // フッター: 注意事項２
		{
      margin: [ 22, 2, 2, 2 ],
			ul: [
				'description 1 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				'description 2 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				'description 3 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				'description 4 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      ],
		},
    // フッター:重要事項の通知
    {
      text: 'worning!! : xxxxxxxxxxxxxxxxxxxx\nOS: windows browser: Internet Exploer',
      style: 'worning',
      color: 'blue',
    },
		{
      margin: [ 22, 2, 2, 2 ],
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