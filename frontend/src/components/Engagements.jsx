import React from "react"
import EngImageOne from "../images/engagement_one.png"
import EngImageTwo from "../images/engagement_two.png"
import EngImageThree from "../images/engagement_three.png"

const engagements = [
  {
    image: EngImageOne,
    title: "Roulons Vert l'Avenir !",
    description:
      "Nos équipes privilégient les trajets en trottinette électrique pour",
  },
  {
    image: EngImageTwo,
    title: "Un Espace de Travail Eco-Friendly",
    description:
      "Nous croyons que c’est ensemble que nous pouvons faire la différence et c’est par nos bureaux que nous commençons en sensibilisant nos équipes, réduisant nos déchets et notre consommation d’énergie.",
  },
  {
    image: EngImageThree,
    title: "Le Theorem Gagnant pour la Jeunesse",
    description:
      "Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices.",
  },
]

export default function Engagements() {
  return (
    <section className="py-12 bg-white helvetica">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl helvetica-bold text-center mb-8">
          Nos engagements
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {engagements.map((engagement, idx) => (
            <div
              key={idx}
              className="max-w-sm max-md:h-auto h-[400px] flex flex-col items-center justify-start bg-white shadow-md rounded-md overflow-hidden"
            >
              <div className="w-[400px] h-48">
                <img
                  src={engagement.image}
                  alt={engagement.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {engagement.title}
                </h3>
                <p className="text-gray-700 text-center">
                  {engagement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
