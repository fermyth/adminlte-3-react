import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { setAuthentication, setCompanyId } from "@store/reducers/auth";
import { setWindowClass } from "@app/utils/helpers";
import { Checkbox } from "@profabric/react-components";
import * as Yup from "yup";
 
import { Form, InputGroup } from "react-bootstrap";
import { Button } from "@app/styles/common";
import { loginWithEmail, signInByGoogle } from "@app/services/auth";
import { useAppDispatch } from "@app/store/store";
import { db } from "../../firebase/index";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage";
 
const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation();
 
  const login = async (email : string, password : string) => {
    try {
      setAuthLoading(true);
 
      const result = await loginWithEmail(email, password);
 
      dispatch(setAuthentication(result?.user));
 
      await setDoc(
        doc(db, "db_users", result.user.uid),
        {
          email: result.user.email,
          lastLogin: new Date(),
        },
        { merge: true }
      );
 
      // Fetch additional user data from Firestore
      const userDocRef = doc(db, "db_users", result.user.uid);
      const userDocSnap = await getDoc(userDocRef);
 
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const id_company = userData.id_company;
 
        dispatch(setCompanyId(id_company));
 
        await AsyncStorage.setItem("id_company", id_company);
      } else {
        console.log("User document not found");
      }
 
      toast.success("Login is successful!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Login failed");
    } finally {
      // Ensure that loading state is turned off
      setAuthLoading(false);
 
      // Navigate to the home page after login attempt
      navigate("/");
    }
  };
 
  const { handleChange, values, handleSubmit , touched, errors }  = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(5, "Must be 5 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });
 
  setWindowClass("hold-transition login-page");
 
  const loginByGoogle = async () => {
    try {
      setGoogleAuthLoading(true);
      await signInByGoogle();
      toast.success("Login with Google is successful!");
      setGoogleAuthLoading(false);
      navigate("/");
    } catch (error) {
      setGoogleAuthLoading(false);
      const err = error as Error;
      toast.error(err.message || "Failed to login with Google");
    }
  };
 
  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>PORTAL</b>
            <span>SIGAPS</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">{t("login.label.signIn")}</p>
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
                {touched.email && errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                )}
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-envelope" />
                  </InputGroup.Text>
                </InputGroup.Append>
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
                {touched.password && errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                )}
                <InputGroup.Append>
                  <InputGroup.Text>
                    <i className="fas fa-lock" />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </div>
 
            <div className="row">
              <div className="col-8">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox checked={false} />
                  <label style={{ margin: 0, padding: 0, paddingLeft: "4px" }}>
                    {t("login.label.rememberMe")}
                  </label>
                </div>
              </div>
              <div className="col-4">
                <Button
                  loading={isAuthLoading}
                  onClick={handleSubmit as any}
                  disabled={isGoogleAuthLoading}
                >
                  {t("login.button.signIn.label")}
                </Button>
              </div>
            </div>
          </form>
 
          {/* Google Login Button */}
          {/* <Button
            variant="danger"
            onClick={loginByGoogle}
            loading={isGoogleAuthLoading}
            disabled={isAuthLoading}
            className="mt-3"
          >
            <i className="fab fa-google mr-2" />
            {t('login.button.signIn.social', { what: 'Google' })}
          </Button> */}
 
          {/* Uncomment for Facebook Login Button when implemented */}
          {/* <Button
            className="mt-2"
            onClick={loginByFacebook}
            loading={isFacebookAuthLoading}
            disabled={isAuthLoading}
          >
            <i className="fab fa-facebook mr-2" />
            {t('login.button.signIn.social', { what: 'Facebook' })}
          </Button> */}
 
          {/* Additional Links */}
          {/* <p className="mb-1">
            <Link to="/forgot-password">{t('login.label.forgotPass')}</Link>
          </p>
          <p className="mb-0">
            <Link to="/register" className="text-center">
              {t('login.label.registerNew')}
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};
 
export default Login;