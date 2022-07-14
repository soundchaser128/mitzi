import React from "react"
import type {CommissionSheet} from "~/helpers/types"
import CardTemplate from "./templates/CardTemplate"
import NoBorderTemplate from "./templates/NoBorderTemplate"

const templates = {
  card: CardTemplate,
  "no-border": NoBorderTemplate,
}

const Preview: React.FC<CommissionSheet> = (props) => {
  const Template = templates[props.template]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Template {...props} />
    </div>
  )
}

export default Preview
