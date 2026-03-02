import { prisma } from "./lib/prisma";

const trendingVideos = [
  {
    title: "Resident Evil Speedrun Under 30 Seconds",
    niche: "Gaming",
    viralScore: 97,
    views: "28.4M",
    hookHighlight: "Pattern Interrupt + Visual Shock: tampilkan 'impossible' feat di frame pertama, lalu reverse-reveal prosesnya. Formula: Shock → Prove → Teach.",
    whyViral: "Menggabungkan skeptisisme penonton (tidak mungkin!) dengan immediate proof. Open loop yang kuat mendorong penonton menyelesaikan video.",
    gradientFrom: "#7c3aed",
    gradientTo: "#4f46e5",
    analysisData: {
      hook: { type: "Visual Shock + Pattern Interrupt", technique: "Tampilkan hasil 'impossible' di detik pertama, lalu backward reveal", seconds: "0-3 detik", whyItWorks: "Memicu skeptisisme sekaligus curiosity — otak dipaksa mencari konfirmasi" },
      viralFormula: "Hook dengan klaim ekstrem → Immediate proof → Step-by-step breakdown → CTA untuk mencoba sendiri",
      retentionMechanics: { openLoop: "Klaim 'speedrun 30 detik' memaksa penonton bertanya 'bagaimana caranya?'", peakMoment: "Reveal momen kritis yang membuat speedrun mungkin", replayFactor: "Detail teknis yang perlu ditonton ulang untuk dipahami" },
      atmFramework: { amati: ["Klaim ekstrem di detik 0-2", "Visual yang langsung membuktikan klaim", "Breakdown step yang cepat dan precise", "Tone percaya diri tanpa arogan"], tiru: ["Buka dengan outcome/hasil dulu, proses belakangan", "Gunakan angka spesifik (30 detik, bukan 'cepat')", "Cut langsung ke action, zero wasted frames", "Tambahkan subtitle/counter visual"], modifikasi: ["Adaptasi ke niche finance: 'Nabung 1 juta dalam 7 hari'", "Adaptasi ke cooking: 'Masak 5 menu dalam 15 menit'", "Adaptasi ke fitness: 'Turun 2kg dalam seminggu — ini caranya'"] },
      contentDNA: { triggerEmotion: "FOMO + Rasa penasaran ekstrem", curiosityGap: "Klaim yang tampak mustahil menciptakan gap besar antara yang diketahui dan yang ingin diketahui", relatabilityFactor: "Semua gamer ingin speedrun", noveltyElement: "Solusi yang tampak impossible ternyata memiliki formula jelas", socialCurrency: "Share = 'lihat ini gila banget'" },
      productionRecipe: { editingPace: "Ultra fast cuts, setiap shot maksimal 1.5 detik", visualStyle: "Screen capture + face cam split screen, counter timer visible", audioStrategy: "Fast-paced BGM + sound effect setiap achievement", captionStrategy: "Bold white text dengan outline hitam, font besar", duration: "25-45 detik", bestPlatform: "TikTok + YouTube Shorts" },
    },
  },
  {
    title: "Cara Beli Saham Pertama Kali — Panduan Jujur",
    niche: "Finance",
    viralScore: 94,
    views: "15.2M",
    hookHighlight: "Confession Hook: akui kesalahan umum yang dilakukan penonton, lalu posisikan diri sebagai orang yang sudah melewatinya. Formula: Relate → Validate → Solve.",
    whyViral: "Menghilangkan rasa malu penonton yang merasa tidak tahu apa-apa. Pendekatan jujur dan non-judgmental menciptakan trust instan.",
    gradientFrom: "#059669",
    gradientTo: "#0d9488",
    analysisData: {
      hook: { type: "Confession + Relatable Pain", technique: "Ungkap kesalahan yang pernah pembuat lakukan, sama dengan yang penonton lakukan", seconds: "0-4 detik", whyItWorks: "Menghilangkan ego barrier — penonton merasa tidak sendiri" },
      viralFormula: "Confession → Pain validation → Promise of solution → Step-by-step guide → Result proof",
      retentionMechanics: { openLoop: "Pertanyaan 'apakah saya sudah terlambat?' dijawab di akhir", peakMoment: "Reveal angka spesifik (mulai dari Rp100rb)", replayFactor: "Informasi praktis yang ingin disimpan" },
      atmFramework: { amati: ["Bahasa yang sangat accessible dan tidak menggurui", "Angka konkret bukan abstrak", "Personal story sebagai bukti sosial", "CTA yang spesifik dan actionable"], tiru: ["Mulai dengan 'Dulu saya juga...'", "Gunakan angka kecil yang tidak menakutkan", "Break down langkah menjadi maksimal 5 step", "Akhiri dengan quick win yang bisa langsung dilakukan"], modifikasi: ["Adaptasi ke skincare: 'Dulu saya juga salah pakai sunscreen'", "Adaptasi ke fitness: 'Saya dulu pikir harus gym mahal'", "Adaptasi ke tech: 'Cara pertama kali setup laptop untuk kerja remote'"] },
      contentDNA: { triggerEmotion: "Relief + Hope + Empowerment", curiosityGap: "Berapa modal minimum yang diperlukan?", relatabilityFactor: "Semua orang pernah bingung soal investasi", noveltyElement: "Penjelasan tanpa jargon financial yang rumit", socialCurrency: "Share ke teman yang juga bingung" },
      productionRecipe: { editingPace: "Medium pace, step ditampilkan satu per satu", visualStyle: "Talking head + screen recording aplikasi nyata", audioStrategy: "Background musik calm, suara jelas", captionStrategy: "Highlight angka dengan warna berbeda", duration: "45-90 detik", bestPlatform: "TikTok + Instagram Reels" },
    },
  },
  {
    title: "BLACKPINK Concert Fancam — Viral Angle Nobody Noticed",
    niche: "KPop & Commentary",
    viralScore: 96,
    views: "31.7M",
    hookHighlight: "Exclusive Angle Hook: tunjukkan perspektif yang belum pernah dilihat orang lain dari event viral. Formula: 'Yang orang lain tidak lihat' → Reveal → Reaksi authentic.",
    whyViral: "FOMO ekstrem + exclusive content dari event yang jutaan orang tidak bisa hadiri. Reaksi authentic creator memperkuat emotional connection.",
    gradientFrom: "#db2777",
    gradientTo: "#9333ea",
    analysisData: {
      hook: { type: "Exclusive Perspective + FOMO", technique: "Klaim memiliki angle/info yang tidak dimiliki orang lain", seconds: "0-3 detik", whyItWorks: "Otak manusia terprogramkan untuk mencari informasi eksklusif" },
      viralFormula: "Exclusive claim → Build anticipation → Reveal → Authentic reaction → Commentary/analysis",
      retentionMechanics: { openLoop: "'Angle yang tidak ada di official cam' memaksa penonton menunggu reveal", peakMoment: "Momen interaksi idol-fan yang tidak tercapture di kamera resmi", replayFactor: "Detail-detail kecil yang terus ditemukan setiap tonton ulang" },
      atmFramework: { amati: ["Klaim exclusivity yang kuat di detik pertama", "Authentic, unedited reaction shots", "Behind-the-scene perspective", "Emotional commentary yang genuine"], tiru: ["Posisikan diri sebagai punya access atau angle eksklusif", "Tunjukkan reaksi asli, jangan dibuat-buat", "Tambahkan commentary yang menambah konteks", "Use slow-mo di momen paling impactful"], modifikasi: ["Gaming: 'Yang tidak ada di official stream — glitch tersembunyi'", "Tech: 'Angle yang tidak masuk review manapun'", "Food: 'Dapur restoran viral yang tidak pernah kamu lihat'"] },
      contentDNA: { triggerEmotion: "FOMO + Excitement + Parasocial connection", curiosityGap: "Apa yang benar-benar terjadi di balik panggung?", relatabilityFactor: "Semua K-pop fan ingin ada di sana", noveltyElement: "Perspektif yang benar-benar baru dari event yang sama", socialCurrency: "Share = berbagi pengalaman eksklusif" },
      productionRecipe: { editingPace: "Dynamic, ikuti energi momen", visualStyle: "Vertical portrait, natural lighting, handheld authentic", audioStrategy: "Audio asli + overlay commentary minimal", captionStrategy: "Minimal text, biarkan visual berbicara", duration: "30-60 detik", bestPlatform: "TikTok + Twitter" },
    },
  },
  {
    title: "Motor Modif 50 Juta vs Motor Stock — Drag Race",
    niche: "Automotive",
    viralScore: 93,
    views: "19.8M",
    hookHighlight: "Versus Format + Underdog Narrative: tampilkan dua hal yang tampak tidak seimbang, biarkan penonton memilih pemenang sebelum reveal. Formula: Setup → Tension → Unexpected result.",
    whyViral: "Format versus selalu memicu opini dan debat. Underdog element menciptakan emotional investment. Hasil mengejutkan mendorong share.",
    gradientFrom: "#dc2626",
    gradientTo: "#ea580c",
    analysisData: {
      hook: { type: "Versus Format + Unexpected Matchup", technique: "Tampilkan dua kompetitor yang tampak tidak seimbang, trigger instant opinion", seconds: "0-3 detik", whyItWorks: "Manusia secara naluri ingin memprediksi dan 'menang' dalam prediksi mereka" },
      viralFormula: "Setup matchup → Build tension → False signal → Unexpected result → Explanation",
      retentionMechanics: { openLoop: "Siapa yang menang? — pertanyaan yang tidak bisa ditinggalkan", peakMoment: "Momen race start dan garis finish", replayFactor: "Ingin memastikan apakah hasilnya benar" },
      atmFramework: { amati: ["Format versus yang jelas dan mudah dipahami", "Stakes yang terasa nyata (50 juta vs stock)", "Tension building sebelum reveal", "Data dan specs yang memberi konteks"], tiru: ["Buat matchup yang tampak obvious hasilnya (tapi tidak)", "Gunakan countdown/timer visual", "Build tension dengan slow-mo sebelum reveal", "Tambahkan eksplanasi teknis setelah hasil"], modifikasi: ["Finance: 'Investasi 1 juta di saham vs crypto — 1 tahun kemudian'", "Food: 'Masakan chef Rp500rb vs masakan sendiri Rp50rb'", "Skincare: 'Skincare Rp2 juta vs Rp200rb — hasilnya sama?'"] },
      contentDNA: { triggerEmotion: "Excitement + Debat intelektual + Surprise", curiosityGap: "Apakah uang bisa membeli kecepatan?", relatabilityFactor: "Dilema 'worth it atau tidak' yang universal", noveltyElement: "Hasil yang tidak sesuai ekspektasi", socialCurrency: "Share untuk debat dengan teman" },
      productionRecipe: { editingPace: "Slow build-up, FAST di momen race, slow-mo di finish", visualStyle: "Multiple angles, cinematic color grade", audioStrategy: "Engine sound authentic + dramatic music swell", captionStrategy: "Stats/specs as text overlay", duration: "45-75 detik", bestPlatform: "TikTok + YouTube Shorts" },
    },
  },
  {
    title: "Bakso Urat Tersembunyi di Gang Sempit — Worth It?",
    niche: "Food & Kuliner",
    viralScore: 91,
    views: "12.3M",
    hookHighlight: "Hidden Gem Discovery Formula: posisikan diri sebagai explorer yang menemukan sesuatu yang tersembunyi. Formula: Tease lokasi misterius → Journey → Dramatic first taste reaction.",
    whyViral: "Penonton ingin tahu tempat tersembunyi yang hanya diketahui 'orang dalam'. Discovery format menciptakan adventure vicariously.",
    gradientFrom: "#d97706",
    gradientTo: "#dc2626",
    analysisData: {
      hook: { type: "Mystery Location + Hidden Gem", technique: "Tease lokasi yang 'hampir tidak ada yang tahu' + visual gang sempit yang intriguing", seconds: "0-3 detik", whyItWorks: "Exclusivity trigger — otak tertarik pada informasi yang tidak semua orang punya" },
      viralFormula: "Location tease → Journey/struggle to find → First impression → Taste test → Verdict + Location reveal",
      retentionMechanics: { openLoop: "Di mana lokasinya? Apakah worth it?", peakMoment: "First bite reaction yang authentic", replayFactor: "Review komprehensif yang berguna sebagai referensi" },
      atmFramework: { amati: ["Framing sebagai 'hidden gem' yang eksklusif", "Journey element yang membuat penonton ikut berpetualang", "Authentic reaction tanpa drama berlebihan", "Informasi praktis (harga, lokasi, jam buka)"], tiru: ["Mulai dengan 'hampir tidak ada yang tahu tempat ini'", "Tunjukkan proses menemukan lokasi", "First bite haruslah genuinely surprised reaction", "Akhiri dengan verdict dan info praktis"], modifikasi: ["Adaptasi ke skincare: 'Skincare lokal tersembunyi yang belum viral'", "Adaptasi ke tech: 'Aplikasi hidden yang belum banyak yang tahu'", "Adaptasi ke travel: 'Spot foto tersembunyi di tempat wisata terkenal'"] },
      contentDNA: { triggerEmotion: "FOMO + Adventure + Discovery", curiosityGap: "Di mana persisnya dan apakah worth it?", relatabilityFactor: "Semua orang suka kuliner tersembunyi yang autentik", noveltyElement: "Lokasi yang benar-benar tidak diketahui banyak orang", socialCurrency: "Share = jadi yang pertama memberitahu teman" },
      productionRecipe: { editingPace: "Medium-fast, tunjukkan perjalanan tapi jangan terlalu panjang", visualStyle: "POV handheld, natural lighting, close-up food shots", audioStrategy: "Ambient sound + ASMR eating moments", captionStrategy: "Harga dan info lokasi sebagai text overlay di akhir", duration: "45-90 detik", bestPlatform: "TikTok + Instagram Reels" },
    },
  },
  {
    title: "Rutinitas Skincare 5 Langkah — Hasil 30 Hari",
    niche: "Skincare & Beauty",
    viralScore: 92,
    views: "22.1M",
    hookHighlight: "Before/After Transformation + Specific Timeline: tunjukkan hasil nyata dengan timeline yang spesifik. Formula: Before reveal → Routine breakdown → Day-by-day progress → After reveal.",
    whyViral: "Transformasi visual yang nyata adalah bukti paling kuat. Timeline 30 hari terasa achievable — tidak terlalu cepat, tidak terlalu lama.",
    gradientFrom: "#ec4899",
    gradientTo: "#f97316",
    analysisData: {
      hook: { type: "Before/After + Specific Timeline", technique: "Tunjukkan 'after' dulu untuk hook, lalu reveal 'before' untuk kontras dramatis", seconds: "0-4 detik", whyItWorks: "Reverse reveal lebih impactful daripada before → after linear" },
      viralFormula: "After state hook → Skepticism address → Routine breakdown → Progress timeline → Full transformation reveal",
      retentionMechanics: { openLoop: "Apa rutinitas yang menghasilkan perubahan ini?", peakMoment: "Side-by-side before/after comparison", replayFactor: "Ingin mencatat produk dan langkah-langkahnya" },
      atmFramework: { amati: ["Reverse reveal (after dulu) sebagai hook", "Skepticism pre-emption ('ini bukan filter')", "Produk spesifik dengan harga nyata", "Progress shots yang konsisten"], tiru: ["Mulai dengan hasil, bukan proses", "Akui skeptisisme penonton sejak awal", "Gunakan pencahayaan dan angle yang konsisten untuk perbandingan", "Include harga produk untuk credibility"], modifikasi: ["Fitness: '30 hari workout 15 menit — ini hasilnya'", "Finance: '30 hari menabung 10% gaji — hasilnya mengejutkan'", "Produktivitas: '30 hari bangun jam 5 pagi — jujur review'"] },
      contentDNA: { triggerEmotion: "Hope + Envy + Inspiration", curiosityGap: "Produk apa yang digunakan?", relatabilityFactor: "Semua orang ingin kulit bagus dengan usaha minimal", noveltyElement: "Hasil nyata tanpa filter atau editan", socialCurrency: "Share ke teman yang juga struggle dengan skincare" },
      productionRecipe: { editingPace: "Steady, organized, informatif", visualStyle: "Consistent lighting, clean background, close-up skin shots", audioStrategy: "Calm BGM, clear voiceover", captionStrategy: "Product list dengan harga, step numbers", duration: "60-90 detik", bestPlatform: "TikTok + Instagram Reels + YouTube Shorts" },
    },
  },
  {
    title: "iPhone vs Android Camera Test — Jujur Tanpa Edit",
    niche: "Tech Review",
    viralScore: 95,
    views: "34.5M",
    hookHighlight: "Honest Comparison + No-Edit Claim: promise transparansi total membuat penonton percaya. Formula: Claim 'no edit/no bias' → Systematic test → Unexpected findings → Honest verdict.",
    whyViral: "Pasar tech review penuh dengan sponsored content. Klaim 'jujur' dan 'no edit' menciptakan instant credibility dan diferensiasi.",
    gradientFrom: "#2563eb",
    gradientTo: "#7c3aed",
    analysisData: {
      hook: { type: "Authenticity Claim + High Stakes Comparison", technique: "Klaim tidak memihak satu brand pun, lalu setup test yang tampak fair", seconds: "0-3 detik", whyItWorks: "Di era sponsored content, autentisitas menjadi scarce resource yang sangat dihargai" },
      viralFormula: "Authenticity claim → Fair test setup → Surprising intermediate findings → Unexpected final verdict → Why it matters",
      retentionMechanics: { openLoop: "Siapa yang benar-benar menang dalam kondisi nyata?", peakMoment: "Reveal kondisi dimana Android mengalahkan iPhone (atau sebaliknya)", replayFactor: "Ingin memperhatikan detail foto side by side" },
      atmFramework: { amati: ["Klaim netralitas yang kuat di awal", "Test scenario yang relate ke kehidupan nyata", "Side-by-side tanpa label brand selama testing", "Verdict yang tidak hitam-putih"], tiru: ["Gunakan kalimat 'saya beli sendiri, tidak sponsored'", "Test di kondisi yang penonton alami (café, outdoor, malam)", "Reveal brand setelah voting, bukan sebelum", "Berikan verdict nuanced, bukan absolut"], modifikasi: ["Skincare: 'Sunscreen mahal vs murah — test UV actual'", "Kuliner: 'Nasi goreng delivery Rp15rb vs Rp60rb'", "Automotive: 'BBM pertamax vs pertalite — tes jarak nyata'"] },
      contentDNA: { triggerEmotion: "Curiosity + Trust + Validation", curiosityGap: "Apakah harga selalu mencerminkan kualitas?", relatabilityFactor: "Dilema beli mahal vs murah yang dialami semua orang", noveltyElement: "Verdict yang tidak memihak secara mengejutkan", socialCurrency: "Share untuk validasi pilihan sendiri atau debat dengan teman" },
      productionRecipe: { editingPace: "Systematic, organized, beri waktu untuk perbandingan", visualStyle: "Split screen, consistent conditions, neutral background", audioStrategy: "Minimal music, focus pada penjelasan voiceover", captionStrategy: "Label kondisi test, bukan brand di awal", duration: "60-90 detik", bestPlatform: "YouTube Shorts + TikTok" },
    },
  },
  {
    title: "Cara Belajar Coding Dalam 30 Hari — Jalan Tercepat",
    niche: "Education",
    viralScore: 90,
    views: "18.6M",
    hookHighlight: "Roadmap Formula: berikan struktur yang jelas untuk mencapai goal yang tampak sulit. Formula: 'Orang pikir butuh X tahun, padahal...' → Deconstructed roadmap → Quick wins.",
    whyViral: "Menghancurkan mitos bahwa sesuatu yang sulit membutuhkan waktu lama. Roadmap yang jelas mengurangi anxiety dan meningkatkan starting motivation.",
    gradientFrom: "#0891b2",
    gradientTo: "#2563eb",
    analysisData: {
      hook: { type: "Myth Busting + Specific Timeline", technique: "Bantah asumsi umum ('butuh bertahun-tahun') dengan timeline yang aggressively short tapi credible", seconds: "0-3 detik", whyItWorks: "Permission to start — menghilangkan hambatan psikologis terbesar" },
      viralFormula: "Myth bust → Your story/credibility → Deconstructed roadmap → Day-by-day breakdown → First quick win",
      retentionMechanics: { openLoop: "Bagaimana roadmap 30 harinya?", peakMoment: "Reveal bahwa day 1 bisa langsung bikin sesuatu yang jalan", replayFactor: "Roadmap yang ingin di-screenshot atau disimpan" },
      atmFramework: { amati: ["Myth-busting yang credible (bukan clickbait)", "Roadmap yang sangat spesifik dan actionable", "Quick win di awal untuk momentum", "Personal proof bahwa metode ini berhasil"], tiru: ["Mulai dengan 'kebanyakan orang pikir butuh X, padahal...'", "Berikan hari-per-hari yang sangat spesifik", "Tunjukkan output nyata yang bisa dicapai di akhir 30 hari", "Sertakan resource gratis"], modifikasi: ["Finance: '30 hari mengerti saham dari nol'", "Fitness: '30 hari dari tidak bisa push-up'", "Language: '30 hari bisa percakapan dasar Jepang'"] },
      contentDNA: { triggerEmotion: "Hope + Relief + Motivation", curiosityGap: "Apa persisnya yang harus dilakukan setiap harinya?", relatabilityFactor: "Semua orang pernah overwhelmed dengan skill baru", noveltyElement: "Roadmap yang benar-benar actionable hari per hari", socialCurrency: "Share ke teman yang mau belajar hal yang sama" },
      productionRecipe: { editingPace: "Fast-paced tapi terstruktur, gunakan chapter markers visual", visualStyle: "Screen recording + talking head, progress indicators", audioStrategy: "Upbeat background music, clear voiceover", captionStrategy: "Timeline numbers besar, resource links di bio", duration: "60-120 detik", bestPlatform: "YouTube Shorts + TikTok" },
    },
  },
  {
    title: "Workout 10 Menit Bakar Lemak Tanpa Gym",
    niche: "Fitness & Olahraga",
    viralScore: 89,
    views: "25.3M",
    hookHighlight: "Zero-Barrier Solution: eliminasi semua excuses yang biasa dipakai untuk tidak mulai. Formula: 'Tidak ada alasan lagi' → Prove semua barrier hilang → Follow-along format.",
    whyViral: "Menghilangkan barrier terbesar: waktu, tempat, dan equipment. Follow-along format membuat penonton langsung bisa action.",
    gradientFrom: "#16a34a",
    gradientTo: "#0891b2",
    analysisData: {
      hook: { type: "Zero Barrier + Immediate Value", technique: "Sebutkan semua excuse yang biasa dipakai, lalu eliminate satu per satu", seconds: "0-3 detik", whyItWorks: "Pre-emptive objection handling membuat penonton tidak punya alasan untuk tidak mencoba" },
      viralFormula: "Barrier elimination hook → What you need (nothing) → Follow-along workout → Rest timer → Result teaser",
      retentionMechanics: { openLoop: "Apakah workout 10 menit benar-benar cukup?", peakMoment: "Momen dimana kreator sendiri tampak struggle (relatable)", replayFactor: "Bisa diikuti berulang kali sebagai workout routine" },
      atmFramework: { amati: ["Eliminasi semua barrier di awal (waktu, tempat, alat)", "Follow-along format yang bisa langsung diikuti", "Real-time rest timer yang visible", "Creator yang juga berkeringat (credibility + relatable)"], tiru: ["List semua excuse di hook, eliminate satu per satu", "Gunakan countdown timer visual yang jelas", "Include rest periods yang realistic", "Show sweat dan heavy breathing — jangan perfect"], modifikasi: ["Cooking: 'Masak 3 menu sehat dalam 15 menit tanpa alat khusus'", "Produktivitas: 'Morning routine 10 menit yang mengubah hari'", "Belajar: '10 menit per hari untuk bisa baca not balok'"] },
      contentDNA: { triggerEmotion: "Motivation + Guilt removal + Empowerment", curiosityGap: "Apakah ini benar-benar cukup efektif?", relatabilityFactor: "Semua orang pernah beralasan tidak punya waktu/gym", noveltyElement: "Hasil nyata dengan zero barrier", socialCurrency: "Share ke teman sebagai 'kita mulai bareng yuk'" },
      productionRecipe: { editingPace: "Match pace dengan exercise — cepat saat gerakan, normal saat rest", visualStyle: "Wide shot full body, clean minimal background", audioStrategy: "Energetic workout music, timer sound effects", captionStrategy: "Exercise name + rep count + timer countdown visible", duration: "8-12 menit atau versi 60 detik highlights", bestPlatform: "TikTok + YouTube Shorts + Instagram Reels" },
    },
  },
  {
    title: "POV: Hari Pertama Kerja dan Ternyata Boss Lebih Muda",
    niche: "Comedy & Hiburan",
    viralScore: 88,
    views: "41.2M",
    hookHighlight: "POV + Universal Awkward Situation: tempatkan penonton langsung dalam skenario awkward yang relatable. Formula: Setup situasi → Escalating awkwardness → Punchline yang subvert expectations.",
    whyViral: "POV format menciptakan immersion instan. Situasi kerja yang universal membuat semua orang relate. Punchline yang unexpected memicu share.",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    analysisData: {
      hook: { type: "POV + Relatable Awkward Situation", technique: "Tempatkan penonton dalam situasi yang mereka dread tapi juga penasaran", seconds: "0-2 detik", whyItWorks: "POV format menghilangkan jarak antara konten dan penonton — langsung masuk situasi" },
      viralFormula: "POV setup → Situation escalation → Peak awkwardness → Unexpected twist/punchline → Character reaction",
      retentionMechanics: { openLoop: "Bagaimana reaksi si boss? Bagaimana cara handle situasi ini?", peakMoment: "Moment ketika twist atau punchline terungkap", replayFactor: "Ingin share ke teman dengan konteks, jadi tonton ulang untuk pastikan detail" },
      atmFramework: { amati: ["POV framing yang immersive", "Situasi yang universal tapi spesifik", "Escalating tension sebelum punchline", "Character expressions yang exaggerated tapi believable"], tiru: ["Mulai langsung dengan POV tanpa intro", "Pilih situasi yang hampir semua orang pernah alami atau dread", "Bangun tension dengan detail-detail kecil yang awkward", "Punchline yang subvert ekspektasi tapi makes sense"], modifikasi: ["Gaming: 'POV: First day main game kompetitif'", "Kuliner: 'POV: Pertama kali coba makanan yang semua orang suka tapi tidak ada yang jujur'", "Finance: 'POV: Pertama kali lihat tagihan kartu kredit'"] },
      contentDNA: { triggerEmotion: "Cringe + Empathy + Relief ('bukan cuma saya')", curiosityGap: "Bagaimana situasi ini akan berakhir?", relatabilityFactor: "Universal workplace anxiety yang semua orang pernah rasakan", noveltyElement: "Twist yang subvert expected outcome", socialCurrency: "Tag teman yang pernah di situasi sama" },
      productionRecipe: { editingPace: "Pacing lambat saat build-up, fast cut di punchline", visualStyle: "First-person POV shot, expressive facial close-ups", audioStrategy: "Awkward silence + comedic timing + sound effects", captionStrategy: "Text untuk inner monologue/thought bubbles", duration: "30-60 detik", bestPlatform: "TikTok + Instagram Reels" },
    },
  },
  {
    title: "Budget Backpacking Bali 3 Hari — Total Pengeluaran Jujur",
    niche: "Travel & Lifestyle",
    viralScore: 87,
    views: "16.9M",
    hookHighlight: "Budget Transparency Formula: ungkap angka nyata yang membuat orang terkejut (lebih murah atau lebih mahal dari ekspektasi). Formula: Budget reveal → Itinerary breakdown → Tips tersembunyi.",
    whyViral: "Transparansi finansial adalah konten yang paling dibagikan di travel. Angka spesifik membuat konten sangat practical dan bookmarkable.",
    gradientFrom: "#0891b2",
    gradientTo: "#059669",
    analysisData: {
      hook: { type: "Budget Reveal + Expectation Subversion", technique: "Tunjukkan total budget yang mengejutkan (jauh lebih murah dari ekspektasi)", seconds: "0-3 detik", whyItWorks: "Angka konkret langsung relevan dengan planning penonton sendiri" },
      viralFormula: "Total budget reveal → Where the money went → Biggest saving tip → Biggest splurge → Final verdict + Reproducible itinerary",
      retentionMechanics: { openLoop: "Bagaimana bisa semurah itu? Ada yang disembunyikan?", peakMoment: "Reveal tips hemat yang tidak obvious", replayFactor: "Konten yang ingin disimpan untuk referensi trip sendiri" },
      atmFramework: { amati: ["Angka total yang shocking di hook", "Breakdown per kategori (akomodasi, makan, transport, aktivitas)", "Tips tersembunyi yang tidak ada di blog travel biasa", "Screenshot booking dan receipt asli"], tiru: ["Mulai dengan total angka, bukan itinerary", "Tunjukkan screenshot atau receipt untuk credibility", "Highlight saving hack yang tidak obvious", "Include what to avoid (waste of money)"], modifikasi: ["Finance: 'Breakdown pengeluaran bulanan mahasiswa Rp2 juta'", "Kuliner: 'Makan enak di Jakarta seminggu dengan budget Rp500rb'", "Lifestyle: 'Skincare routine complete dengan budget Rp300rb'"] },
      contentDNA: { triggerEmotion: "Inspiration + FOMO + Practical motivation", curiosityGap: "Bagaimana saving hack yang tidak ada di artikel travel biasa?", relatabilityFactor: "Semua orang ingin travel dengan budget terbatas", noveltyElement: "Transparansi penuh dengan receipt dan screenshots nyata", socialCurrency: "Share ke grup travel planning bersama teman" },
      productionRecipe: { editingPace: "Organized, gunakan chapter untuk setiap hari", visualStyle: "B-roll destinasi + talking head + screenshot overlay", audioStrategy: "Upbeat travel vibes music, clear narration", captionStrategy: "Angka dan tips sebagai text callout yang prominent", duration: "90-180 detik atau versi 60 detik highlights", bestPlatform: "YouTube Shorts + TikTok + Instagram Reels" },
    },
  },
];

async function main() {
  console.log("Seeding trending videos...");

  const existing = await prisma.trendingVideo.count();
  if (existing > 0) {
    console.log(`Sudah ada ${existing} trending video. Skip seeding.`);
    return;
  }

  for (const video of trendingVideos) {
    await prisma.trendingVideo.create({ data: video });
    console.log(`✓ Created: ${video.title}`);
  }

  console.log(`\n✅ Seeded ${trendingVideos.length} trending videos!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
