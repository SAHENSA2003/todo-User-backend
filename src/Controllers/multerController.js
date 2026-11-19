import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination:"picture",
    filename:function(req,file,callBack){
        console.log(file) /* to check what the file actually gets */
        callBack(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({storage:storage});

