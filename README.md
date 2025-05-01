# Rezervační systém pro zápůjčku školní techniky

Tato nevim webová aplikace nabízí studentům VOŠ a SPŠE Plzeň přehled o nabízeném školním vybavení k vypůjčení, které si mohou pro sebe na specifikované časové období rezervovat.

Pro administrátory vybavení se jedná o řešení nabízející přehled o právě probíhajících či proběhlých výpůjčkách, možnost přidat či odebrat zařízení a rozhodnout, zda schválí či odmítnou rezervaci na základě historie výpůjček daného studenta.

## Obsah

- [Použité nástroje](#použité-nástroje)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Nasazení a správa](#nasazení-a-správa)
  - [Jiné](#jiné)
- [Lokální vývoj](#lokální-vývoj)
  - [Požadavky](#požadavky)
  - [Instalace vývojového prostředí](#instalace-vývojového-prostředí)
  - [Konfigurace LDAP](#konfigurace-ldap)
- [Nasazení na server](#nasazení-na-server)
- [Struktura repozitáře](#struktura-repozitáře)
- [Design](#design)
- [Role uživatelů a jejich možnosti](#role-uživatelů-a-jejich-možnosti)
  - [Uživatel](#uživatel)
  - [Administrátor](#administrátor)

## Použité nástroje

### Frontend

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Backend

- [Laravel](https://laravel.com/)
- [PHPUnit](https://phpunit.de/)
- [LDAPRecord](https://ldaprecord.com/)

### Nasazení a správa

- [Docker](https://www.docker.com/)

### Jiné

- [Inertia.js](https://inertiajs.com/)

## Lokální vývoj

### Požadavky:

#### Windows Subsystem for Linux 2 (WSL2)

- WSL2 umožňuje spouštět Linux prostředí přímo ve Windows bez virtualizace.

```bash
# Otevřete PowerShell jako správce a spusťte:
wsl --install

# Restartujte počítač
```

#### Ubuntu na WSL2 (pokud nebylo automaticky staženo)

```
1. Otevřete Microsoft Store
2. Vyhledejte "Ubuntu"
3. Nainstalujte nejnovější verzi Ubuntu
4. Spusťte Ubuntu a dokončete nastavení uživatelského účtu
```

#### Docker Desktop

1. Stáhněte a nainstalujte [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. V nastavení Docker Desktop povolte integraci s WSL2
3. Restartujte Docker Desktop

### Konfigurace gitu

V Ubuntu na WSL2 pravděpodobně není stažený git a je nutné ho stáhnout a konfigurovat

```bash
# Aktualizace
sudo apt update
sudo apt upgrade -y

# Instalace Git
sudo apt-get install git -y

# Konfigurace gitu
git config --global user.name "Vaše jméno"
git config --global user.email "vas.email@example.com"
```

### Instalace vývojového prostředí

- aplikace si sama spouští vývojářský server vite, tedy není nutné ho ručně zapínat pomocí `npm run dev`
- díky vývojářskému serveru není nutné po provedení změn na frontendu refreshovat stránku, jelikož se změny automaticky projeví

```bash
# Naklonujte repozitář
git clone https://gitlab.spseplzen.cz/studentske-projekty/projekty-2024-2025/mtp5/5_rezervacni_system.git

cd 5_rezervacni_system

# Oprava oprávnění
chmod +x fix-permissions.sh
sudo ./fix-permissions.sh

# Sestavte Docker obrazy a spusťte
docker-compose up -d --build

# Setup
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh
```

### Konfigurace LDAP

Pro lokální vývoj je vytvořen ldap, který je spravován pomocí phpldapadmin a snaží se kopírovat strukturu toho školního.

#### Přihlášení do phpLDAPadmin:

- URL: http://localhost:8081

- Login DN: cn=admin,dc=spse,dc=local

- Heslo: admin

#### Import dat:

V phpLDAPadmin klikněte na tlačítko import a vložte zde zkopírovaný obsah souboru `/openldap/ldif/01-testdata.ldif`

#### Dostupní uživatelé

Nyný se můžeze přihlásit do aplikace pomocí následujících účtů:

```
Student1:
  Uživatelské jméno: student1
  Heslo: password

Student2:
  Uživatelské jméno: student2
  Heslo: password

Učitel1:
  Uživatelské jméno: teacher1
  Heslo: password

Učitel2:
  Uživatelské jméno: teacher2
  Heslo: password
```

### Přístup ke stránce

Stránka je přístupná na: http://localhost:8000

Správa ldapu: http://localhost:8081

Pro debugování: http://localhost:8000/telescope

phpMyAdmin: http://localhost:8082 (uživatel: root, heslo: secret)

### Užitečné příkazy

#### Docker compose:

```bash
# Sestavení všech kontejnerů (po změnách v Dockerfile)
docker-compose build

# Spuštění všech kontejnerů
docker-compose up -d

# Zastavení všech kontejnerů
docker-compose down

# Zobrazení logů
docker-compose logs -f

# Zobrazení logů konkrétního kontejneru
docker-compose logs -f app
```

#### Laravel:

```bash
# Výpis všech dostupných příkazů
docker-compose exec app php artisan

# Vyčištění cache
docker-compose exec app php artisan cache:clear

# Spuštění nových migrací při změné databázové struktury/vyčištění dat
docker-compose exec app php artisan migrate:fresh

# Spuštění testů
docker-compose exec app php artisan test

# Po přidání nové pojmenované routy do routeru:
docker-compose exec app php artisan ziggy:generate

# Naformátování všech php souborů:
docker-compose exec app ./vendor/bin/pint

# Spuštění plánovaných akcí lokálně
docker-compose exec app php artisan schedule:work
```

## Nasazení na server

Nasazení aplikace by mělo být provedeno na server s OS Linux. Základním předpokladem je stažený a nakonfigurovaný git (je ukázáno v kapitole o lokálním vývoji.)

### Stažení repozitáře

```bash
git clone https://gitlab.spseplzen.cz/studentske-projekty/projekty-2024-2025/mtp5/5_rezervacni_system.git
```

### Konfigurace

Vytvoření konfiguračního souboru podle šablony

```bash
cp .env.production.example .env.production
```

Následně změňte hodnoty pro databázi (heslo, název) podle údajů v souboru `docker-compose.prod.yml`

Změňte heslo a název databáze v `docker-compose.prod.yml` podle údajů uvedených v `.env.production` (silné a bezpečné heslo!)

Dále lze nastavit doménu, název aplikace a jiné důležité hodnoty.

### Spuštění

```bash
# Oprava oprávnění
chmod +x fix-permissions-prod.sh
sudo ./fix-permissions-prod.sh

# Sestavení Docker obrazů
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

To je vše. Celý setup automaticky generuje klíč aplikace, instaluje potřebné závislosti pro produkci, optimalizuje celý build. Kromě toho automaticky spouští na pozadí cron, který provádí automatické plánované akce. Supervisor se stará o automatické obnovení fronty v případě jejího pádu.

Aplikace je dostupná pod uvedenou doménou (defaultně na vlastním serveru bez dalšího nastavení: http://localhost)

### Doporučení

Tato verze neslouží pro vývoj. Pokud si přejete provádět změny, využijte verzi pro development a doporučený postup pro zprovoznění. Doporučuje se dělat změny pouze souborů týkajících se dockeru, serveru a ostatních služeb jako cron nebo supervisor.

```bash
# Při změně Dockerfile.prod
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Užitečné příkazy

Tyto příkazy se primárně týkají debugování aplikace

```bash
# Vyčištění chache aplikace
docker compose -f docker-compose.prod.yml exec app php artisan config:clear

# Čistý start
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build

# Nginx logy
docker compose -f docker-compose.prod.yml logs nginx

# Logy aplikace
docker compose -f docker-compose.prod.yml logs -f app

```

## Struktura repozitáře

Podrobné informace o adresářové struktuře najdete v [oficiální dokumentaci Laravel](https://laravel.com/docs/11.x/structure).

## Design

Odkaz na design vytvořený v programu Figma: [design](https://www.figma.com/design/5kTOIMVwJlm99yDc22ZYZQ/Rezerva%C4%8Dn%C3%AD-syst%C3%A9m-%C5%A1koln%C3%AD-techniky?node-id=0-1&t=e642irMyhE9VMgLD-1)

## Role uživatelů a jejich možnosti

### Uživatel

- **Přihlášení:** Uživatel se přihlásí pomocí svého školního jména a hesla.

- **Seznam vybavení:** Uživatel bude mít přístup k seznamu dostupné techniky. Každá položka obsahuje náhledový obrázek a název vybavení.

- **Zobrazení dostupnosti:** Na stránce detailu vybavení uvidí uživatel vedle obrázku a popisu vybavení i kalendář s označenými dostupnými a rezervovanými termíny. Pomocí kalendáře může zvolit požadované datum začátku a konce zápůjčky.

- **Rezervace:** Uživatel vytvoří žádost o rezervaci. Po odeslání bude žádost automaticky odeslána administrátorovi ke schválení. Uživatel bude průběžně informován o stavu žádosti (schválena/odmítnuta).

- **Historie zápůjček:** Každý uživatel uvidí historii svých předchozích rezervací včetně dat zápůjček a stavu vráceného vybavení.

- **Oznámení:** Systém může posílat upozornění na blížící se konec rezervace a další relevantní informace (např. nevrácení včas).

### Administrátor

- **Přehled žádostí:** Administrátor bude mít přístup k seznamu všech nových žádostí o zapůjčení, včetně podrobností jako jméno studenta, název vybavení, vybraný termín, a historie předchozích zápůjček daného studenta.

- **Schválení/odmítnutí žádosti:** Administrátor bude mít možnost žádost schválit nebo odmítnout.

- **Správa aktuálních rezervací:** Administrátor uvidí přehled probíhajících a nadcházejících rezervací. Může ukončit probíhající rezervace předčasně, pokud je to nutné.

- **Archiv rezervací:** Administrátor bude mít přístup k archivu všech ukončených rezervací, kde budou uvedeny detaily jako zařízení, student a stav vráceného vybavení. U poškozeného nebo ztraceného vybavení může administrátor přidat poznámku.

- **Správa vybavení:** Administrátor bude mít možnost přidávat nové vybavení do systému, včetně nahrání obrázku, specifikací a popisu. Také bude moct odebírat vybavení, které již není k dispozici.
