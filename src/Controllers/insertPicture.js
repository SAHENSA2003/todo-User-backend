import multerSchema from "../models/multerSchema.js";


const uploadPicture = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No picture uploaded"
            })
        };
        console.log(file);
        const allowTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        console.log(file.mimetype);
        if (!allowTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file types !!!"
            })
        };

        const imageUrl = `http://localhost:9001/uploadPic/${file.filename}`;

        const imgData = await multerSchema.create({
            picture: imageUrl
        });

        return res.status(201).json({
            success:true,
            message:"Image uploaded successfully",
            data:imgData
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export default uploadPicture;