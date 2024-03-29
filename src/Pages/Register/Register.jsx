import React, { useEffect, useState } from 'react';
import InputFormAuth from '../../Components/Form/InputFormAuth/InputFormAuth';
import AuthLayout from '../../Components/Layout/AuthLayout/AuthLayout';
import style from '../../Components/Layout/AuthLayout/style.module.css';
import { Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../Features/auth/authApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Register = () => {
  const MySwal = withReactContent(Swal);

  const [userRegister, { isLoading, isSuccess, isError, error }] = useRegisterUserMutation();
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [checkTerms, setCheckTerms] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
  });

  const changeHandler = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  function checkPasswordMatch(password) {
    if (password != passwordConfirm) {
      throw 'Password not match!';
    }

    return password;
  }

  function showLoading() {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
  const successLoading = () => {
    Swal.close();
    MySwal.fire({
      title: <p>Thanks for register buddy, Please check your email for activation!</p>,
      icon: 'success',
    });
  };

  const onRegisHandler = async () => {
    try {
      const passwordValidated = await checkPasswordMatch(data.password);
      await userRegister({ ...data, password: passwordValidated });
    } catch (err) {
      setPasswordError(err);
    }
  };

  useEffect(() => {
    if (isLoading) {
      showLoading();
    }

    if (isSuccess) {
      successLoading();
      setData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
      });
    }

    if (isError) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error?.status == 400 ? 'Email Already taken!' : 'Something went Wrong!',
      });
    }
  }, [isLoading]);

  return (
    <AuthLayout title="Let’s Get Started !" description="Create new account to access all features">
      {/* {error?.status == 400 && (
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Register Failed!</strong> Email Already taken!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )} */}
      {passwordError ? (
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Register Failed!</strong> {passwordError}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      ) : (
        ''
      )}
      <InputFormAuth title="Name" name="name" value={data.name} type="text" onchange={(e) => changeHandler(e)} />
      <InputFormAuth title="Email Address" value={data.email} name="email" type="text" onchange={(e) => changeHandler(e)} />
      <InputFormAuth title="Phone Number" value={data.phone_number} name="phone_number" type="number" onchange={(e) => changeHandler(e)} />
      <InputFormAuth title="Password" name="password" value={data.password} type="password" onchange={(e) => changeHandler(e)} />
      <InputFormAuth title="Confirm Password" name="confirmPassword" type="password" onchange={(e) => setPasswordConfirm(e.target.value)} />

      <div class="form-check mb-3 customCheck">
        <input class="form-check-input" type="checkbox" value="" onChange={() => setCheckTerms((prev) => !prev)} id={style.flexCheckDefault} />
        <label class={`form-check-label ${style.formLabel}`} for={style.flexCheckDefault}>
          I agree to terms & conditions
        </label>
      </div>
      <div class="d-grid mb-2 mt-3">
        <button class="btn btn-warning text-light" type="button" onClick={onRegisHandler} disabled={!(checkTerms && data.name && data.email && data.password && data.phone_number)}>
          Register
        </button>
      </div>
      <div class={`loginLink text-center mt-3 ${style.formLabel}`}>
        <p>
          Already have account?{' '}
          <Link to={'/login'} style={{ textDecoration: 'none', color: 'rgb(239, 200, 26)' }}>
            {' '}
            Log in Here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
