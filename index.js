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
  // ***** 先把簽名驗證註解掉 *****
  // if (!checkSig(req.rawBody, req.get('x-line-signature')))
  //   return res.sendStatus(401);

  // ***** 一律印出整包 payload *****
  console.log('\n=== NEW EVENT ===');
  console.log(JSON.stringify(req.body, null, 2));

  // ***** 一定要 200，LINE 才不會重送 *****
  res.send('OK');
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Bot up on', PORT));
