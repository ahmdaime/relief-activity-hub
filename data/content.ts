
import { Activity, Question, SimpulanData } from '../types';
import { BookOpen, Calculator, FlaskConical, Type, Palette, Brain, ScrollText, Globe } from 'lucide-react';

export const ACTIVITIES: Activity[] = [
    {
        id: 'simpulan-bahasa',
        title: 'Simpulan Bahasa',
        icon: BookOpen,
        subject: 'Bahasa Melayu',
        duration: 20,
        difficulty: 'Sederhana',
        type: 'quiz',
        description: 'Jawab soalan simpulan bahasa secara bergilir (30 Pusingan). Salah jawab, tolak markah!'
    },
    {
        id: 'peribahasa-challenge',
        title: 'Peribahasa',
        icon: ScrollText,
        subject: 'Bahasa Melayu',
        duration: 20,
        difficulty: 'Mencabar',
        type: 'quiz',
        description: 'Uji minda dengan 30 peribahasa melayu! Giliran adil. Penalti jika salah.'
    },
    {
        id: 'math-quickfire',
        title: 'Math Quick Fire',
        icon: Calculator,
        subject: 'Matematik',
        duration: 10,
        difficulty: 'Mencabar',
        type: 'math',
        description: 'Siapa cepat dia dapat! Selesaikan masalah matematik (30 Pusingan). Awas penalti!'
    },
    {
        id: 'sains-fakta',
        title: 'Sains: Benar/Palsu',
        icon: FlaskConical,
        subject: 'Sains',
        duration: 12,
        difficulty: 'Sederhana',
        type: 'science',
        description: 'Tentukan fakta sains Benar/Palsu (30 Pusingan). Markah ditolak jika salah.'
    },
    {
        id: 'word-scramble',
        title: 'Susun Huruf',
        icon: Type,
        subject: 'B. Inggeris / BM',
        duration: 15,
        difficulty: 'Mudah',
        type: 'scramble',
        description: 'Susun semula huruf menjadi perkataan yang betul. Jangan salah eja!'
    },
    {
        id: 'teka-negara',
        title: 'Teka Negara',
        icon: Globe,
        subject: 'Geografi',
        duration: 15,
        difficulty: 'Sederhana',
        type: 'hangman',
        description: 'Teka nama negara dengan meneka huruf satu persatu. 195 negara menanti!'
    },
];

