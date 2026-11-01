import * as yup from "yup";

export const taskValidateSchema = yup.object({
    title: yup.string().trim().min(7, "Task must be at least seven character").required(),
});

