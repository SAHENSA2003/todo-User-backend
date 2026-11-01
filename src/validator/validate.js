export const validate = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.validate(req.body, { stripUnknown: true });
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.errors?.[0] || "Invalid input"
        });
    }
};