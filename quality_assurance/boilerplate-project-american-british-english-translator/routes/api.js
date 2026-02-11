'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body || {};

      if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }
      if (typeof text === 'string' && text.trim().length === 0) {
        return res.json({ error: 'No text to translate' });
      }

      const result = translator.translate(text, locale);
      if (result && result.error) return res.json({ error: result.error });
      return res.json(result);
    });
};
