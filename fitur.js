var reklame = L.geoJSON(obyekreklame, { 
    onEachFeature: function (feature, layer) { 
        // Ambil data dari properti GeoJSON
        var nama = feature.properties["Nama Rekla"] || "Tanpa Nama";
        var jenis = feature.properties["Jenis Rekl"] || "Tidak diketahui";
        var foto = feature.properties["Foto"];
        var luas = feature.properties["Luas"] || "Tidak diketahui";

        // Bangun isi popup awal
        var popupContent = `
            <div style="width: 240px;">
                <strong>Nama Reklame:</strong> ${nama}<br>
                <strong>Jenis:</strong> ${jenis}<br>
                <strong>Luas:</strong> ${luas} m<sup>2</sup><br>
        `;

        // Tambahkan gambar jika tersedia
        if (foto && foto.trim() !== "") {
            popupContent += `
                <img src="${foto}" width="180px" height="140px" 
                style="margin-top:5px; border-radius:6px; border:1px solid #ccc;">
            `;
        } else {
            popupContent += "<em>Foto tidak tersedia</em>";
        }

        // Tambahkan form perhitungan NSR
        popupContent += `
            <hr>
            <h6>Perhitungan NSR</h6>
            <label>Jenis Reklame:</label><br>
            <select id="jenis_${feature.id}" style="width:100%; padding:3px;">
                <option value="1">Videotron Megatron</option>
                <option value="1">Billboard</option>
                <option value="0.9">Papan Baliho</option>
                <option value="0.5">Papan Shopsign, Mural, Paintwall</option>
                <option value="0.5">Reklame berjalan/pada kendaraan</option>
                <option value="0.8">Kain Spanduk Rontek, Umbul-umbul</option>
                <option value="2.5">Kain Rontek, konstruksi besi</option>
                <option value="1">Reklame Apung/Melayang/Balon</option>
                <option value="1">Reklame Melekat/Stiker/selebaran</option>
            </select><br>

            <label>Lokasi Penempatan:</label><br>
            <select id="lokasi_${feature.id}" style="width:100%; padding:3px;">
                <option value="1">Kelas I</option>
                <option value="0.6">Kelas II</option>
                <option value="0.5">Kelas III</option>
            </select><br>

            <label>Harga Bahan:</label><br>
            <input type="number" id="harga_${feature.id}" value="1" style="width:100%;"><br>

            <label>Waktu (tahun):</label><br>
            <input type="number" id="waktu_${feature.id}" value="1" style="width:100%;"><br>

            <label>Jangka Waktu Penyelenggaraan (hari):</label><br>
            <input type="number" id="jangka_${feature.id}" value="1" style="width:100%;"><br>

            <label>Jumlah Reklame:</label><br>
            <input type="number" id="jumlah_${feature.id}" value="1" style="width:100%;"><br>

            <label>Ukuran Media Reklame:</label><br>
            <input type="number" id="ukuran_${feature.id}" value="${luas}" style="width:100%;"><br>

            <button type="button" id="hitung_${feature.id}" 
                style="margin-top:8px; width:100%; background:#198754; color:white; border:none; padding:5px; border-radius:4px;">
                Hitung NSR & Pajak Reklame
            </button>

            <div id="hasil_${feature.id}" style="margin-top:6px; font-weight:bold;"></div>
            </div>
        `;

        // Bind popup ke layer
        layer.bindPopup(popupContent);

        // Jalankan script setelah popup dibuka
        layer.on('popupopen', function () {
            var btn = document.getElementById(`hitung_${feature.id}`);
            btn.addEventListener('click', function() {
                // Ambil nilai dari input form
                var jenisVal = parseFloat(document.getElementById(`jenis_${feature.id}`).value) || 0;
                var lokasiVal = parseFloat(document.getElementById(`lokasi_${feature.id}`).value) || 0;
                var hargaVal = parseFloat(document.getElementById(`harga_${feature.id}`).value) || 0;
                var waktuVal = parseFloat(document.getElementById(`waktu_${feature.id}`).value) || 0;
                var jangkaVal = parseFloat(document.getElementById(`jangka_${feature.id}`).value) || 0;
                var jumlahVal = parseFloat(document.getElementById(`jumlah_${feature.id}`).value) || 0;
                var ukuranVal = parseFloat(document.getElementById(`ukuran_${feature.id}`).value) || 0;

                // Rumus NSR
                var nsr = jenisVal * hargaVal * lokasiVal * waktuVal * jangkaVal * jumlahVal * ukuranVal;

                // Rumus Pajak Reklame = 25% x NSR
                var pajak = 0.25 * nsr;

                // Tampilkan hasil
                document.getElementById(`hasil_${feature.id}`).innerHTML = `
                    Nilai NSR: Rp ${nsr.toLocaleString('id-ID')}<br>
                    Pajak Reklame (25%): <span style="color:#d63384;">Rp ${pajak.toLocaleString('id-ID')}</span>`;
            });
        });
    } 
});