// DATASETS
export const SIMPULAN_BAHASA_DATA: SimpulanData[] = [
    { idiom: "Bagai aur dengan tebing", meaning: "Sangat rapat atau tolong-menolong", example: "Penduduk kampung itu hidup bagai aur dengan tebing." },
    { idiom: "Ajak-ajak ayam", meaning: "Ajakan yang tidak bersungguh-sungguh", example: "Dia hanya ajak-ajak ayam, janganlah awak percaya." },
    { idiom: "Akal kancil", meaning: "Orang yang pandai menipu atau tipu helah", example: "Peniaga itu mempunyai akal kancil untuk melariskan jualannya." },
    { idiom: "Alas perut", meaning: "Makan sedikit untuk menghilangkan lapar", example: "Jamahlah kuih ini sedikit sebagai alas perut." },
    { idiom: "Alim-alim kucing", meaning: "Pura-pura baik", example: "Jangan percaya sangat, dia itu cuma alim-alim kucing." },
    { idiom: "Ambil angin", meaning: "Bersiar-siar untuk melapangkan fikiran", example: "Petang nanti kita pergi ambil angin di taman." },
    { idiom: "Ambil berat", meaning: "Memberi perhatian atau prihatin", example: "Cikgu Aime sangat ambil berat tentang kehadiran murid." },
    { idiom: "Anak emas", meaning: "Orang yang sangat disayangi oleh majikan atau keluarga", example: "Ali ialah anak emas di syarikat itu kerana kerajinannya." },
    { idiom: "Angkat bakul", meaning: "Suka memuji diri sendiri", example: "Sikapnya yang suka angkat bakul menyebabkan kawan-kawan meluat." },
    { idiom: "Angkat kaki", meaning: "Melarikan diri atau meninggalkan sesuatu tempat", example: "Pencuri itu segera angkat kaki apabila polis tiba." },
    { idiom: "Atas pagar", meaning: "Tidak menyebelahi mana-mana pihak", example: "Dalam perbalahan itu, dia mengambil sikap atas pagar." },
    { idiom: "Ayam tambatan", meaning: "Orang harapan dalam sesuatu pasukan", example: "Ronaldo ialah ayam tambatan pasukan itu." },
    { idiom: "Bahasa halus", meaning: "Kata-kata yang sopan dan lembut", example: "Gunakanlah bahasa halus apabila bercakap dengan orang tua." },
    { idiom: "Batu api", meaning: "Orang yang suka menghasut", example: "Jangan jadi batu api yang memecahbelahkan persahabatan mereka." },
    { idiom: "Batu loncatan", meaning: "Sesuatu yang dijadikan alat untuk mencapai hajat", example: "Pekerjaan ini hanyalah batu loncatan untuk jawatan lebih tinggi." },
    { idiom: "Bau-bau bacang", meaning: "Talian persaudaraan yang jauh", example: "Saya dengan dia ada bau-bau bacang." },
    { idiom: "Bekas tangan", meaning: "Hasil kerja tangan seseorang", example: "Lukisan cantik ini adalah bekas tangan abang saya." },
    { idiom: "Bendera setengah tiang", meaning: "Tanda berdukacita atas kematian pembesar", example: "Bendera dikibarkan separuh tiang sempena kemangkatan Raja." },
    { idiom: "Berat hati", meaning: "Enggan atau tidak sampai hati melakukan sesuatu", example: "Ibu berat hati hendak melepaskan anaknya pergi jauh." },
    { idiom: "Berat mulut", meaning: "Pendiam atau susah hendak bercakap", example: "Budak yang berat mulut itu jarang bergaul dengan orang." },
    { idiom: "Berat tulang", meaning: "Malas bekerja", example: "Jangan jadi berat tulang, tolonglah ibu di dapur." },
    { idiom: "Beri muka", meaning: "Terlalu memanjakan seseorang", example: "Jangan terlalu beri muka kepada anak, nanti naik kepala." },
    { idiom: "Bermuka dua", meaning: "Tidak jujur atau menyebelahi kedua-dua pihak", example: "Sikap bermuka dua Ahmad akhirnya terbongkar." },
    { idiom: "Besar hati", meaning: "Berasa gembira atau bangga", example: "Kami berbesar hati menerima kunjungan tuan." },
    { idiom: "Besar kepala", meaning: "Degil atau sukar menerima nasihat", example: "Murid yang besar kepala itu sering melanggar peraturan." },
    { idiom: "Bidan terjun", meaning: "Orang yang disuruh melakukan sesuatu secara mendadak", example: "Saya terpaksa jadi bidan terjun mengacara majlis itu." },
    { idiom: "Bodoh sepat", meaning: "Kelihatan bodoh tetapi sebenarnya cerdik", example: "Dia itu bodoh sepat, dalam diam dia siapkan kerja." },
    { idiom: "Bongkok sabut", meaning: "Bongkok orang tua", example: "Nenek berjalan bongkok sabut kerana usianya lanjut." },
    { idiom: "Buah fikiran", meaning: "Pendapat atau idea", example: "Sila berikan buah fikiran anda dalam mesyuarat nanti." },
    { idiom: "Buah mulut", meaning: "Perkara yang menjadi sebutan ramai", example: "Kejadian itu menjadi buah mulut penduduk kampung." },
    { idiom: "Buaya darat", meaning: "Lelaki yang suka menukar teman wanita", example: "Jauhi lelaki buaya darat itu." },
    { idiom: "Buku lima", meaning: "Penumbuk", example: "Dia menunjuk buku lima tanda marah." },
    { idiom: "Bulat hati", meaning: "Tekad atau bersungguh-sungguh", example: "Dia sudah bulat hati untuk belajar di luar negara." },
    { idiom: "Buruk siku", meaning: "Meminta balik barang yang telah diberi", example: "Jangan buruk siku, hadiah itu sudah jadi milik dia." },
    { idiom: "Busuk hati", meaning: "Hati yang jahat atau dengki", example: "Orang yang busuk hati tidak akan tenang hidupnya." },
    { idiom: "Buta huruf", meaning: "Tidak tahu membaca dan menulis", example: "Kelas dewasa diadakan untuk membasmi buta huruf." },
    { idiom: "Cacing kepanasan", meaning: "Gelisah atau tidak tentu arah", example: "Dia gelisah seperti cacing kepanasan menunggu keputusan." },
    { idiom: "Cahaya mata", meaning: "Anak", example: "Pasangan itu baru menimang cahaya mata pertama." },
    { idiom: "Cakap besar", meaning: "Suka meninggi diri atau bermegah-megah", example: "Dia suka cakap besar kononnya dia kaya." },
    { idiom: "Cakar ayam", meaning: "Tulisan yang buruk dan sukar dibaca", example: "Tulisan doktor itu seperti cakar ayam." },
    { idiom: "Campur tangan", meaning: "Masuk campur dalam urusan orang lain", example: "Jangan campur tangan dalam hal rumah tangga mereka." },
    { idiom: "Cangkul angin", meaning: "Melakukan perbuatan yang sia-sia", example: "Nasihat itu ibarat cangkul angin kerana tidak didengar." },
    { idiom: "Curi tulang", meaning: "Mengelak daripada bekerja", example: "Pekerja itu dimarahi kerana asyik curi tulang." },
    { idiom: "Darah daging", meaning: "Anak kandung atau saudara mara sendiri", example: "Walaupun jahat, dia tetap darah daging saya." },
    { idiom: "Durian runtuh", meaning: "Keuntungan yang diperoleh tanpa disangka-sangka", example: "Dia dapat durian runtuh apabila menang cabutan bertuah." },
    { idiom: "Gaji buta", meaning: "Menerima gaji tanpa bekerja bersungguh-sungguh", example: "Kerani itu makan gaji buta, asyik main telefon sahaja." },
    { idiom: "Garam hidup", meaning: "Pengalaman hidup", example: "Datuk banyak makan garam hidup berbanding kamu." },
    { idiom: "Gelap mata", meaning: "Hilang pertimbangan kerana wang atau marah", example: "Dia gelap mata melihat wang rasuah yang banyak itu." },
    { idiom: "Hati batu", meaning: "Degil atau tidak menaruh belas kasihan", example: "Susah menasihati orang yang hati batu ini." },
    { idiom: "Hidung tinggi", meaning: "Sombong atau angkuh", example: "Sejak kaya, dia menjadi hidung tinggi." },
    { idiom: "Hilang akal", meaning: "Bingung atau tidak tahu apa perlu dibuat", example: "Dia seperti hilang akal apabila rumahnya terbakar." },
    { idiom: "Ikat perut", meaning: "Menahan lapar kerana hendak berjimat", example: "Kami terpaksa ikat perut pada hujung bulan." },
    { idiom: "Iri hati", meaning: "Cemburu atau dengki", example: "Jangan iri hati dengan kejayaan orang lain." },
    { idiom: "Jalan buntu", meaning: "Tidak mendapat penyelesaian", example: "Perbincangan itu menemui jalan buntu." },
    { idiom: "Kacang hantu", meaning: "Orang yang jahat atau pengacau", example: "Budak kacang hantu itu selalu mengganggu kelas." },
    { idiom: "Kaki ayam", meaning: "Tidak memakai kasut", example: "Adik berlari kaki ayam di halaman rumah." },
    { idiom: "Kaki bangku", meaning: "Tidak pandai bermain bola", example: "Dia kaki bangku, sebab itu dia jadi penjaga gol sahaja." },
    { idiom: "Kaki botol", meaning: "Suka minum minuman keras", example: "Jauhi tabiat menjadi kaki botol." },
    { idiom: "Kecil hati", meaning: "Tersinggung atau merajuk", example: "Ibu kecil hati dengan kata-kata kamu tadi." },
    { idiom: "Kepala angin", meaning: "Perangai yang kerap berubah-ubah", example: "Susah berkawan dengan orang kepala angin." },
    { idiom: "Kera sumbang", meaning: "Orang yang tidak suka bergaul", example: "Jangan jadi kera sumbang, bergaullah dengan jiran." },
    { idiom: "Kuku besi", meaning: "Pemerintahan yang kejam atau keras", example: "Rakyat menentang pemerintahan kuku besi itu." },
    { idiom: "Langkah seribu", meaning: "Lari sekuat hati kerana takut", example: "Mereka buka langkah seribu apabila dikejar anjing." },
    { idiom: "Lepas tangan", meaning: "Tidak mahu bertanggungjawab", example: "Jangan lepas tangan setelah membuat kerosakan." },
    { idiom: "Lintah darat", meaning: "Mengambil keuntungan berlebihan (bunga tinggi)", example: "Peminjam wang itu bersikap seperti lintah darat." },
    { idiom: "Makan angin", meaning: "Pergi bercuti atau bersiar-siar", example: "Kami sekeluarga akan pergi makan angin di Langkawi." },
    { idiom: "Makan suap", meaning: "Menerima rasuah", example: "Pegawai itu ditangkap kerana makan suap." },
    { idiom: "Mandi peluh", meaning: "Bekerja dengan kuat", example: "Ayah mandi peluh di sawah demi menyara keluarga." },
    { idiom: "Masuk akal", meaning: "Boleh diterima oleh fikiran waras", example: "Alasan dia lewat ke sekolah tidak masuk akal." },
    { idiom: "Mata duitan", meaning: "Mementingkan wang semata-mata", example: "Wanita itu dituduh mata duitan." },
    { idiom: "Mulut murai", meaning: "Orang yang suka bercakap banyak", example: "Diam sikit, jangan jadi mulut murai." },
    { idiom: "Musuh dalam selimut", meaning: "Orang dipercayai yang mengkhianati kita", example: "Berhati-hati dengan musuh dalam selimut." },
    { idiom: "Naik angin", meaning: "Menjadi marah", example: "Cikgu naik angin apabila murid bising." },
    { idiom: "Nyawa-nyawa ikan", meaning: "Hampir mati", example: "Ikan itu sudah nyawa-nyawa ikan." },
    { idiom: "Otak udang", meaning: "Bodoh atau bebal", example: "Jangan jadi otak udang, belajarlah bersungguh-sungguh." },
    { idiom: "Panjang tangan", meaning: "Suka mencuri", example: "Pekerja panjang tangan itu telah diberhentikan." },
    { idiom: "Pasang telinga", meaning: "Mendengar dengan teliti", example: "Pasang telinga baik-baik semasa guru mengajar." },
    { idiom: "Patah hati", meaning: "Kecewa", example: "Dia patah hati setelah gagal dalam ujian." },
    { idiom: "Pekak badak", meaning: "Pura-pura tidak mendengar", example: "Dipanggil berkali-kali pun dia buat pekak badak." },
    { idiom: "Puteri lilin", meaning: "Wanita yang tidak tahan panas", example: "Dia tidak mahu berjemur kerana dia puteri lilin." },
    { idiom: "Putih mata", meaning: "Kecewa kerana harapan tidak tercapai", example: "Ali putih mata apabila tiket konsert habis dijual." },
    { idiom: "Rabun ayam", meaning: "Penglihatan kabur pada waktu senja", example: "Datuk tidak memandu malam kerana rabun ayam." },
    { idiom: "Rambang mata", meaning: "Sukar membuat pilihan kerana banyak", example: "Saya rambang mata melihat jualan murah itu." },
    { idiom: "Ringan tulang", meaning: "Rajin bekerja atau menolong", example: "Jadilah orang yang ringan tulang membantu ibu bapa." },
    { idiom: "Tanda mata", meaning: "Hadiah sebagai kenang-kenangan", example: "Terimalah cenderahati ini sebagai tanda mata." },
    { idiom: "Telinga lintah", meaning: "Pendengaran yang sangat tajam", example: "Dia telinga lintah, bisik pun dia boleh dengar." },
    { idiom: "Tidur-tidur ayam", meaning: "Tidur yang tidak lena", example: "Saya hanya tidur-tidur ayam kerana bimbangkan anak sakit." },
    { idiom: "Tulang belakang", meaning: "Orang yang menjadi kekuatan kumpulan", example: "Dia adalah tulang belakang pasukan bola sepak sekolah." }
];

