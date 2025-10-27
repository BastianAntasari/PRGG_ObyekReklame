var reklame = L.geoJSON(obyekreklame, { 
    onEachFeature: function (feature, layer) { 
        // Ambil data dari properti GeoJSON
        var nama = feature.properties["Nama Reklame"] || "Tanpa Nama";
        var jenis = feature.properties["Jenis Reklame"] || "Tidak diketahui";
        var foto = feature.properties["Foto"];
        var luas = feature.properties["Luas"] || "Tidak diketahui";

        // Bangun isi popup dengan gambar
        var popupContent = "<strong>Nama Reklame:</strong> " + nama + "<br>" +
                           "<strong>Jenis:</strong> " + jenis + "<br>" +
                           "<strong>Luas:</strong> " + luas + " m<sup>2</sup>";

        // Tambahkan gambar jika kolom Foto berisi path
        if (foto && foto.trim() !== "") {
            popupContent += '<br><img src="' + foto + '" width="180px" height="140px" ' +
                            'style="margin-top:5px; border-radius:6px; border:1px solid #ccc;">';
        } else {
            popupContent += "<br><em>Foto tidak tersedia</em>";
        }

        // Tampilkan popup
        layer.bindPopup(popupContent);
    } 
});