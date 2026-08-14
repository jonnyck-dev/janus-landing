// Diagnóstico temporal: ¿Vercel entrega el body crudo o lo parsea?
module.exports.config = { api: { bodyParser: false } };

module.exports = async function handler(req, res) {
  const streamBody = await new Promise(function (resolve) {
    const chunks = [];
    let got = false;
    req.on('data', function (c) { got = true; chunks.push(Buffer.from(c)); });
    req.on('end', function () { resolve(got ? Buffer.concat(chunks).toString('utf8') : null); });
    req.on('error', function () { resolve(null); });
  });
  const rawLen = streamBody ? streamBody.length : 0;
  res.status(200).json({
    bodyType: typeof req.body,
    reqBodyIsString: typeof req.body === 'string',
    reqBodyIsObject: typeof req.body === 'object' && req.body !== null,
    reqBodyLen: typeof req.body === 'string' ? req.body.length : (req.body ? JSON.stringify(req.body).length : 0),
    streamGot: !!streamBody,
    streamLen: rawLen
  });
};
