import { useRef, useState, useEffect } from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import clsx from "clsx";
import { LoginApi } from "../../config/ApiCalls";
import Cookies from "js-cookie";
import { useSetAtom, useAtom } from "jotai";
import { isAuthenticatedAtom, userAtom } from "../../atoms/auth-atoms/authAtom";

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

const initialValues = {
  login: "",
  password: "",
};

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const setIsAuthenticatedAtom = useSetAtom(isAuthenticatedAtom);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [user, setUser] = useAtom(userAtom);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async () => {
      const login = loginRef.current?.value;
      const password = passwordRef.current?.value;

      if (!login || !password) {
        return;
      }
      try {
        const response = await LoginApi(login, password);

        if (response.code === "ERR_BAD_REQUEST") {
          throw new Error("Wrong Credentials");
        } else if (response.code === "ERR_NETWORK") {
          throw new Error(
            "Ooops! Something went wrong. Please try again later."
          );
        } else if (response.status !== 200) {
          throw new Error("An unexpected error occurred. Please try again.");
        }

        const res = response.data;
        if (res) {
          Cookies.set("session_token", res?.session_token);
          Cookies.set("isAuthenticated", "true");
          const userId = res.session.glpiID;
          Cookies.set("user", userId);

          setLoginError(null);
          const {
            session: { glpiID, ...restSession },
            ...rest
          } = res;
          const updatedRes = { ...rest, session: restSession };
          setUser(updatedRes);
          setIsAuthenticatedAtom(true);
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("Error:", error);
        setLoginError((error as Error).message);
      }
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Your Social Campaigns
        </div>
      </div>

      {loginError && <div className="alert alert-danger">{loginError}</div>}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">Login</label>
        <input
          placeholder="login"
          ref={loginRef}
          {...formik.getFieldProps("login")}
          className={clsx("form-control bg-transparent")}
          autoComplete="off"
        />
        {formik.touched.login && formik.errors.login && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.login}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Password
        </label>
        <input
          type="password"
          ref={passwordRef}
          placeholder="Password"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={clsx("form-control bg-transparent")}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/auth/forgot-password" className="link-primary">
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className="text-gray-500 text-center fw-semibold fs-6">
        Not a Member yet?{" "}
        <Link to="/auth/registration" className="link-primary">
          Sign up
        </Link>
      </div>
    </form>
  );
}
