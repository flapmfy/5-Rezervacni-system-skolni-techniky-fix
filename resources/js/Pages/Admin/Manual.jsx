import { Head } from '@inertiajs/react';
import GenericLink from '@/Components/Navigation/GenericLink';
const Manual = () => {
  return (
    <div className="container">
      <Head title="Manuál k použití" />

      <div className="text-container mb-4 flex flex-col gap-12">
        <div>
          <h1 className="fluid-text-4 pt-4 font-bold">Návod k použití</h1>
          <nav className="">
            <ul className="list-disc pl-8">
              <li>
                <a className="text-green-600 hover:underline" href="#struktura-panelu">
                  Struktura panelu
                </a>
              </li>
              <li>
                <a className="text-green-600 hover:underline" href="#sprava-rezervaci">
                  Správa rezervací
                </a>
                <ul className="list-disc pl-8">
                  <li>
                    <a href="#neschvalene" className="text-green-600 hover:underline">
                      Neschválené (žádosti)
                    </a>
                  </li>
                  <li>
                    <a href="#schvalene" className="text-green-600 hover:underline">
                      Schválené
                    </a>
                  </li>
                  <li>
                    <a className="text-green-600 hover:underline" href="#probihajici">
                      Probíhající
                    </a>
                  </li>
                  <li>
                    <a className="text-green-600 hover:underline" href="#archivovane">
                      Archivované
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="text-green-600 hover:underline" href="#sprava-vybaveni">
                  Správa vybavení
                </a>
              </li>
              <li>
                <a className="text-green-600 hover:underline" href="#sprava-kategorii">
                  Správa kategorií
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-[1em]">
          <h2 id="struktura-panelu" className="fluid-text-3 font-bold">
            1 Struktura panelu
          </h2>
          <p>
            Celý administrátorský panel pro správu rezervací, vybavení a kategorií se skládá z
            několika částí. Dashboard nabízí jednoduchý přehled o počtu různých druhů rezervací.
            Vedle toho je k dispozici jednoduchá statistika v podobě grafu zobrazujícího počty
            nových rezervací připadající na jednotlivé dny. Rozsah tohoto grafu lze změnit na týden,
            měsíc či celý rok. Pomocí tohoto grafu lze sledovat trend ve vypůjčování vybavení. Další
            důležité informace nabízí žebříček top 3 vašich vybavení. Této informace lze využít při
            pořizování/udržbě dalšího vybavení.
          </p>
          <p>
            Další stránkou v pořadí je kalendář, který nabízí přehledné zobrazení všech druhů
            rezervací. Při kliknutí na libovolnou rezervaci budete přesměrováni na náležitou stránku
            dané rezervace obsahují bližší detaily a proveditelné akce.
          </p>
          <p>
            Samotným rezervacím je dedikována celá část. Rezervace se dělí celkem do 4 typů a na
            bočním panelu jsou seřazeny tak, že neschválená rezervace přechází "dolů" do schválené
            atd.
          </p>
          <p>
            Neméně podstatnou část představuje stránka pro vybavení a kategorie sloužící k jejich
            správě. Stránka nastavení a akce slouží pro základní nastavení různých údajů a vypisuje
            seznam akcí, které běží na pozadí automaticky.
          </p>
        </div>

        <div className="flex flex-col gap-[1em]">
          <h2 id="sprava-rezervaci" className="fluid-text-3 font-bold">
            2 Správa rezervací
          </h2>
          <p>
            Rezervace se dělí celkem na 4 druhy a pro jejich přehlednou obsluhu lze použít kalendář.
          </p>
          <h3 id="neschvalene" className="fluid-text-2 font-bold">
            2.1 Neschválené (žádosti)
          </h3>
          <p>
            Neschválená žádost představuje 1. etapu celého životního cyklu každé nové rezervace.
            Tuto rezervaci si žák nemůže vytvořit v den a ani den po dni, kdy si rezervaci vytváří,
            aby bylo zajištěno, že ji správce stihne včas potvrdit. Zároveň je automaticky ošetřeno,
            aby žádná rezervace nemohla končit a ani začínat o víkednu. Vedle toho je prováděna
            kontrola překrývání rezervací, aby se nestalo, že se na nějakého žáka vybavení
            nedostane.
          </p>
          <p>
            Neschválenou žádost je nutné schválit před začátkem rezervace. Pokud nebude do určité
            doby schválena dojde k jejímu odstranění. Na detailní stránce každé rezervace je k
            dispozici základní info o vybavení, které si žák chce vypůjčit, o samotném žákovi a
            akce, které se liší u každého typu rezervace. V případě neschválené rezervace je možnost
            ji přijmout/odmítnou a přidat poznámku pro žáka, kterou lze změnit v dalších etapách
            rezervace.
          </p>
          <p>
            Procesu rozhodování o přijmutí/zamítnutí rezervace napomáhá výpis předešlých rezervací
            každého žáka.
          </p>
          <p>
            Odmítnuté rezervace nejsou nikam zaznamenávány, pouze dochází k zaslání emailu žákovi o
            odmítnutí. Při vyplnění poznámky je při odmítnutí součástí samotného emailu.
          </p>
          <p>
            Žák má možnost neschválenou i schválenou rezervaci kdykoliv odmítnout a tím uvolnit
            místo pro někoho jiného.
          </p>
          <h3 id="schvalene" className="fluid-text-2 font-bold">
            2.2 Shválené
          </h3>
          <p>
            Po schválení je žák informován prostřednictvím školního emailu a rezervace se přesouvá
            do schválených. V den zahájení rezervace je nutné po převzetí vybavení žákem nutné
            zahájit schválenou rezervaci. Před zahájím je nutné uvést počáteční technický stav
            vybavení a pro uvedení dalších detailů je zde opět možnost změnit poznámku k rezervaci.
            V případě pozdního vyzvednutí je tato informace zaznamenána v systému a použita pro
            schválování budoucích rezervací žáka.
          </p>
          <p>
            Je zde možnost zahájit rezervaci před začátkem řádného termínu, avšak je nutné si dát
            pozor, aby nedocházelo ke krytí s jinou rezervací. Toto systém automaticky neošetřuje.
          </p>
          <h3 id="probihajici" className="fluid-text-2 font-bold">
            2.3 Probíhající
          </h3>
          <p>
            Probíhající rezervace nelze z logických důvodů zrušit, ale pouze ukončit s tím že je
            nutné se přesvědčit, že vybavení bylo skutečně vráceno. Před ukončím lze vidět stav před
            vypůjčením a zadat stav vybavení při jeho navrácení. Pokud bylo vybavení vráceno v jiném
            než původním stavu, je tato informace opět zaznamenána a zobrazena všem dalším správcům
            stejně jako informace ohledně pozdního vrácení.
          </p>
          <h3 id="archivovane" className="fluid-text-2 font-bold">
            2.4 Archivované
          </h3>
          <p>
            Archivovaná rezervace představuje poslední fázi úspěšně dokončené rezervace. Každý z
            nich obsahuje klíčové informace, kterých se využívá při již zmíněném schvalovacím
            procesu. Archivované rezervace se mažou automaticky.
          </p>
        </div>

        <div className="flex flex-col gap-[1em]">
          <h2 id="sprava-vybaveni" className="fluid-text-3 font-bold">
            3 Správa vybavení
          </h2>
          <p>
            Správa vybavení probíhá přes panel vybavení. Je možné vytvořit nové, upravit ho a
            případně dočasně smazat a následně i trvale.
          </p>
          <p>
            Při vytváření nového vybavení je nutné vyplnit všechna pole až na obrázek a kategorii.
            To je z důvodu, že se v průběhu tvorby může stát, že si po pracném vyplnění všech údajů
            uvědomíte, že nemáte k dispozici obrázek nebo potřebná kategorie neexistuje. Tímto
            způsobem si můžete uložit část informací a zpětně dodat kategorii nebo obrázek.
          </p>
          <p>
            Každý kus vybavení je možné dočasně smazat. To zanemá, že vybavení je stále uloženo,
            avšak není k dispozici k vypůjčení - nezobrazuje se uživatelům. To se hodí v případě,
            kdy je nutné dát vybavení opravit bez nutnosti ho trvale smazat a následně opět
            vytvořit. Při dočasném odstranění dojde ke zrušení schválených i neschválených rezervací
            pro toto vybavení. Probíhající rezervace jsou zachovány. Této funkce lze využít i tehdy,
            kdy nějaký žák nevrátil vybavení včas a vy chcete zabránit dalšímu rezervování do doby,
            než se vrátí.
          </p>
          <p>
            Pokud si přejete kompletně odstranit určité vybavení, tak je nutné ho nejdříve dočasně
            smazat a následně trvale odstranit. V jiném případě dochází ke zbytečnému zabírání
            uložiště. Nelze trvale odstranit vybavení, na které se váže probíhající rezervace.
          </p>
        </div>

        <div className="flex flex-col gap-[1em]">
          <h2 id="sprava-kategorii" className="fluid-text-3 font-bold">
            4 Správa kategorií
          </h2>
          <p>
            Narozdíl od ostatních panelů jsou kategorie sdíleny mezi všemi správci. To je z důvodu
            zabránění vytvoření duplikátní kategorie. Zároveň je možné měnit názvy kategorií
            ostatních správců. Při změné je zaznamenán čas změny a kým byla provedene. Není možné
            mazat kategorie, které se vážou na nějaké vybavení.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Manual;