export const PERIBAHASA_DATA: SimpulanData[] = [
    { idiom: "Melentur buluh biarlah dari rebungnya", meaning: "Mendidik anak biarlah sejak mereka kecil lagi", example: "Ibu bapa perlu mengajar nilai murni sejak kecil, bak kata pepatah melentur buluh biarlah dari rebungnya." },
    { idiom: "Bagai kacang lupakan kulit", meaning: "Orang yang tidak mengenang budi", example: "Janganlah jadi seperti bagai kacang lupakan kulit apabila sudah berjaya nanti." },
    { idiom: "Di mana bumi dipijak, di situ langit dijunjung", meaning: "Mengikut adat resam di tempat kita berada", example: "Apabila merantau ke negara orang, ingatlah pepatah di mana bumi dipijak, di situ langit dijunjung." },
    { idiom: "Sedikit-sedikit, lama-lama jadi bukit", meaning: "Sabar dan tekun mengerjakan sesuatu, akhirnya berhasil juga", example: "Ali menabung setiap hari seringgit, kerana dia percaya sedikit-sedikit, lama-lama jadi bukit." },
    { idiom: "Sediakan payung sebelum hujan", meaning: "Berwaspada sebelum ditimpa kesusahan", example: "Kita perlu menabung untuk masa depan ibarat sediakan payung sebelum hujan." },
    { idiom: "Bagai isi dengan kuku", meaning: "Hubungan persahabatan yang sangat erat", example: "Persahabatan mereka bagai isi dengan kuku, ke mana sahaja pasti bersama." },
    { idiom: "Bagai melepaskan batuk di tangga", meaning: "Membuat sesuatu kerja dengan tidak bersungguh-sungguh", example: "Janganlah buat kerja sekolah bagai melepaskan batuk di tangga." },
    { idiom: "Harapkan pagar, pagar makan padi", meaning: "Orang yang dipercayai mengkhianati kita", example: "Dia mencuri duit syarikat, sungguh tak sangka harapkan pagar, pagar makan padi." },
    { idiom: "Bagai tikus membaiki labu", meaning: "Orang yang cuba membaiki sesuatu tetapi makin merosakkannya", example: "Ali cuba membaiki radio itu tetapi rosak teruk, ibarat bagai tikus membaiki labu." },
    { idiom: "Seperti katak di bawah tempurung", meaning: "Orang yang cetek pengetahuannya", example: "Jangan jadi seperti katak di bawah tempurung, rajinlah membaca." },
    { idiom: "Alang-alang menyeluk pekasam biar sampai ke pangkal lengan", meaning: "Melakukan sesuatu biarlah sehingga berjaya", example: "Teruskan usaha kamu, alang-alang menyeluk pekasam biar sampai ke pangkal lengan." },
    { idiom: "Bagai mencurah air ke daun keladi", meaning: "Nasihat yang sia-sia", example: "Menasihati dia ibarat bagai mencurah air ke daun keladi." },
    { idiom: "Indah khabar dari rupa", meaning: "Perkhabaran yang dilebih-lebihkan dari keadaan sebenar", example: "Keadaan di sana tidaklah secantik yang diceritakan, indah khabar dari rupa." },
    { idiom: "Masa itu emas", meaning: "Masa sangat berharga", example: "Gunakanlah masa lapang dengan berfaedah kerana masa itu emas." },
    { idiom: "Biar mati anak, jangan mati adat", meaning: "Adat resam yang mesti dipertahankan", example: "Masyarakat lama berpegang teguh pada prinsip biar mati anak, jangan mati adat." },
    { idiom: "Ukur baju di badan sendiri", meaning: "Berbelanja mengikut kemampuan diri", example: "Jangan berhutang keliling pinggang, ukurlah baju di badan sendiri." },
    { idiom: "Sehari selembar benang, lama-lama menjadi kain", meaning: "Usaha gigih yang berterusan akan membawa kejayaan", example: "Walaupun lambat, projek itu siap juga berkat prinsip sehari selembar benang, lama-lama menjadi kain." },
    { idiom: "Kalau tidak dipecahkan ruyung, manakan dapat sagunya", meaning: "Kejayaan tidak akan datang tanpa usaha", example: "Kita mesti berusaha keras jika mahu berjaya, kalau tidak dipecahkan ruyung, manakan dapat sagunya." },
    { idiom: "Bagai bulan dipagar bintang", meaning: "Kecantikan gadis yang tiada tandingannya", example: "Kecantikan pengantin perempuan itu ibarat bagai bulan dipagar bintang." },
    { idiom: "Bagai anjing dengan kucing", meaning: "Sering bergaduh apabila berjumpa", example: "Adik-beradik itu asyik bergaduh bagai anjing dengan kucing." },
    { idiom: "Genggam bara api biar sampai jadi arang", meaning: "Membuat sesuatu pekerjaan yang susah hendaklah sabar sehingga berjaya", example: "Jangan mudah putus asa, genggam bara api biar sampai jadi arang." },
    { idiom: "Yang bulat tidak datang menggolek, yang pipih tidak datang melayang", meaning: "Rezeki tidak datang tanpa usaha", example: "Berusahalah mencari rezeki kerana yang bulat tidak datang menggolek, yang pipih tidak datang melayang." },
    { idiom: "Hujan emas di negeri orang, hujan batu di negeri sendiri", meaning: "Walau baik mana pun tempat orang, tempat sendiri lebih baik", example: "Dia pulang ke tanah air kerana hujan emas di negeri orang, hujan batu di negeri sendiri." },
    { idiom: "Lembu punya susu, sapi dapat nama", meaning: "Orang lain yang berusaha, orang lain yang dapat puji", example: "Ahmad yang bertungkus-lumus, tetapi ketuanya yang dipuji, ibarat lembu punya susu, sapi dapat nama." },
    { idiom: "Malu bertanya sesat jalan", meaning: "Kalau segan bertanya, kita akan rugi", example: "Tanyalah guru jika tidak faham, malu bertanya sesat jalan." },
    { idiom: "Berat sama dipikul, ringan sama dijinjing", meaning: "Suka duka ditanggung bersama / Bekerjasama", example: "Penduduk kampung itu mengamalkan sikap berat sama dipikul, ringan sama dijinjing semasa gotong-royong." },
    { idiom: "Masuk telinga kanan, keluar telinga kiri", meaning: "Tidak mendengar nasihat", example: "Nasihat ibu hanya masuk telinga kanan, keluar telinga kiri baginya." },
    { idiom: "Seperti kera mendapat bunga", meaning: "Tidak tahu menghargai pemberian", example: "Memberi hadiah mahal kepadanya ibarat seperti kera mendapat bunga." },
    { idiom: "Berakit-rakit ke hulu, berenang-renang ke tepian", meaning: "Bersusah-susah dahulu, bersenang-senang kemudian", example: "Belajarlah sekarang demi masa depan, berakit-rakit ke hulu, berenang-renang ke tepian." },
    { idiom: "Bagai pinang dibelah dua", meaning: "Pasangan yang sangat sepadan", example: "Pengantin itu sama cantik sama padan bagai pinang dibelah dua." }
];

