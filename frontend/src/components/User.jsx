import { useContext } from "react"
import UserContext from "../services/userContext"

export default function User({ name, date, type }) {
  const { connected, token } = useContext(UserContext)

  return (
    <section>
      {connected && token ? (
        <div className="w-96 bg-marron/30 mb-2 text-stone-200 flex flex-col rounded-xl">
          <div className="p-2">
            <h2 className="font-medium text-center">
              {name} - {type}
            </h2>
            <p className="mt-2 text-xs text-center font-normal opacity-75">
              {/* {date} */}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  )
}