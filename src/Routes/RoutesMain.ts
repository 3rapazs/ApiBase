
// import { path } from 'path';
//#region Import

import express from "express";
import { Request, Response } from "express";
import ConfigSys from "@/Config/ConfigSys";
import TripleDES from "@/Common/TripleDES"
import fs from 'fs';
import path from 'path';
import Result from '@/Model/Shared/Result';
import AuthenticateJWT from "@/Common/Auth";
//#endregion Import

//#region Fields

const router = express.Router();
const auth = new AuthenticateJWT();

//#endregion Fields


//#region Start Url
router.get("/", (req: Request, res: Response) => {
  const message: string = `Welcome ${ConfigSys.AppName}`
  const result: string = `
    <div style="white-space: pre-line">${message}</div>
  `
  res.send(result);
});
//#endregion ReleaseNote

//#region ReleaseNote
router.get("/ReleaseNote", (req: Request, res: Response) => {
  const key = req.query.key;
  if (key === ConfigSys.DocumentKey) {
    const releaseNote: string = `=================== Version ===================
    Version: [${ConfigSys.Version}] 
    Build Date: [${ConfigSys.BuildDate}]
    Version Description: [${ConfigSys.VersionDescription}]
    =================== ReleaseNote ===================
    ${ConfigSys.ReleaseNote}
  `
    const result: string = `
    <div style = "white-space: pre-line"> ${releaseNote} </div>
      `
    res.send(result);
  }
  else {
    res.send("Not Access");
  }
});
//#endregion ReleaseNote

//#region Encrypt
router.post("/Encrypt", async (req: Request, res: Response): Promise<void> => {
  let result: string
  const message = req.body.Message
  const secret = req.body.Secret
  if (secret === ConfigSys.Secret) {
    const tripleDES: TripleDES = new TripleDES()
    result = tripleDES.EncryptTripleDES(message);
  }
  else {
    result = "Secret Incoret"
  }

  res.send(result);
});
//#endregion Encrypt


//#region Decrypt
router.post("/Decrypt", async (req: Request, res: Response): Promise<void> => {
  let result: string
  const message = req.body.Message
  const secret = req.body.Secret
  if (secret === ConfigSys.Secret) {
    const tripleDES: TripleDES = new TripleDES()
    result = tripleDES.DecryptTripleDES(message);
  }
  else {
    result = "Secret Incoret"
  }

  res.send(result);
});
//#endregion Decrypt

//#region UploadBase64
const _RootPath = path.resolve(__dirname, '..')
router.use('/Uploads', express.static(path.join(_RootPath, 'uploads')));


router.post('/UploadBase64', (req: Request, res: Response): void => {
  const { filename, filedata, folder } = req.body;

  if (!filename || !filedata) {
    res.status(400).json({ message: 'Missing filename or filedata.' });
  }
  const uploadDir = path.join(_RootPath, 'uploads', folder || '');
  console.log(uploadDir)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, filename);
  const base64Data = filedata.replace(/^data:.+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  res.json({ message: 'File uploaded successfully!', path: filePath });
});
//#endregion UploadBase64

//#region Upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    const uploadDir = 'src/uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // โฟลเดอร์เก็บไฟล์
  },
  filename: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, file.originalname);
    }
    else {
      cb(new Error('Only image files are allowed!'), "");
    }
  }
});

const upload = multer({ storage: storage });

router.post('/Upload', auth.authenticate, upload.single('file'), (req, res): void => {
  const result: Result = new Result();
  result.IsSuccess = false;
  if (!req.file) {
    result.Message = "กรุณาเลือกไฟล์"
    res.send(result)
  }
  if (!req.body.path) {
    result.Message = "กรุณาระบุ Path"
    res.send(result)
  }
  const uploadDir = 'src/uploads/' + req.body.path + "/"
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  let sourcePath = 'src/uploads/' + req.file.filename
  const destPath = uploadDir + req.file.filename
  fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
      result.Message = "Error copying file"
      res.send(result)
    }
  });
  try {
    fs.unlink(sourcePath, (err) => {
      if (err) {
        result.Message = "ลบไม่สำเร็จ"
        res.send(result)
      }
    });
  } catch (error) {
    result.Message = error
    res.send(result)
  }
  let fullUrl = `${req.protocol.replace(" ", "")}://${req.get('host')}/uploads/${req.body.path}/${req.file.filename}`
  // fullUrl = fullUrl.replace(" ", "");

  result.IsSuccess = true;
  result.Message = fullUrl
  res.send(result)
});

//#endregion Upload


//#region Export Default
export default router;
//#endregion Export Default