export const SCIENCE_QUESTIONS: Question[] = [
    { id: 'sc1', text: 'Planet Marikh dikenali sebagai Planet Merah.', answer: true, type: 'boolean', explanation: 'Ia kelihatan merah kerana oksida besi di permukaannya.' },
    { id: 'sc2', text: 'Jantung manusia mempunyai 3 ruang.', answer: false, type: 'boolean', explanation: 'Jantung manusia mempunyai 4 ruang (2 atrium, 2 ventrikel).' },
    { id: 'sc3', text: 'Tumbuhan memerlukan cahaya matahari untuk fotosintesis.', answer: true, type: 'boolean', explanation: 'Cahaya matahari adalah sumber tenaga utama untuk tumbuhan.' },
    { id: 'sc4', text: 'Ikan paus adalah sejenis ikan.', answer: false, type: 'boolean', explanation: 'Paus adalah mamalia, bukan ikan. Ia melahirkan anak.' },
    { id: 'sc5', text: 'Bumi adalah planet ketiga dari Matahari.', answer: true, type: 'boolean', explanation: 'Susunan: Utarid, Zuhrah, Bumi.' },
    { id: 'sc6', text: 'Air mendidih pada suhu 100 darjah Celcius.', answer: true, type: 'boolean', explanation: 'Ini adalah takat didih air tulen.' },
    { id: 'sc7', text: 'Ular adalah haiwan invertebrata (tiada tulang belakang).', answer: false, type: 'boolean', explanation: 'Ular adalah vertebrata, ia mempunyai tulang belakang yang panjang.' },
    { id: 'sc8', text: 'Bulan mengeluarkan cahayanya sendiri.', answer: false, type: 'boolean', explanation: 'Bulan hanya memantulkan cahaya dari Matahari.' },
    { id: 'sc9', text: 'Magnet boleh menarik paku besi.', answer: true, type: 'boolean', explanation: 'Besi adalah bahan magnetik.' },
    { id: 'sc10', text: 'Manusia bernafas menggunakan insang.', answer: false, type: 'boolean', explanation: 'Manusia bernafas menggunakan peparu.' },
    { id: 'sc11', text: 'Katak adalah haiwan amfibia.', answer: true, type: 'boolean', explanation: 'Amfibia boleh hidup di darat dan di air.' },
    { id: 'sc12', text: 'Matahari bergerak mengelilingi Bumi.', answer: false, type: 'boolean', explanation: 'Tidak, Bumi yang bergerak mengelilingi Matahari.' },
    { id: 'sc13', text: 'Telinga digunakan untuk deria bau.', answer: false, type: 'boolean', explanation: 'Telinga untuk mendengar, hidung untuk bau.' },
    { id: 'sc14', text: 'Bateri membekalkan tenaga elektrik.', answer: true, type: 'boolean', explanation: 'Bateri menukar tenaga kimia kepada tenaga elektrik.' },
    { id: 'sc15', text: 'Ais adalah air dalam keadaan pepejal.', answer: true, type: 'boolean', explanation: 'Apabila air membeku, ia menjadi ais (pepejal).' },
    { id: 'sc16', text: 'Harimau adalah haiwan herbivor.', answer: false, type: 'boolean', explanation: 'Harimau adalah karnivor, ia makan daging.' },
    { id: 'sc17', text: 'Bayang-bayang terbentuk apabila cahaya dihalang.', answer: true, type: 'boolean', explanation: 'Objek legap menghalang cahaya lalu membentuk bayang-bayang.' },
    { id: 'sc18', text: 'Pengaratan berlaku apabila besi terkena air dan udara.', answer: true, type: 'boolean', explanation: 'Air dan Oksigen diperlukan untuk pengaratan.' },
    { id: 'sc19', text: 'Burung Penguin boleh terbang tinggi.', answer: false, type: 'boolean', explanation: 'Penguin adalah burung yang tidak boleh terbang.' },
    { id: 'sc20', text: 'Gigi susu akan kekal selamanya.', answer: false, type: 'boolean', explanation: 'Gigi susu akan tanggal dan diganti dengan gigi kekal.' },
    { id: 'sc21', text: 'Kertas diperbuat daripada pokok.', answer: true, type: 'boolean', explanation: 'Kayu pokok diproses menjadi pulpa untuk membuat kertas.' },
    { id: 'sc22', text: 'Planet Musytari adalah planet terbesar dalam sistem suria.', answer: true, type: 'boolean', explanation: 'Musytari (Jupiter) adalah planet gergasi gas.' },
    { id: 'sc23', text: 'Kulit adalah organ deria sentuhan.', answer: true, type: 'boolean', explanation: 'Kulit mengesan panas, sejuk, sakit dan tekanan.' },
    { id: 'sc24', text: 'Semua logam boleh ditarik oleh magnet.', answer: false, type: 'boolean', explanation: 'Bukan semua. Emas dan aluminium tidak ditarik magnet.' },
    { id: 'sc25', text: 'Akar tumbuhan menyerap air dari tanah.', answer: true, type: 'boolean', explanation: 'Fungsi utama akar adalah menyerap air dan nutrien.' },
    { id: 'sc26', text: 'Manusia mempunyai 5 deria.', answer: true, type: 'boolean', explanation: 'Lihat, Dengar, Bau, Rasa, Sentuh.' },
    { id: 'sc27', text: 'Tahun lompat berlaku setiap 2 tahun.', answer: false, type: 'boolean', explanation: 'Tahun lompat berlaku setiap 4 tahun sekali.' },
    { id: 'sc28', text: 'Oksigen diperlukan untuk pembakaran.', answer: true, type: 'boolean', explanation: 'Tanpa oksigen, api akan padam.' },
    { id: 'sc29', text: 'Labah-labah mempunyai 6 kaki.', answer: false, type: 'boolean', explanation: 'Labah-labah mempunyai 8 kaki (Araknida), serangga ada 6.' },
    { id: 'sc30', text: 'Buaya bertelur untuk membiak.', answer: true, type: 'boolean', explanation: 'Buaya adalah reptilia yang bertelur.' },
    { id: 'sc31', text: 'Cahaya bergerak lurus.', answer: true, type: 'boolean', explanation: 'Sebab itu kita tidak boleh melihat di sebalik dinding.' },
    { id: 'sc32', text: 'Batu akan terapung di atas air.', answer: false, type: 'boolean', explanation: 'Batu lebih tumpat daripada air, ia akan tenggelam.' },
    { id: 'sc33', text: 'Pokok kaktus hidup di kawasan gurun.', answer: true, type: 'boolean', explanation: 'Ia menyimpan air dalam batangnya untuk bertahan.' },
    { id: 'sc34', text: 'Susu mengandungi kalsium untuk kuatkan tulang.', answer: true, type: 'boolean', explanation: 'Kalsium penting untuk pertumbuhan tulang dan gigi.' },
    { id: 'sc35', text: 'Matahari adalah sebuah bintang.', answer: true, type: 'boolean', explanation: 'Ia adalah bintang yang paling dekat dengan Bumi.' }
];

