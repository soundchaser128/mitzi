import {faTwitter} from "@fortawesome/free-brands-svg-icons"
import {faPaintBrush} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Link} from "@remix-run/react"

const Index: React.FC = () => {
  return (
    <main className="flex w-full justify-center">
      <section className="mt-8 flex flex-col rounded-xl bg-base-200 p-4 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Mitzi</h1>
        <img
          src="/android-chrome-192x192.png"
          className="mb-4 self-center rounded-lg shadow-lg"
          alt="a smug cat"
        />
        <p className="mb-2">
          Mitzi can generate commission sheets and Twitter banners for you,
          right inside your browser.
        </p>
        <div className="flex justify-around">
          <Link className="btn btn-primary" to="/commission-sheet">
            <FontAwesomeIcon icon={faPaintBrush} className="mr-1" />
            Commission sheet generator
          </Link>
          <Link className="btn  btn-primary" to="/banner">
            <FontAwesomeIcon icon={faTwitter} className="mr-1" />
            Banner generator
          </Link>
        </div>

        <footer className="mt-4 text-center text-sm text-gray-500">
          Made by soundchaser128, this project is open source and available on{" "}
          <a
            className="text-blue-400 underline"
            href="https://github.com/soundchaser128/mitzi"
          >
            Github.
          </a>
        </footer>
      </section>
    </main>
  )
}

export default Index
