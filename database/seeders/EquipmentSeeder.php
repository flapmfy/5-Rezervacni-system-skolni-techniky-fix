<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $equipments = [
            [
                'category_id' => 1,
                'image_path' => 'images/test-kamera.webp',
                'manufacturer' => 'Canon',
                'name' => 'Kamera',
                'description' => 'Digitální fotoaparát - kompakt, se sáňkami pro blesk, se stativovým závitem, vhodný pro video, bez hledáčku, elektronická, optická stabilizace obrazu, 1" snímač, rozlišení snímače 20,1 Mpx, maximální rozlišení videa 4K, uhlopříčka displeje 3", rozlišení displeje 0,921 Mpx, dotykový, otočný/výklopný displej s živým náhledem (Live View), podporovaný formát RAW, JPEG a DCF, SD, SDHC a SDXC paměťová karta, rozhraní USB 2.0, bezdrátové rozhraní Wi-Fi a bezdrátové rozhraní Bluetooth, micro HDMI a jack 3,5 mm součástí, rozměry 6 × 10,55 × 4,35 cm (V×Š×H), hmotnost 294 g',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2,
                'image_path' => 'images/test-fotak.webp',
                'manufacturer' => 'Canon',
                'name' => 'Foťák',
                'description' => 'Digitální fotoaparát - bezzrcadlovka, se sáňkami pro blesk, se stativovým závitem, vhodný pro video, s výměnnými objektivy, elektronický hledáček, optická stabilizace obrazu, bajonet Canon RF, Full Frame snímač, rozlišení snímače 26,2 Mpx, maximální rozlišení videa 4K, uhlopříčka displeje 3", rozlišení displeje 1,04 Mpx, dotykový, otočný/výklopný displej s živým náhledem (Live View), podporovaný formát RAW a JPEG, SD, SDHC a SDXC paměťová karta, maximální velikost SD karty 512 GB, rozhraní USB 3.2 Gen 1 (USB 3.0), bezdrátové rozhraní Wi-Fi a bezdrátové rozhraní Bluetooth, mini HDMI, externí mikrofon a jack 3,5 mm součástí, rozměry 8,5 × 13,25 × 7 cm (V×Š×H), hmotnost 485 g',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3,
                'image_path' => 'images/test-mikrofon.webp',
                'manufacturer' => 'Shure',
                'name' => 'Mikrofon',
                'description' => 'Mikrofon - stolní, připojení skrze USB, délka kabelu 1,8 m, kondenzátorový, směrové snímání, frekvence od 20 do 20000 Hz, impedance 100 Ohm, stojánek v balení, vhodný pro mluvené slovo',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 4,
                'image_path' => 'images/test-stativ.webp',
                'manufacturer' => 'Canon',
                'name' => 'Stativ',
                'description' => 'Stativ - na digitální fotoaparát, 1/4" stativový závit, dvoucestná (2D / videohlava) hlava, materiál hliník, transportní výška 55 cm, maximální výška 157 cm, hmotnost 1,3 kg',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 4,
                'image_path' => 'images/test-stativ.webp',
                'manufacturer' => 'Canon',
                'name' => 'Stativ s příliš dlouhým názvem pro otestování zalamování příliš dlouhého textu',
                'description' => 'Stativ - na digitální fotoaparát, 1/4" stativový závit, dvoucestná (2D / videohlava) hlava, materiál hliník, transportní výška 55 cm, maximální výška 157 cm, hmotnost 1,3 kg',
                'room' => '2201',
                'quantity' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3,
                'image_path' => 'images/test-mikrofon.webp',
                'manufacturer' => 'Shure',
                'name' => 'Mikrofon',
                'description' => 'Mikrofon - stolní, připojení skrze USB, délka kabelu 1,8 m, kondenzátorový, směrové snímání, frekvence od 20 do 20000 Hz, impedance 100 Ohm, stojánek v balení, vhodný pro mluvené slovo',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3,
                'image_path' => 'images/test-mikrofon.webp',
                'manufacturer' => 'Shure',
                'name' => 'Mikrofon',
                'description' => 'Mikrofon - stolní, připojení skrze USB, délka kabelu 1,8 m, kondenzátorový, směrové snímání, frekvence od 20 do 20000 Hz, impedance 100 Ohm, stojánek v balení, vhodný pro mluvené slovo',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3,
                'image_path' => 'images/test-mikrofon.webp',
                'manufacturer' => 'Shure',
                'name' => 'Mikrofon',
                'description' => 'Mikrofon - stolní, připojení skrze USB, délka kabelu 1,8 m, kondenzátorový, směrové snímání, frekvence od 20 do 20000 Hz, impedance 100 Ohm, stojánek v balení, vhodný pro mluvené slovo',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'image_path' => 'images/test-kamera.webp',
                'manufacturer' => 'Canon',
                'name' => 'Kamera',
                'description' => 'Digitální fotoaparát - kompakt, se sáňkami pro blesk, se stativovým závitem, vhodný pro video, bez hledáčku, elektronická, optická stabilizace obrazu, 1" snímač, rozlišení snímače 20,1 Mpx, maximální rozlišení videa 4K, uhlopříčka displeje 3", rozlišení displeje 0,921 Mpx, dotykový, otočný/výklopný displej s živým náhledem (Live View), podporovaný formát RAW, JPEG a DCF, SD, SDHC a SDXC paměťová karta, rozhraní USB 2.0, bezdrátové rozhraní Wi-Fi a bezdrátové rozhraní Bluetooth, micro HDMI a jack 3,5 mm součástí, rozměry 6 × 10,55 × 4,35 cm (V×Š×H), hmotnost 294 g',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'image_path' => 'images/test-kamera.webp',
                'manufacturer' => 'Canon',
                'name' => 'Kamera',
                'description' => 'Digitální fotoaparát - kompakt, se sáňkami pro blesk, se stativovým závitem, vhodný pro video, bez hledáčku, elektronická, optická stabilizace obrazu, 1" snímač, rozlišení snímače 20,1 Mpx, maximální rozlišení videa 4K, uhlopříčka displeje 3", rozlišení displeje 0,921 Mpx, dotykový, otočný/výklopný displej s živým náhledem (Live View), podporovaný formát RAW, JPEG a DCF, SD, SDHC a SDXC paměťová karta, rozhraní USB 2.0, bezdrátové rozhraní Wi-Fi a bezdrátové rozhraní Bluetooth, micro HDMI a jack 3,5 mm součástí, rozměry 6 × 10,55 × 4,35 cm (V×Š×H), hmotnost 294 g',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'image_path' => 'images/test-kamera.webp',
                'manufacturer' => 'Canon',
                'name' => 'Kamera',
                'description' => 'Digitální fotoaparát - kompakt, se sáňkami pro blesk, se stativovým závitem, vhodný pro video, bez hledáčku, elektronická, optická stabilizace obrazu, 1" snímač, rozlišení snímače 20,1 Mpx, maximální rozlišení videa 4K, uhlopříčka displeje 3", rozlišení displeje 0,921 Mpx, dotykový, otočný/výklopný displej s živým náhledem (Live View), podporovaný formát RAW, JPEG a DCF, SD, SDHC a SDXC paměťová karta, rozhraní USB 2.0, bezdrátové rozhraní Wi-Fi a bezdrátové rozhraní Bluetooth, micro HDMI a jack 3,5 mm součástí, rozměry 6 × 10,55 × 4,35 cm (V×Š×H), hmotnost 294 g',
                'room' => '3301',
                'quantity' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($equipments as $equipment) {
            Equipment::create($equipment);
        }
    }
}
