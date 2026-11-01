import * as yup from "yup";

export const userValidateSchema = yup.object({
    UserName: yup.string().trim().min(3, "UserName must be at least three character").required(),
    email: yup.string().trim().lowercase().email("The email is not valid one").required(),
    Password: yup.string().min(8, "Password should be minimum 6character").required("password must be needed").trim().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one Special case Character"
    )
});


