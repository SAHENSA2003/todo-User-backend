import todoSchema from "../models/todoSchema.js";

export const CreateTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(401).json({
                success: false,
                message: "title is required"
            })
        };
        const exist = await todoSchema.findOne({ title: title });
        if (exist) {
            return res.status(409).json({
                success: false,
                message: "Todo already exist"
            })
        }
        const CreateData = await todoSchema.create({ title, userId: req.userId });
        return res.status(201).json({
            success: true,
            message: "todo Created successfully",
            data: CreateData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "todo is not created"
        })
    }
};

export const getAllTodo = async (req, res) => {
    try {
        const AllData = await todoSchema.find({ userId: req.userId });
        return res.status(200).json({
            success: true,
            message: AllData.length === 0 ? "No todo exist" : "todo fetched Successfully",
            data: AllData
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

};

export const delTodo = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id === "") {
            return res.status(401).json({
                success: false,
                message: "Id is required !!!",
            })
        }
        const deleteData = await todoSchema.findOneAndDelete({ _id: id, userId: req.userId })
        if (!deleteData) {
            return res.status(404).json({
                success: false,
                message: "User does not have this todo !!!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "todo data deleted successfully",
            data: deleteData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server Error",
        });
    }
};

/*
export const deleteAllTodo = async (req, res) => {
    try {
        const result = await todoSchema.deleteMany({});
        return res.status(200).json({
            success: true,
            message: result.deletedCount === 0 ? "no todo found" : "all todo deleted successfully ",
            TodoCount: result.deletedCount
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}*/

export const updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        if (!id || id === "" || !title || title === "") {
            return res.status(401).json({
                success: false,
                message: "id and title is required"
            })
        }
        const updateData = await todoSchema.findOneAndUpdate({ _id: id, userId: req.userId }, { title }, { new: true });
        console.log(updateData);
        if (!updateData) {
            return res.status(404).json({
                success: false,
                message: "todo not found",
            })
        };

        return res.status(200).json({
            success: true,
            message: "todo Updated successfully",
            data: updateData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}


