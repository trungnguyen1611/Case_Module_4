import multer from "multer"
import appRoot from "app-root-path"
export const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        console.log('check')
        callback(null,appRoot + "/src/public/images/foods/" + file.originalname );
    },
    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});