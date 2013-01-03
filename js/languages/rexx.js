/*
Language: Rexx
Author: Kent Jones (http://www.Appriss.com/)
*/

hljs.LANGUAGES.rex = {
  case_insensitive: true,
  defaultMode: {
    keywords: {
      flow: 'if then do end else exit while',
      keyword: 'parse var say arg'
    },
    contains: [
      {
        className: 'comment',
        begin: '/\\*', end: '\\*/'
      },
      {
        className: 'string',
        begin: '\'', end: '\''
      },
      {
        className: 'string',
        begin: '"', end: '"'
      },
      {
        className: 'number', 
        begin: '\\b\\d+',
        relevance: 0
      }
    ]
  }
};