// Data untuk Susun Huruf dengan kategori
export interface ScrambleWord {
    word: string;
    category: string;
    hint: string;
}

export const SCRAMBLE_WORDS_DATA: ScrambleWord[] = [
    // HAIWAN (15)
    { word: 'KUCING', category: 'Haiwan', hint: 'Haiwan peliharaan berbulu' },
    { word: 'ANJING', category: 'Haiwan', hint: 'Kawan setia manusia' },
    { word: 'GAJAH', category: 'Haiwan', hint: 'Haiwan darat terbesar' },
    { word: 'HARIMAU', category: 'Haiwan', hint: 'Raja rimba' },
    { word: 'ARNAB', category: 'Haiwan', hint: 'Telinga panjang, suka lobak' },
    { word: 'BURUNG', category: 'Haiwan', hint: 'Boleh terbang' },
    { word: 'IKAN', category: 'Haiwan', hint: 'Hidup dalam air' },
    { word: 'ULAR', category: 'Haiwan', hint: 'Reptilia panjang tanpa kaki' },
    { word: 'KUDA', category: 'Haiwan', hint: 'Haiwan tunggang' },
    { word: 'LEMBU', category: 'Haiwan', hint: 'Menghasilkan susu' },
    { word: 'KAMBING', category: 'Haiwan', hint: 'Korban hari raya' },
    { word: 'AYAM', category: 'Haiwan', hint: 'Berkokok pada pagi' },
    { word: 'ITIK', category: 'Haiwan', hint: 'Kuak kuak' },
    { word: 'MONYET', category: 'Haiwan', hint: 'Suka memanjat pokok' },
    { word: 'ZIRAFAH', category: 'Haiwan', hint: 'Leher paling panjang' },

    // MAKANAN (15)
    { word: 'NASI', category: 'Makanan', hint: 'Makanan ruji Malaysia' },
    { word: 'AYAM', category: 'Makanan', hint: 'Daging putih popular' },
    { word: 'IKAN', category: 'Makanan', hint: 'Protein dari laut' },
    { word: 'SAYUR', category: 'Makanan', hint: 'Hijau dan berkhasiat' },
    { word: 'BUAH', category: 'Makanan', hint: 'Manis dan segar' },
    { word: 'ROTI', category: 'Makanan', hint: 'Sarapan pagi' },
    { word: 'TELUR', category: 'Makanan', hint: 'Dari ayam' },
    { word: 'SUSU', category: 'Makanan', hint: 'Minuman putih berkhasiat' },
    { word: 'KEJU', category: 'Makanan', hint: 'Produk tenusu' },
    { word: 'PIZZA', category: 'Makanan', hint: 'Makanan Itali bulat' },
    { word: 'BURGER', category: 'Makanan', hint: 'Roti dengan daging' },
    { word: 'LAKSA', category: 'Makanan', hint: 'Makanan berkuah pedas' },
    { word: 'SATAY', category: 'Makanan', hint: 'Cucuk dan bakar' },
    { word: 'DURIAN', category: 'Makanan', hint: 'Raja buah-buahan' },
    { word: 'MANGGA', category: 'Makanan', hint: 'Buah kuning manis' },

    // KENDERAAN (12)
    { word: 'KERETA', category: 'Kenderaan', hint: 'Empat roda' },
    { word: 'BAS', category: 'Kenderaan', hint: 'Pengangkutan awam besar' },
    { word: 'LORI', category: 'Kenderaan', hint: 'Angkut barang berat' },
    { word: 'KAPAL', category: 'Kenderaan', hint: 'Belayar di laut' },
    { word: 'BASIKAL', category: 'Kenderaan', hint: 'Dua roda, kayuh' },
    { word: 'TEKSI', category: 'Kenderaan', hint: 'Sewa untuk pergi' },
    { word: 'TREN', category: 'Kenderaan', hint: 'Bergerak atas landasan' },
    { word: 'HELIKOPTER', category: 'Kenderaan', hint: 'Terbang dengan kipas' },
    { word: 'MOTOSIKAL', category: 'Kenderaan', hint: 'Dua roda berenjin' },
    { word: 'AMBULANS', category: 'Kenderaan', hint: 'Kenderaan kecemasan' },
    { word: 'FERI', category: 'Kenderaan', hint: 'Angkut kereta merentas laut' },
    { word: 'ROKET', category: 'Kenderaan', hint: 'Pergi ke angkasa' },

    // TEMPAT (15)
    { word: 'SEKOLAH', category: 'Tempat', hint: 'Tempat belajar' },
    { word: 'HOSPITAL', category: 'Tempat', hint: 'Tempat rawatan' },
    { word: 'MASJID', category: 'Tempat', hint: 'Tempat ibadah Islam' },
    { word: 'GEREJA', category: 'Tempat', hint: 'Tempat ibadah Kristian' },
    { word: 'KUIL', category: 'Tempat', hint: 'Tempat ibadah Hindu' },
    { word: 'PASAR', category: 'Tempat', hint: 'Tempat jual beli' },
    { word: 'RUMAH', category: 'Tempat', hint: 'Tempat tinggal' },
    { word: 'PEJABAT', category: 'Tempat', hint: 'Tempat bekerja' },
    { word: 'STADIUM', category: 'Tempat', hint: 'Tempat sukan besar' },
    { word: 'PERPUSTAKAAN', category: 'Tempat', hint: 'Tempat pinjam buku' },
    { word: 'RESTORAN', category: 'Tempat', hint: 'Tempat makan' },
    { word: 'LAPANGAN', category: 'Tempat', hint: 'Tempat bermain' },
    { word: 'PANTAI', category: 'Tempat', hint: 'Tepi laut berpasir' },
    { word: 'GUNUNG', category: 'Tempat', hint: 'Tinggi menjulang' },
    { word: 'HUTAN', category: 'Tempat', hint: 'Penuh pokok' },

    // PEKERJAAN (12)
    { word: 'DOKTOR', category: 'Pekerjaan', hint: 'Merawat pesakit' },
    { word: 'CIKGU', category: 'Pekerjaan', hint: 'Mengajar murid' },
    { word: 'POLIS', category: 'Pekerjaan', hint: 'Menjaga keamanan' },
    { word: 'BOMBA', category: 'Pekerjaan', hint: 'Memadam api' },
    { word: 'JURUTERA', category: 'Pekerjaan', hint: 'Reka dan bina' },
    { word: 'PEGUAM', category: 'Pekerjaan', hint: 'Wakil di mahkamah' },
    { word: 'JURURAWAT', category: 'Pekerjaan', hint: 'Bantu doktor' },
    { word: 'CHEF', category: 'Pekerjaan', hint: 'Tukang masak' },
    { word: 'PILOT', category: 'Pekerjaan', hint: 'Terbangkan kapal terbang' },
    { word: 'ASKAR', category: 'Pekerjaan', hint: 'Pertahan negara' },
    { word: 'NELAYAN', category: 'Pekerjaan', hint: 'Tangkap ikan' },
    { word: 'PETANI', category: 'Pekerjaan', hint: 'Tanam tanaman' },

    // BENDA/OBJEK (15)
    { word: 'BUKU', category: 'Benda', hint: 'Untuk dibaca' },
    { word: 'PENSEL', category: 'Benda', hint: 'Alat tulis kayu' },
    { word: 'MEJA', category: 'Benda', hint: 'Tempat letak barang' },
    { word: 'KERUSI', category: 'Benda', hint: 'Tempat duduk' },
    { word: 'TELEFON', category: 'Benda', hint: 'Alat komunikasi' },
    { word: 'KOMPUTER', category: 'Benda', hint: 'Alat teknologi' },
    { word: 'TELEVISYEN', category: 'Benda', hint: 'Kotak ajaib' },
    { word: 'PETI', category: 'Benda', hint: 'Simpan barang' },
    { word: 'LAMPU', category: 'Benda', hint: 'Beri cahaya' },
    { word: 'KIPAS', category: 'Benda', hint: 'Beri angin' },
    { word: 'CERMIN', category: 'Benda', hint: 'Lihat pantulan' },
    { word: 'JAM', category: 'Benda', hint: 'Tunjuk masa' },
    { word: 'KUNCI', category: 'Benda', hint: 'Buka pintu' },
    { word: 'BOLA', category: 'Benda', hint: 'Untuk sukan' },
    { word: 'PAYUNG', category: 'Benda', hint: 'Lindung dari hujan' },

    // ALAM SEMULAJADI (10)
    { word: 'MATAHARI', category: 'Alam', hint: 'Sumber cahaya' },
    { word: 'BULAN', category: 'Alam', hint: 'Menerangi malam' },
    { word: 'BINTANG', category: 'Alam', hint: 'Berkelip di langit' },
    { word: 'AWAN', category: 'Alam', hint: 'Putih di langit' },
    { word: 'HUJAN', category: 'Alam', hint: 'Air dari langit' },
    { word: 'PELANGI', category: 'Alam', hint: 'Tujuh warna' },
    { word: 'SUNGAI', category: 'Alam', hint: 'Air mengalir' },
    { word: 'LAUT', category: 'Alam', hint: 'Air masin luas' },
    { word: 'POKOK', category: 'Alam', hint: 'Tumbuhan besar' },
    { word: 'BUNGA', category: 'Alam', hint: 'Cantik dan wangi' },
];

