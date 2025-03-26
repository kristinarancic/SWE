import "./AboutUs.css";
import image from "../../../../images/onama.jpg"
const AboutUs = () => {
  return (
    <section id="O-nama" className="O-nama">
      <div className="image">
        <img src={image} alt="photo1" />
      </div>
      <div className="text">
        <h1>
          <b>O nama</b>
        </h1>
        <div className="paragrafi">
          <p>Dobrodošli na platformu koja povezuje cvećare i kupce!</p>
          <p>
            Naša platforma cvećarama pruža mogućnost da svoje proizvode
            predstave širokoj publici i da ostvare nova poslovna partnerstva.
            Cvećare mogu lako kreirati svoje profile, postaviti slike
            proizvoda,definisati cene i dostupnost, i primati narudžbine od
            kupaca.
          </p>
          <p>
            Za kupce, pružamo jednostavan način da pronađu i naruče prelepe
            cvetne aranžmane i bukete iz udobnosti svog doma. Naša platforma
            omogućava pregled različitih cvećara, proizvoda i cena. Kupci mogu
            lako pronaći ono što traže i jednostavno izvršiti narudžbinu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
