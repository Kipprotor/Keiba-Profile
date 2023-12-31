**FYI: HorseID とはnetkeiba での競走馬に割り振られた番号のこと**
https://db.netkeiba.com/horse/2017106711/ の2017106711の部分

## /src/scrape

**htmlのスクレイピングを行うコードがあるフォルダ**

- scraper.ts
  - export
    - horseInfo2SeachResult
    - scrapeHorseInfo
    - scrapeHorseTitle
    - scrapePedigree
    - scrapeProfTable
    - scrapeSearchResult
- ~~parse~~ scrapeSearchResult.ts
  - functions
    - ~~parse~~ scrapeSearchResult(html)
      - 検索結果のページから、馬名 HorseID 生年の情報を抜き出す関数
    - horseInfo2SearchResult
      - HorseInfo型をSearchResult型に変換する関数
      - lookupIDが使用
- ~~parse~~ scrapeProfile.ts
  - functions
    - ~~parse~~ scrapeProfPage(html) => horseProfile
      - netkeibaの競走馬の情報を載せているページから、情報を抜き出す関数
      - scrapeHorseInfo と scrapeRaceResult のラッパー
    - ~~parse~~ scrapeHorseInfo
    - extractPrizeString(string) => number[]
      - 以下のような文字列を場所ごとの賞金に分けて配列で返す関数。
      - input: "4170万円 (中央) / 3400万円 (地方)"
      - output: [prizeJRA,prizeNAU] = [4170,3400]
    - ~~parse~~ scrapeHorseTitle
    - ~~parse~~ scrapeProfTable
    - ~~parse~~ scrapePedigree
- ~~parse~~ scrapeRaceResult.ts
  - ~~parse~~ scrapeRaceResult
## /src

- index.ts
  - このモジュールからインポートできる関数を一度にエクスポートしている
  - ここで定義されている関数・定数はない。
- deps.ts
  - 利用しているモジュールのバージョン管理を簡単にするためのファイル
  - このモジュールで使っているすべてのモジュールをここでインポートしている。
- crawler.ts
  - functions
    - generateURL({horseName,fathersName,motherName}) => string
    - encodeURIeucJP(str) => string
    - searchInNetkeiba(url) => netkeibaResponse
  - interface
    - netkeibaResponse = {url: string,body:string,unique:boolean}
- wrapper.ts
  - functions
    - lookupID(name) => SearchResult[]
      - 名前から HorseID を取得する関数
      - 変更完了 ~~1件しかヒットしなかった場合(競走馬のプロフィールページにリダイレクトされた場合)の処理が完成したら返り値を searchResult に変更する。~~
    - profileByName({name, year?, father?, mother?})
      - 競走馬の名前で検索して情報を取得する関数
      - 名前の指定は必須だが、オプション引数として、生年や、父馬と母馬の名前を指定できる。
      - 検索結果が1件以上だった場合、エラーを返す。
    - profileByID(horseId)
      - HorseIDを使って情報を取得する関数
- model.ts
  - パースするときに使う正規表現などの定数や、パースした結果を代入する型を定義
  - 主に scraper.ts が使用
  - interface
    - searchResult
      - scrapeSearchResultが使用
    - horseInfo
      - scrapeHorseInfo が使用
    - raceResult
      - scrapeRaceResult が使用

## /test
- 動作テスト用

## /debugLabo

- textDecodeEncoder.ts
  - crawler.ts で使用した encodeURIeucJP のテスト
  - 引数をURI形式にした EUC-JP の文字コードで返すスクリプト
- cheerioList.ts
  - cheerio がリスト形式で a要素やhref要素を取得できるかテストしたもの
- moduleTest-parseHtmlTable.ts
  - parser.ts で table 要素を処理するときに複雑な処理を書く代わりに npm:parse-html-table を使うべきかテストするときに使用
  - このテストには合格したものの、実際に parser.ts に使った場合、何をしているのか却って分かりづらくなってしまったので npm:parse-html-table は不採用