// Warna berdasarkan jenis reklame
var warnaReklame = {
    "Neon Box": "#e41a1c",
    "Billboard dengan Lampu": "#377eb8",
    "Billboard Tanpa Lampu": "#4daf4a",
    "Billboard Wall Dynamic": "#984ea3",
    "Spanduk / Vertical Banner": "#ff7f00"
};

// Fungsi ambil warna
function getWarnaReklame(jenis) {
    if (!jenis) return "#999999"; // Abu-abu untuk jenis tidak diketahui
    
    // Cek apakah jenis sesuai dengan key di warnaReklame
    if (warnaReklame[jenis]) {
        return warnaReklame[jenis];
    }
    
    return "#999999"; // Default abu-abu
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
        var warna = getWarnaReklame(feature.properties["Jenis reklame"]);
        return L.marker(latlng, { icon: markerReklame(warna) });
    },
    onEachFeature: function (feature, layer) {

        // ------------------ Ambil Properti ------------------
        var no = feature.properties["No"] || "-";
        var nama = feature.properties["Nama Reklame"] || "Tanpa Nama";
        var jenisReklame = feature.properties["Jenis reklame"] || "-";
        var foto = feature.properties["Foto"] || "";
        var lokasi = feature.properties["Lokasi"] || "-";
        var kawasan = feature.properties["Kawasan"] || "-";
        
        // Indeks untuk nilai strategis
        var indeksLokasi = feature.properties["Indeks lokasi reklame"] || 6;
        var jumlahMuka = feature.properties["Jumlah muka reklame"] || 1;
        var indeksMuka = feature.properties["Indeks muka reklame"] || 8;
        var kriteriaTinggi = feature.properties["Kriteria tinggi"] || "-";
        var indeksTinggi = feature.properties["Indeks tinggi reklame"] || 0.4;
        var nilaiStrategis = feature.properties["Nilai strategis"] || (indeksLokasi * indeksMuka * indeksTinggi);
        
        // Data untuk perhitungan NSR
        var jangkaWaktu = feature.properties["jangka waktu"] ? 1 : 1; // boolean, jika true = 1 tahun
        var satuanMedia = feature.properties["Satuan media reklame"] || "m^2/tahun";
        var hargaSatuan = feature.properties["Harga satuan reklame"] || 47000;
        var luas = feature.properties["Luas"] || 0;
        
        // Dimensi
        var panjang = feature.properties["Panjang/Jari-jari (m)"] || 0;
        var lebar = feature.properties["Lebar (m)"] || null;


        // ------------------ Popup ------------------
        var popupContent = `
            <div style="width:280px;">
                <strong>Nama Reklame:</strong> ${nama}<br>
                <strong>Jenis Reklame:</strong> ${jenisReklame}<br>
        `;

        if (foto !== "") {
            popupContent += `
                <img src="${foto}" width="240px" style="border-radius:6px; border:1px solid #ccc; margin:8px 0;">
            `;
        }

        popupContent += `
                <hr style="margin:10px 0;">
                <strong>Data Reklame:</strong><br>
                <strong>Lokasi:</strong> ${lokasi}<br>
                <strong>Kawasan:</strong> ${kawasan}<br>
                <strong>Indeks Lokasi:</strong> ${indeksLokasi}<br>
                <strong>Jumlah Muka:</strong> ${jumlahMuka}<br>
                <strong>Indeks Muka:</strong> ${indeksMuka}<br>
                <strong>Kriteria Tinggi:</strong> ${kriteriaTinggi}<br>
                <strong>Indeks Tinggi:</strong> ${indeksTinggi}<br>
                <strong>Nilai Strategis:</strong> ${nilaiStrategis}<br>
                <strong>Harga Satuan:</strong> Rp ${hargaSatuan.toLocaleString('id-ID')}<br>
                <strong>Luas:</strong> ${luas} m²<br>
                
                <hr style="margin:10px 0;">
                <h6 style="margin-bottom:10px;">Perhitungan NSR</h6>
                <p style="font-size:11px; margin-bottom:8px; color:#666;">
                    Formula: NSR = Nilai Strategis × Jangka Waktu × Harga Satuan × Luas
                </p>

                <!-- Nilai Strategis -->
                <label style="font-size:12px; font-weight:600;">Nilai Strategis:</label><br>
                <input type="number" id="ns_${feature.id}" value="${nilaiStrategis}" 
                    style="width:100%; padding:4px; margin-bottom:8px;" step="0.1"><br>

                <!-- Jangka Waktu -->
                <label style="font-size:12px; font-weight:600;">Jangka Waktu (tahun):</label><br>
                <input type="number" id="jw_${feature.id}" value="${jangkaWaktu}" 
                    style="width:100%; padding:4px; margin-bottom:8px;" step="0.1"><br>

                <!-- Harga Satuan -->
                <label style="font-size:12px; font-weight:600;">Harga Satuan Reklame (Rp):</label><br>
                <input type="number" id="hs_${feature.id}" value="${hargaSatuan}" 
                    style="width:100%; padding:4px; margin-bottom:8px;"><br>

                <!-- Luas -->
                <label style="font-size:12px; font-weight:600;">Luas Media Reklame (m²):</label><br>
                <input type="number" id="luas_${feature.id}" value="${luas}" 
                    style="width:100%; padding:4px; margin-bottom:10px;" step="0.001"><br>

                <button type="button" id="hitung_${feature.id}" 
                    style="width:100%; background:#198754; color:white; 
                    border:none; padding:8px; border-radius:4px; font-weight:600; cursor:pointer;">
                    Hitung NSR & Pajak Reklame
                </button>

                <div id="hasil_${feature.id}" style="margin-top:12px; padding:10px; 
                    background:#f8f9fa; border-radius:4px; display:none;"></div>
            </div>
        `;


        // Pasang popup
        layer.bindPopup(popupContent);


        // ------------------ Hitung NSR ------------------
        layer.on("popupopen", function () {
            document.getElementById(`hitung_${feature.id}`).addEventListener("click", function () {

                var nsVal = parseFloat(document.getElementById(`ns_${feature.id}`).value) || 0;
                var jwVal = parseFloat(document.getElementById(`jw_${feature.id}`).value) || 0;
                var hsVal = parseFloat(document.getElementById(`hs_${feature.id}`).value) || 0;
                var luasVal = parseFloat(document.getElementById(`luas_${feature.id}`).value) || 0;

                // Rumus NSR: Nilai Strategis × Jangka Waktu × Harga Satuan × Luas
                var nsr = nsVal * jwVal * hsVal * luasVal;

                // Pajak Reklame 25%
                var pajak = nsr * 0.25;

                var hasilDiv = document.getElementById(`hasil_${feature.id}`);
                hasilDiv.style.display = "block";
                hasilDiv.innerHTML = `
                    <strong style="color:#198754;">Hasil Perhitungan:</strong><br>
                    <div style="margin-top:8px;">
                        <strong>NSR:</strong> Rp ${nsr.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>
                        <strong>Pajak Reklame (25%):</strong> 
                        <span style="color:#d63384; font-weight:700;">
                            Rp ${pajak.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                    </div>
                    <div style="margin-top:8px; font-size:11px; color:#666; border-top:1px solid #ddd; padding-top:6px;">
                        <em>Perhitungan: ${nsVal} × ${jwVal} × ${hsVal.toLocaleString('id-ID')} × ${luasVal}</em>
                    </div>
                `;
            });
        });
    }
});