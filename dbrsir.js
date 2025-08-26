function getQueryParam(name) {
            let params = new URLSearchParams(window.location.search);
            return params.get(name);
        }

        function calculateCRC16(input) {
            let crc = 0xFFFF;
            for (let i = 0; i < input.length; i++) {
                crc ^= input.charCodeAt(i) << 8;
                for (let j = 0; j < 8; j++) {
                    if (crc & 0x8000) {
                        crc = (crc << 1) ^ 0x1021;
                    } else {
                        crc <<= 1;
                    }
                }
                crc &= 0xFFFF;
            }
            return crc.toString(16).toUpperCase().padStart(4, '0');
        }

        function generateDynamicQRIS() {
            let totalPrice = getQueryParam("totalPrice");

            if (!totalPrice || isNaN(totalPrice)) {
                document.getElementById('total-display').textContent = "0";
                alert("Jumlah pembayaran tidak valid");
                return;
            }

            totalPrice = parseFloat(totalPrice).toFixed(2); 
            document.getElementById('total-display').textContent = parseFloat(totalPrice).toLocaleString();

            let qrisTemplate = `00020101021226570011ID.DANA.WWW011893600915013020035102091302003510303UKE51440014ID.CO.QRIS.WWW0215ID10200327698840303UKE520489995303360540${totalPrice.length}${totalPrice}5802ID5909neokey.id6014Kab. Pamekasan610569383621960150011ID.DANA.WWW6304`;

            let crc16 = calculateCRC16(qrisTemplate);
            let finalQRIS = qrisTemplate + crc16;

            console.log("QRIS Dinamis:", finalQRIS);

            QRCode.toCanvas(document.getElementById('qris'), finalQRIS, function (error) {
                if (error) console.error(error);
                console.log('QRIS berhasil');
            });
        }

        document.addEventListener("DOMContentLoaded", generateDynamicQRIS);
