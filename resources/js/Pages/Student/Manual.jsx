import { Head, Link } from '@inertiajs/react';
import GenericLink from '@/Components/Navigation/GenericLink';
import { useRoute } from 'ziggy-js';

const Manual = () => {
  const route = useRoute();

  return (
    <div className="text-container flex flex-col gap-[1em]">
      <Head title="Návod k použití" />
      <h1 className="fluid-text-4 mb-4 font-bold">Návod k použití</h1>
      <nav className="mb-6">
        <ul className="list-disc pl-8">
          <li>
            <a className="text-green-600 hover:underline" href="#vytvoreni-rezervace">
              Vytvoření rezervace
            </a>
          </li>
          <li>
            <a className="text-green-600 hover:underline" href="#notifikace">
              Notifikace
            </a>
          </li>
          <li>
            <a className="text-green-600 hover:underline" href="#sprava-rezervaci">
              Správa rezervací
            </a>
          </li>
          <li>
            <a className="text-green-600 hover:underline" href="#kriteria-schvaleni">
              Kritéria schválení/odmítnutí
            </a>
          </li>
        </ul>
      </nav>

      <h2 id="vytvoreni-rezervace" className="fluid-text-3 font-bold">
        Vytvoření rezervace
      </h2>
      <p>
        Pro vytvoření rezervace přejděte do{' '}
        <GenericLink href="equipment.index">katalogu vybavení</GenericLink> pomocí horní navigace.
        Zde naleznete seznam dostupného vybavení k vypůjčení.
      </p>
      <p>
        U každého vybavení jsou zobrazeny základní informace a dostupnost na následující týden.
        Kliknutím na konkrétní vybavení se dostanete na stránku s více informacemi. Tato stránka
        obsahuje podrobnější informace a přehled aktuálních a budoucích rezervací ostatních žáků.
        Této informace můžete využít například pro získání zpětné vazby či rad, jak s vybavením
        zacházet.
      </p>
      <p>
        Po kliknutí na tlačítko "rezervovat" se zobrazí rezervační kalendář. Nezabarvené dny
        představují data, kdy vybavení není nikým rezervované. Je-li nabízeno více jak 1 kus daného
        vybavení, je možné rezervaci překrývat s jiným studentem a to do té doby, dokud není den
        zbarven červeně. Rezervace nemůže začínat ani končit o víkendu, protože vybavení musí být
        vyzvednuto a vráceno ve škole správci daného vybavení, což je o víkendu nemožné.
      </p>
      <p>
        Datum začátku rezervace je zároveň dnem vyzvednutí vybavení, stejně jako datum ukončení je
        dnem vrácení. Například jednodenní rezervace znamená, že vybavení musíte vyzvednout i vrátit
        během tohoto dne, což je nepraktické a pravděpodobně nic nestihnete.
      </p>
      <p>
        Před odesláním rezervace přidejte krátkou zprávu, kde uvedete účel vypůjčení a plánované
        využití vybavení. Tato zpráva pomáhá správci rozhodnout o schválení a zobrazuje se dalším
        uživatelům.
      </p>
      <p>
        Po odeslání žádosti vyčkejte na schválení správcem. Všechny své rezervace najdete na stránce{' '}
        <GenericLink href="user.reservations.active">Rezervace</GenericLink>.
      </p>

      <h2 id="notifikace" className="fluid-text-3 font-bold">
        Notifikace
      </h2>
      <p>
        Při využívání rezervačního systému ToolBox je nutné mít na paměti, že veškeré notifikace
        jsoud odesílány na školní e-mailovou adresu. Je tedy nutné ho aktivně kontrolovat. Budete
        notifikování ohledně úspěšného odeslání a následného schválení rezervace. Taktéž den před
        vyzvednutím vybavení a v den vrácení vybavení. Správce vybavení si vyhrazuje právo vaši
        rezervaci zamítnout, o čemž budete tektéž informováni.
      </p>

      <h2 id="sprava-rezervaci" className="fluid-text-3 font-bold">
        Správa rezervací
      </h2>
      <p>
        Přehled všech rezervací je dostupný na stránce{' '}
        <GenericLink href="user.reservations.active">Rezervace</GenericLink>. Každá rezervace
        obsahuje základní informace.
      </p>
      <p>
        Nezáleží na tom, zda je rezervace schválená nebo čeká na schválení. Každou z nich je možné
        zrušit až na tu probíhající (z logických důvodů). Zrušené rezervace nejsou dále nijak
        zaznamenávány do systému.
      </p>

      <h2 id="kriteria-schvaleni" className="fluid-text-3 font-bold">
        Kritéria schválení/odmítnutí
      </h2>
      <p>
        Při rozhodování o schválení nebo odmítnutí rezervace jsou zvažovány následující faktory:
      </p>
      <ul className="list-disc pl-8">
        <li>
          <span className="font-bold">Zpráva uvedená při vytváření žádosti</span>
        </li>
        <li>
          <span className="font-bold">Datum začátku a konce</span> – např. pokud začátek rezervace
          připadá na svátek, žádost bude odmítnuta.
        </li>
        <li>
          <span className="font-bold">Předchozí rezervace</span> – zohledňuje se, zda bylo vybavení
          včas vráceno/vyzvednuto a v jakém stavu.
        </li>
      </ul>
    </div>
  );
};

export default Manual;
