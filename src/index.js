const express = require('express');
const router  = require('./router');
const cors    = require('cors');
const enoent  = require('./enoent');


const port     = process.env.PORT || 8000;
const netdrive = express();


netdrive.use(express.json());
netdrive.use(cors());


netdrive.use('/api', router);
netdrive.use(enoent);


netdrive.listen(port, () => {
    console.log('Server running on port', port)
});