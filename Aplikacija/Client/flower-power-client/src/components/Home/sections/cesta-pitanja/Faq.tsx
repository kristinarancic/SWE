import React, { useState } from "react";
import "./Faq.css";

const faqs = [
  {
    question: "Kako se mogu registrovati kao kupac?",
    answer:
      'Da biste se registrovati kao kupac, kliknite na dugme "Prijavi se" na vrhu stranice, gde se možete registrovati ukoliko već niste kreirali nalog.',
  },
  {
    question: "Kako mogu registrovati svoju cvećaru na ovoj platformi??",
    answer:
      'Da biste registrovati svoju cvećaru, kliknite na dugme "Prijavi se" na vrhu stranice, gde se možete registrovati ukoliko već niste kreirali nalog.',
  },
  {
    question: "Kako mogu komunicirati s cvećarama?",
    answer:
      'Nakon što se registrirate kao kupac, na stranici cvećare pronađite dugme "Kontaktirajte nas" i kliknite na njega za slanje poruke cvećari.',
  },
  {
    question:
      "Da li moram da budem prijavljen da bih mogao da izvršim kupovinu?",
    answer:
      "Da, da biste mogli da izvršite kupovinu, morate da budete prijavljeni.",
  },
  {
    question: "Kako mogu pretraživati cvećaru na web shopu?",
    answer: 'Cvećaru možete pretražiti preko "Pretraži" opcije.',
  },
  {
    question: "Koje su koristi od registracije cvećare na ovoj aplikaciji?",
    answer:
      "Registrovanjem svoje cvećare na našoj platformi, imaćete mogućnost stupanja u komunikaciju sa potencijalnim mušterijama i bićete u prilici da brže i lakše prodajete svoje proizvode",
  },
  {
    question: "Koje su informacije potrebne prilikom registracije cvećare?",
    answer:
      "Prilikom registrovanja, biće potrebno da unesete podatke o cvećari.",
  },
];

const Faq: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <section className="glavni-div" id="Cesta-pitanja">
      <h1 className="h1-cesta-pitanja">Česta pitanja</h1>
      <div className="div-pitanja">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              className="dugme-cesta-pitanja"
              onClick={() => toggleAnswer(index)}
            >
              {faq.question}
            </button>
            {expandedIndex === index && <p className="faq">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
