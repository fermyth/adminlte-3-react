import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { setWindowClass } from "@app/utils/helpers";
import { Form, InputGroup } from "react-bootstrap";
import { Checkbox } from "@profabric/react-components";

import { setCurrentUser } from "@app/store/reducers/auth";
import { Button } from "@app/styles/common";
import { registerWithEmail, signInByGoogle } from "@app/services/auth";
import { useAppDispatch } from "@app/store/store";

import { db } from "../../firebase/index";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [isFacebookAuthLoading, setFacebookAuthLoading] = useState(false);
  const [t] = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const register = async (email: string, password : string, nama_perusahaan : string, id_company : any, role : any )  => {
    try {
      setAuthLoading(true);
      console.log("Registering user with email:", email);
      const result = await registerWithEmail(email, password);
      console.log("User registered, UID:", result.user.uid);

      // Save additional user data in Firestore
      await setDoc(doc(db, "db_users", result.user.uid), {
        email,
        nama_perusahaan,
        id_company,
        role,
      });
      console.log("User data saved in Firestore:", {
        email,
        nama_perusahaan,
        id_company,
        role
      });

      dispatch(setCurrentUser(result?.user));
      toast.success("Registration is successful");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      const err = error as Error;
      toast.error(err.message || "Failed");
      setAuthLoading(false);
    }
  };

  const registerByGoogle = async () => {
    try {
      setGoogleAuthLoading(true);
      await signInByGoogle();
      setGoogleAuthLoading(false);
    } catch (error) {
      console.error("Google sign-in error:", error);
      const err = error as Error;
      toast.error(err.message || "Failed");
      setGoogleAuthLoading(false);
    }
  };

  const registerByFacebook = async () => {
    try {
      setFacebookAuthLoading(true);
      throw new Error("Not implemented");
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      setFacebookAuthLoading(false);
      const err = error as Error;
      toast.error(err.message || "Failed");
    }
  };

  const { handleChange, values, handleSubmit, touched, errors, submitForm } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
        passwordRetype: "",
        nama_perusahaan: "",
        id_company: "",
        role:""
      },
      validationSchema: Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(5, "Must be 5 characters or more")
          .max(30, "Must be 30 characters or less")
          .required("Required"),
        passwordRetype: Yup.string()
          .min(5, "Must be 5 characters or more")
          .max(30, "Must be 30 characters or less")
          .required("Required")
          .oneOf([Yup.ref("password")], "Passwords must match"),
        nama_perusahaan: Yup.string().required("Required"),
      }),
      onSubmit: (values) => {
        register(
          values.email,
          values.password,
          values.nama_perusahaan,
          values.id_company,
          values.role
        );
      },
    });

  setWindowClass("hold-transition register-page");

  return (
    <div className="register-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>PORTAL</b>
            <span>SIGAPS</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">{t("register.registerNew")}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="passwordRetype"
                  name="passwordRetype"
                  type="password"
                  placeholder="Retype password"
                  onChange={handleChange}
                  value={values.passwordRetype}
                  isValid={touched.passwordRetype && !errors.passwordRetype}
                  isInvalid={touched.passwordRetype && !!errors.passwordRetype}
                />
                {touched.passwordRetype && errors.passwordRetype ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordRetype}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="nama_perusahaan"
                  name="nama_perusahaan"
                  type="text"
                  placeholder="Nama Perusahaan"
                  onChange={handleChange}
                  value={values.nama_perusahaan}
                  isValid={touched.nama_perusahaan && !errors.nama_perusahaan}
                  isInvalid={
                    touched.nama_perusahaan && !!errors.nama_perusahaan
                  }
                />
                {touched.nama_perusahaan && errors.nama_perusahaan ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.nama_perusahaan}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-building" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="id_company"
                  name="id_company"
                  type="text"
                  placeholder="ID Company"
                  onChange={handleChange}
                  value={values.id_company}
                  isValid={touched.id_company && !errors.id_company}
                  isInvalid={touched.id_company && !!errors.id_company}
                />
                {touched.id_company && errors.id_company ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.id_company}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-building" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="role"
                  name="role"
                  as="select"
                  onChange={handleChange}
                  value={values.role}
                  isValid={touched.role && !errors.role}
                  isInvalid={touched.role && !!errors.role}
                >
                  <option value="">Select Role</option>
                  <option value="1">Partner</option>
                  <option value="2">Customer</option>
                  <option value="3">Luteral</option>
                </Form.Control>
                {touched.role && errors.role ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.role}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-user-tag" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-7">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox checked={false} />
                  <label style={{ margin: 0, padding: 0, paddingLeft: "4px" }}>
                    <span>I agree to the </span>
                    <Link to="/">terms</Link>{" "}
                  </label>
                </div>
              </div>
              <div className="col-5">
                <Button
                  onClick={submitForm}
                  loading={isAuthLoading}
                  disabled={isGoogleAuthLoading || isFacebookAuthLoading}
                >
                  {t("register.label")}
                </Button>
              </div>
            </div>
          </form>
          <Link to="/login" className="text-center">
            {t("register.alreadyHave")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;