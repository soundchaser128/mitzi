import {faHeart} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function CheckYourEmails() {
  return (
    <div className="bg-base-200 p-4 text-center text-base-content">
      <h1 className="mb-4 text-2xl font-bold">
        Thanks! <FontAwesomeIcon className="text-red-600" icon={faHeart} />
      </h1>
      <h2 className="text-gray-500">
        Please check your emails (spam too) and click the link to log in.
      </h2>
    </div>
  )
}
