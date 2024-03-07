import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import UserContext from "../services/userContext"
import { login } from "../api/session"
import { resetPasswordRequest, setNewPassword } from "../api/session"
import logo from "../images/icons/logo_black.png"
import login_bg from "../images/login-background.jpg"
import NavBar from "../components/NavBar"
import Swal from "sweetalert2"

function Login() {
  const navigate = useNavigate()
  const userLogin = useRef({
    email: false,
    password: false,
  })
  const { isAdmin, isPro, connected, setConnected, setToken } =
    useContext(UserContext)
  const [redInput, setRedInput] = useState(false)

  useEffect(() => {
    if (connected) {
      const redirectPath = isAdmin
        ? "/dashboard"
        : isPro
        ? "/pro-account"
        : "/account"
      navigate(redirectPath)
    }
  }, [connected, isAdmin, isPro, navigate])

  const logIn = async () => {
    try {
      const res = await login(userLogin.current)
      localStorage.setItem("token", res.token)
      setToken(res.token)
      setConnected(true)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRedInput(true)
        setTimeout(() => {
          setRedInput(false)
        }, 3000)
      }
    }
  }

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Mot de passe oublié",
      html: "Entrez votre email<br/><small>Attention! vous ne pouvez demander la réinitialisation  du mot de passe qu'une fois par heure !</small>",
      input: "email",
      inputPlaceholder: "Entrez votre email",
      confirmButtonText: "Envoyer le code",
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#C8B790",
      iconColor: "#C8B790",
      cancelButtonColor: "#D76C66",
      showCancelButton: true,
      cancelButtonText: "Annuler",
    })

    if (email) {
      try {
        const response = await resetPasswordRequest(email)
        if (response.message) {
          const { value: code } = await Swal.fire({
            title: "Entrez le code reçu",
            html: "Code de réinitialisation<br/><small>Le code est valable pendant 10 minutes.</small>",
            input: "text",
            inputPlaceholder: "Code de réinitialisation",
            confirmButtonText: "Vérifier le code",
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#C8B790",
            iconColor: "#C8B790",
            cancelButtonColor: "#D76C66",
            cancelButtonText: "Annuler",
          })

          if (code) {
            let newPassword

            do {
              const { value: newPasswordInput } = await Swal.fire({
                title: "Nouveau mot de passe",
                input: "password",
                inputPlaceholder: "Entrez votre nouveau mot de passe",
                confirmButtonText: "Changer le mot de passe",
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#C8B790",
                iconColor: "#C8B790",
                cancelButtonColor: "#D76C66",
                cancelButtonText: "Annuler",
                inputValidator: (value) => {
                  if (value.length < 5 || value.length > 16) {
                    return "La longueur du mot de passe doit être comprise entre 5 et 16 caractères"
                  }
                  return null
                },
              })

              if (newPasswordInput) {
                newPassword = newPasswordInput
              }
            } while (!newPassword)

            if (newPassword) {
              await setNewPassword(email, code, newPassword)
              Swal.fire({
                title: "Mot de passe changé",
                text: "Mot de passe changé avec succès",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              })
            }
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          Swal.fire({
            title: "Trop de demandes!",
            text: "Vous avez atteint la limite de demandes. Veuillez réessayer plus tard.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "Utilisateur pas trouvé",
            text: "L'email que vous avez saisi n'existe pas. Veuillez vérifier et réessayer.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })
        } else if (error.response && error.response.status === 403) {
          Swal.fire({
            title: "Code expiré!",
            text: "Le code de réinitialisation a expiré!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })
        } else if (error.response && error.response.status === 400) {
          Swal.fire({
            title: "Code invalid!",
            text: "Le code de confirmation n'a pas été saisi correctement !",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })
        } else {
          Swal.fire("Erreur", error.message, "error")
        }
      }
    }
  }

  return (
    <section
      className="h-screen"
      style={{
        backgroundImage: `url(${login_bg})`,
      }}
    >
      <NavBar />
      <div className="flex flex-col justify-center h-[80vh] items-center bg-center bg-cover">
        {!connected && (
          <>
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="px-6 py-4">
                <div className="flex justify-center mx-auto">
                  <img className="w-auto h-20 sm:h-20" src={logo} alt="" />
                </div>

                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Welcome Back
                </h3>

                <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                  Veuillez entrer vos identifiants de connexion pour continuer
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    logIn()
                  }}
                >
                  <div className="relative flex items-center mt-2.5">
                    <span className="absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>

                    <input
                      type="email"
                      name="email"
                      maxLength="50"
                      className={`block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 ${
                        redInput && "border-red-400"
                      }`}
                      placeholder="Email address"
                      onChange={(e) => {
                        userLogin.current = {
                          ...userLogin.current,
                          email: e.target.value,
                        }
                      }}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="relative flex items-center mt-4">
                    <span className="absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>

                    <input
                      type="password"
                      name="password"
                      maxLength="50"
                      className={`block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg ${
                        redInput && "border-red-400"
                      }`}
                      placeholder="Mot de passe"
                      onChange={(e) => {
                        userLogin.current = {
                          ...userLogin.current,
                          password: e.target.value,
                        }
                      }}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                    >
                      Mot de passe oublié ?
                    </button>

                    <button
                      type="submit"
                      className="tracking-wide rounded-lg bg-marron px-4 py-2 text-center text-base font-semibold text-white shadow-md transition ease-in hover:bg-marron/80"
                    >
                      <span className="w-full"> Se connecter </span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  Nouveau client ?{" "}
                </span>

                <Link
                  to="/estimation"
                  className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Login
