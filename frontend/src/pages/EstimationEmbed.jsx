import Swal from "sweetalert2"
import { Widget } from "@typeform/embed-react"
import { useState } from "react"
import { sendResponses } from "../api/client"

function EstimationEmbed() {
  const [city, setCity] = useState("")

  const handleSubmit = async (event) => {
    try {
      const { value: passValues } = await Swal.fire({
        title: "Entrez votre mot de passe",
        html: `
        <div class="mb-2">
        <input type="password" id="password" class="swal2-input rounded-lg w-[70%]" placeholder="Entrez votre mot de passe">
        <input type="password" id="confirmPassword" class="swal2-input rounded-lg w-[70%]" placeholder="Confirmez votre mot de passe">
        </div>
        <button type="button" id="togglePasswordBtn" class="text-sm opacity-50">Afficher mot de passe</button>
        `,
        focusConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        confirmButtonColor: "#C8B790",
        iconColor: "#C8B790",
        didRender: () => {
          document
            .getElementById("togglePasswordBtn")
            .addEventListener("click", () => {
              const passwordInput = document.getElementById("password")
              const confirmPasswordInput =
                document.getElementById("confirmPassword")
              const isPassword = passwordInput.type === "password"
              passwordInput.type = isPassword ? "text" : "password"
              confirmPasswordInput.type = isPassword ? "text" : "password"
            })
        },
        preConfirm: () => {
          const password = Swal.getPopup().querySelector("#password").value
          const confirmPassword =
            Swal.getPopup().querySelector("#confirmPassword").value
          if (!password || !confirmPassword) {
            Swal.showValidationMessage("Les deux champs sont requis")
          } else if (password !== confirmPassword) {
            Swal.showValidationMessage("Les mots de passe ne correspondent pas")
          } else if (password.length < 5 || password.length > 16) {
            Swal.showValidationMessage(
              "La longueur du mot de passe doit être comprise entre 5 et 16 caractères"
            )
          }
          return { password, confirmPassword }
        },
        showCancelButton: false,
        confirmButtonText: "Créer mon compte",
        cancelButtonText: "Annuler",
      })

      if (passValues) {
        const { password, confirmPassword } = passValues

        if (password === confirmPassword) {
          const { formId, responseId } = event
          const formData = { formId, responseId, password, city }
          const response = await sendResponses(formData)

          if (response.status === 200) {
            await Swal.fire(
              "Success",
              "Form submitted successfully!",
              "success"
            )
          } else {
            await Swal.fire(
              "Erreur",
              "Échec de la soumission du formulaire",
              "error"
            )
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const checkZipCode = (zipCode) => {
    const supportedZipCodes = /^((95|92|94|78|93|60|75)\d{3})$/
    return supportedZipCodes.test(zipCode)
  }

  const fetchLocationData = async (zipCode) => {
    const countryCode = "fr"
    const url = `http://api.zippopotam.us/${countryCode}/${zipCode}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching location data:", error)
      return null
    }
  }

  const askForZipCode = async () => {
    try {
      if (!city) {
        const { value: zipCode } = await Swal.fire({
          title: "Entrez votre code postal",
          text: "Veuillez entrer votre code postal pour vérifier notre disponibilité de service.",
          input: "text",
          inputLabel: "Ex. : 95123, 92456, 78123...",
          cancelButtonText: "Retour à l'accueil",
          showCancelButton: true,
          inputPlaceholder: "Entrez votre code postal",
          confirmButtonText: "Vérifier",
          confirmButtonColor: "#C8B790",
          cancelButtonColor: "#D76C66",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: true,
          inputValidator: async (value) => {
            if (!value) {
              return "Le code postal est requis"
            } else if (!checkZipCode(value)) {
              return "Désolé, nous ne desservons pas cette zone. Veuillez nous contacter pour plus d'informations."
            } else {
              const locationData = await fetchLocationData(value)
              if (!locationData || Object.keys(locationData).length === 0) {
                return "Erreur: aucune information disponible pour ce code postal. Veuillez vérifier et réessayer."
              }
            }
          },
        })

        if (zipCode) {
          const countryCode = "fr"
          const url = `http://api.zippopotam.us/${countryCode}/${zipCode}`

          const response = await fetch(url)
          const data = await response.json()

          if (data.places && data.places.length > 0) {
            const places = data.places

            if (places.length === 1) {
              setCity(places[0]["place name"])
              Swal.fire({
                title: "Parfait!",
                text: `Vous avez choisi ${places[0]["place name"]}.`,
                icon: "success",
                showConfirmButton: false,
                timer: 3000,
              })
            } else if (places.length > 1) {
              const { value: selectedCity } = await Swal.fire({
                title: "Sélectionnez votre ville",
                input: "select",
                inputOptions: Object.fromEntries(
                  places.map((place, index) => [index, place["place name"]])
                ),
                showCancelButton: true,
                confirmButtonColor: "#C8B790",
                cancelButtonText: "Retour à l'accueil",
                cancelButtonColor: "#D76C66",
                confirmButtonText: "Sélectionner",
                allowOutsideClick: false,
                allowEscapeKey: false,
                inputValidator: (value) => {
                  if (value === "") {
                    return "Veuillez sélectionner une ville"
                  }
                },
              })

              if (selectedCity !== undefined) {
                setCity(places[selectedCity]["place name"])
                Swal.fire({
                  title: "Parfait!",
                  text: `Vous avez choisi ${places[selectedCity]["place name"]}.`,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                })
              } else if (Swal.DismissReason.cancel === "cancel") {
                window.location.href = "/"
              }
            }
          }
        } else if (Swal.DismissReason.cancel === "cancel") {
          window.location.href = "/"
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleFormReady = async () => {
    try {
      await askForZipCode()
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  return (
    <div>
      <Widget
        id="gEqyK00T"
        style={{ fontSize: 20, height: "100vh" }}
        onReady={handleFormReady}
        onSubmit={handleSubmit}
        className="my-class bg-[#262626]"
      />
    </div>
  )
}

export default EstimationEmbed