// Fungsi untuk kacau huruf secara rawak
export const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // Pastikan hasil berbeza dari asal
    if (letters.join('') === word && word.length > 1) {
        return scrambleWord(word);
    }
    return letters.join('');
};

// Untuk backward compatibility
export const SCRAMBLE_WORDS: Question[] = SCRAMBLE_WORDS_DATA.map((item, idx) => ({
    id: `sw-${idx}`,
    text: item.word, // Will be scrambled in ActivityGame
    answer: item.word,
    explanation: item.hint,
    type: 'text' as const
}));

export const generateMathQuestion = (difficulty: 'Mudah' | 'Sederhana' | 'Mencabar'): Question => {
    let num1, num2, operator, ans;
    const ops = ['+', '-', 'x'];
    const selectedOp = ops[Math.floor(Math.random() * ops.length)];

    if (difficulty === 'Mudah') {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
    } else {
        num1 = Math.floor(Math.random() * 100) + 10;
        num2 = Math.floor(Math.random() * 50) + 5;
    }

    if (selectedOp === '+') ans = num1 + num2;
    else if (selectedOp === '-') {
        if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive
        ans = num1 - num2;
    } else {
        // Multiplication - keep numbers smaller
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        ans = num1 * num2;
    }

    return {
        id: `m-${Date.now()}`,
        text: `${num1} ${selectedOp === 'x' ? '×' : selectedOp} ${num2} = ?`,
        answer: ans,
        type: 'math'
    };
};
