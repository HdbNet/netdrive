const router     = require('express').Router();
const fs         = require('fs');
const path       = require('path');
const fileupload = require('express-fileupload');

require('dotenv').config();
router.use(fileupload());

const storage = process.env.NETDRIVE_STORAGE;

if (!storage) {
  console.error(
    'NETDRIVE_STORAGE environment variable not defined\n'
  );
  process.exit(1);
}


const slash = process.platform === 'win32' ? '\\' : '/';

const processpath = (storagepath) => {
  const relativepath = storagepath ? storagepath.replace(/_/g, slash) : slash;
  return { relativepath, absolutepath: path.join(storage, relativepath) };
};

router.get('/:path?', async (req, res, next) => {
  try {
    const dirpath = processpath(req.params.path);
    const dir = await fs.promises.opendir(dirpath.absolutepath);
    const content = { files: [], directories: [] };

    for await (const entry of dir) {
      if (entry.isDirectory()) {
        content.directories.push(entry.name);
      } else {
        content.files.push(entry.name);
      }
    }
    content.directories.sort()
    content.files.sort()

    res.json({ path: dirPath.relativepath, content });
  }
  catch (err) {
    next(err);
  }
});

const movefile = (file, storagepath) => {
  return new Promise((resolve, reject) => {
    file.mv(path.join(storagepath, file.name), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

router.post('/:path?', async (req, res, next) => {
  const dirpath = processpath(req.params.path);
  let files = req.files.file;
  if (!Array.isArray(files)) {
    files = [files];
  }

  try {
    for (const file of files) {
      await movefile(file, dirpath.absolutepath);
    }
  } catch (err) {
    return next(err);
  }
  
  res.json({
    success: true,
    message: 'Files successfully stored',
    path: dirpath.relativepath
  });
});

module.exports = router;