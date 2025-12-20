// Warna berdasarkan jenis reklame
var warnaReklame = {
    "Billboard": "#e41a1c",
    "Videotron": "#377eb8",
    "Megatron": "#377eb8",
    "Baliho": "#4daf4a",
    "Shopsign": "#984ea3",
    "Mural": "#984ea3",
    "Paintwall": "#984ea3",
    "Lainnya": "#ff7f00"
};

// Fungsi ambil warna
function getWarnaReklame(jenis) {
    if (!jenis) return warnaReklame["Lainnya"];

    if (jenis.includes("Billboard")) return warnaReklame["Billboard"];
    if (jenis.includes("Videotron") || jenis.includes("Megatron")) return warnaReklame["Videotron"];
    if (jenis.includes("Baliho")) return warnaReklame["Baliho"];
    if (jenis.includes("Shopsign") || jenis.includes("Mural") || jenis.includes("Paintwall"))
        return warnaReklame["Shopsign"];

    return warnaReklame["Lainnya"];
};

function markerReklame(warna) {
    return L.divIcon({
        className: "",
        html: `
        <svg width="28" height="42" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
                  fill="${warna}" stroke="#000" stroke-width="1"/>
            <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
        `,
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -38]
    });
}

var reklame = L.geoJSON(obyekreklame, {
    pointToLayer: function (feature, latlng) {
        var warna = getWarnaReklame(feature.properties["Jenis Reklame"]);
        return L.marker(latlng, { icon: markerReklame(warna) });
    },
    onEachFeature: function (feature, layer) {

        // ------------------ Ambil Properti ------------------
        var nama = feature.properties["Nama Reklame"] || "Tanpa Nama";
        var jenisAwal = feature.properties["Jenis Reklame"] || "";
        var hargaBahan = feature.properties["Harga Bahan"] || 0;
        var lokasiAwal = feature.properties["Lokasi Penempatan"] || "";
        var waktu = feature.properties["Waktu"] || 1;
        var jangkaWaktu = feature.properties["Jangka Waktu"] || 1;
        var jumlah = feature.properties["Jumlah"] || 1;
        var luas = feature.properties["Luas"] || 0;
        var foto = feature.properties["Foto"] || "";


        // ------------------ Konversi Lokasi ke Nilai ------------------
        var lokasiValAwal = (lokasiAwal === "Kelas B") ? 0.6 :
                            (lokasiAwal === "Kelas C") ? 0.5 : 1;

        // Koefisien Jenis Reklame dari properti
        function getJenisVal(jenis) {
            if (!jenis) return 1;

            if (jenis.includes("Videotron") || jenis.includes("Megatron")) return 1;
            if (jenis.includes("Billboard")) return 1;
            if (jenis.includes("Baliho")) return 0.9;
            if (jenis.includes("Shopsign") || jenis.includes("Mural") || jenis.includes("Paintwall")) return 0.5;
            if (jenis.includes("berjalan") || jenis.includes("kendaraan")) return 0.5;
            if (jenis.includes("Umbul")) return 0.8;
            if (jenis.includes("Rontek") && jenis.includes("besi")) return 2.5;
            if (jenis.includes("Apung") || jenis.includes("Balon")) return 1;
            if (jenis.includes("Stiker") || jenis.includes("selebaran")) return 1;

            return 1;
        }

        var jenisValAwal = getJenisVal(jenisAwal);


        // ------------------ Popup ------------------
        var popupContent = `
            <div style="width:240px;">
                <strong>Nama Reklame:</strong> ${nama}<br>
                <strong>Jenis Reklame:</strong> ${jenisAwal}<br>
                <strong>Harga Bahan:</strong> Rp ${hargaBahan.toLocaleString('id-ID')}<br>
                <strong>Lokasi Penempatan:</strong> ${lokasiAwal}<br>
                <strong>Waktu:</strong> ${waktu} tahun<br>
                <strong>Jangka Waktu:</strong> ${jangkaWaktu} hari<br>
                <strong>Jumlah:</strong> ${jumlah}<br>
                <strong>Luas:</strong> ${luas} m²<br><br>
        `;

        if (foto !== "") {
            popupContent += `
                <img src="${foto}" width="200px" style="border-radius:6px; border:1px solid #ccc;">
            `;
        }

        popupContent += `
            <hr>
            <h6>Perhitungan NSR</h6>

            <!-- Jenis Reklame -->
            <label>Jenis Reklame:</label><br>
            <select id="jenis_${feature.id}" style="width:100%; padding:3px;">
                <option value="1" ${jenisValAwal==1 && jenisAwal.includes("Videotron") ? "selected" : ""}>Videotron Megatron</option>
                <option value="1" ${jenisValAwal==1 && jenisAwal.includes("Billboard") ? "selected" : ""}>Billboard</option>
                <option value="0.9" ${jenisValAwal==0.9 && jenisAwal.includes("Baliho") ? "selected" : ""}>Papan Baliho</option>
                <option value="0.5" ${jenisValAwal==0.5 && jenisAwal.includes("Shopsign") ? "selected" : ""}>Papan Shopsign, Mural, Paintwall</option>
                <option value="0.5" ${jenisValAwal==0.5 && jenisAwal.includes("berjalan") ? "selected" : ""}>Reklame berjalan/pada kendaraan</option>
                <option value="0.8" ${jenisValAwal==0.8 && jenisAwal.includes("Umbul") ? "selected" : ""}>Kain Spanduk Rontek, Umbul-umbul</option>
                <option value="2.5" ${jenisValAwal==2.5 ? "selected" : ""}>Kain Rontek, konstruksi besi</option>
                <option value="1" ${jenisValAwal==1 && jenisAwal.includes("Apung") ? "selected" : ""}>Reklame Apung/Melayang/Balon</option>
                <option value="1" ${jenisValAwal==1 && jenisAwal.includes("Stiker") ? "selected" : ""}>Reklame Melekat/Stiker/selebaran</option>
            </select><br>

            <!-- Lokasi Penempatan -->
            <label>Lokasi Penempatan:</label><br>
            <select id="lokasi_${feature.id}" style="width:100%; padding:3px;">
                <option value="1" ${lokasiValAwal==1 && lokasiAwal==="Kelas A" ? "selected" : ""}>Kelas A</option>
                <option value="0.6" ${lokasiValAwal==0.6 && lokasiAwal==="Kelas B" ? "selected" : ""}>Kelas B</option>
                <option value="0.5" ${lokasiValAwal==0.5 && lokasiAwal==="Kelas C" ? "selected" : ""}>Kelas C</option>
            </select><br>

            <!-- Harga Bahan -->
            <label>Harga Bahan:</label><br>
            <input type="number" id="harga_${feature.id}" value="${hargaBahan}" style="width:100%;"><br>

            <!-- Waktu -->
            <label>Waktu (tahun):</label><br>
            <input type="number" id="waktu_${feature.id}" value="${waktu}" style="width:100%;"><br>

            <!-- Jangka waktu -->
            <label>Jangka Waktu (hari):</label><br>
            <input type="number" id="jangka_${feature.id}" value="${jangkaWaktu}" style="width:100%;"><br>

            <!-- Jumlah -->
            <label>Jumlah Reklame:</label><br>
            <input type="number" id="jumlah_${feature.id}" value="${jumlah}" style="width:100%;"><br>

            <!-- Ukuran -->
            <label>Luas Media Reklame (m²):</label><br>
            <input type="number" id="ukuran_${feature.id}" value="${luas}" style="width:100%;"><br>

            <button type="button" id="hitung_${feature.id}" 
                style="margin-top:8px; width:100%; background:#198754; color:white; 
                border:none; padding:6px; border-radius:4px;">
                Hitung NSR & Pajak Reklame
            </button>

            <div id="hasil_${feature.id}" style="margin-top:8px; font-weight:bold;"></div>
            </div>
        `;


        // Pasang popup
        layer.bindPopup(popupContent);


        // ------------------ Hitung NSR ------------------
        layer.on("popupopen", function () {
            document.getElementById(`hitung_${feature.id}`).addEventListener("click", function () {

                var jenisVal = parseFloat(document.getElementById(`jenis_${feature.id}`).value);
                var lokasiVal = parseFloat(document.getElementById(`lokasi_${feature.id}`).value);
                var hargaVal = parseFloat(document.getElementById(`harga_${feature.id}`).value);
                var waktuVal = parseFloat(document.getElementById(`waktu_${feature.id}`).value);
                var jangkaVal = parseFloat(document.getElementById(`jangka_${feature.id}`).value);
                var jumlahVal = parseFloat(document.getElementById(`jumlah_${feature.id}`).value);
                var ukuranVal = parseFloat(document.getElementById(`ukuran_${feature.id}`).value);

                // Rumus NSR
                var nsr = jenisVal * hargaVal / 365 * lokasiVal * waktuVal * jangkaVal * jumlahVal * ukuranVal;

                // Pajak Reklame 25%
                var pajak = nsr * 0.25;

                document.getElementById(`hasil_${feature.id}`).innerHTML = `
                    Nilai NSR: Rp ${nsr.toLocaleString('id-ID')}<br>
                    Pajak Reklame (25%): <span style="color:#d63384;">
                    Rp ${pajak.toLocaleString('id-ID')}</span>
                `;
            });
        });
    }
});
