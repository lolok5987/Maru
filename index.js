const express = require('express');
const crypto  = require('crypto');

const { CHANNEL_SECRET } = process.env;
const app = express();
app.use(express.json({ verify:(req, res, buf)=>{ req.rawBody = buf } }));

function checkSig(buf, sig) {
  const h = crypto.createHmac('sha256', CHANNEL_SECRET)
                  .update(buf).digest('base64');
  return h === sig;
}

app.post('/webhook', (req, res) => {
  if (!checkSig(req.rawBody, req.get('x-line-signature'))) return res.sendStatus(401);
  console.log(JSON.stringify(req.body, null, 2));   // 先印整包 event
  res.send('OK');                                   // 一定要 200
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Bot up on', PORT));
