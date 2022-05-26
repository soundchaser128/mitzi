import {
  faDiscord,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"
import {faGlobe} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"

export type LinkType = "twitter" | "instagram" | "website" | "discord"

const icons = {
  twitter: faTwitter,
  instagram: faInstagram,
  website: faGlobe,
  discord: faDiscord,
}

const SocialLink: React.FC<{
  type: LinkType
  data: string
  className?: string
}> = ({type, data, className}) => {
  const icon = icons[type]
  const link =
    type === "website" || type === "discord"
      ? data
      : `https://${type}.com/${data}`
  let display
  switch (type) {
    case "twitter":
      display = `@${data}`
      break
    case "instagram":
      display = data
      break
    case "website":
      display = data
      break
    case "discord":
      display = data
      break
  }

  return (
    <a
      href={link}
      className={clsx(
        "font-light text-blue-500 hover:text-blue-400",
        className
      )}
    >
      <FontAwesomeIcon icon={icon} /> {display}
    </a>
  )
}

export default SocialLink
