import multer from "multer";
import ftp from "ftp";

const multerUpload = multer({ dest: "uploads/" });
const ftpClient = new ftp();

ftpClient.connect({
  host: process.env.UPLOAD_FTP_SERVER,
  user: process.env.UPLOAD_FTP_USERNAME,
  password: process.env.UPLOAD_FTP_PASSWORD,
});
ftpClient.on("ready", () => {
  console.log("FTP connection successful");
});

ftpClient.on("error", (err) => {
  console.error("FTP connection error:", err);
});
export { multerUpload, ftpClient };
