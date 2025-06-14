const INC_TEMP_ICON = document.getElementById("inc_temp");
const DEC_TEMP_ICON = document.getElementById("dec_temp");
const AC_SELECTOR = document.getElementById("ac_protocol_selector");
const ON_BUTTON = document.getElementById("on_button");
const OFF_BUTTON = document.getElementById("off_button");
const TEMP_SCREEN = document.getElementById("temp-screen");
const TOGGLE_MODE = document.getElementById("toggle_mode");

const PROTOCOL_FORM = document.getElementById("protocolForm");
const PROTOCOL_INPUT = document.getElementById("protoInput");
const SERVICE_INPUT = document.getElementById("serviceInput");
const ROOM_INPUT = document.getElementById("roomInput");
const PROTOCOL_LIST = document.getElementById("protocolList");

const SERVER_PORT = 5000;

let currentMode = "cool";
let savedProtocols = [];
let powerStatus = true;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let ws = new WebSocket(`ws://fing-bot.brazilsouth.cloudapp.azure.com:${SERVER_PORT}/wstest`);

const protocols = [
    "RC5", "RC6", "NEC", "SONY", "PANASONIC", "JVC", "SAMSUNG", "WHYNTER", "AIWA_RC_T501", "LG",
    "SANYO", "MITSUBISHI", "DISH", "SHARP", "COOLIX", "DAIKIN", "DENON", "KELVINATOR", "SHERWOOD", "MITSUBISHI_AC",
    "RCMM", "SANYO_LC7461", "RC5X", "GREE", "PRONTO", "NEC_LIKE", "ARGO", "TROTEC", "NIKAI", "RAW",
    "GLOBALCACHE", "TOSHIBA_AC", "FUJITSU_AC", "MIDEA", "MAGIQUEST", "LASERTAG", "CARRIER_AC", "HAIER_AC", "MITSUBISHI2", "HITACHI_AC",
    "HITACHI_AC1", "HITACHI_AC2", "GICABLE", "HAIER_AC_YRW02", "WHIRLPOOL_AC", "SAMSUNG_AC", "LUTRON", "ELECTRA_AC", "PANASONIC_AC", "PIONEER",
    "LG2", "MWM", "DAIKIN2", "VESTEL_AC", "TECO", "SAMSUNG36", "TCL112AC", "LEGOPF", "MITSUBISHI_HEAVY_88", "MITSUBISHI_HEAVY_152",
    "DAIKIN216", "SHARP_AC", "GOODWEATHER", "INAX", "DAIKIN160", "NEOCLIMA", "DAIKIN176", "DAIKIN128", "AMCOR", "DAIKIN152",
    "MITSUBISHI136", "MITSUBISHI112", "HITACHI_AC424", "SONY_38K", "EPSON", "SYMPHONY", "HITACHI_AC3", "DAIKIN64", "AIRWELL", "DELONGHI_AC",
    "DOSHISHA", "MULTIBRACKETS", "CARRIER_AC40", "CARRIER_AC64", "HITACHI_AC344", "CORONA_AC", "MIDEA24", "ZEPEAL", "SANYO_AC", "VOLTAS",
    "METZ", "TRANSCOLD", "TECHNIBEL_AC", "MIRAGE", "ELITESCREENS", "PANASONIC_AC32", "MILESTAG2", "ECOCLIM", "XMP", "TRUMA",
    "HAIER_AC176", "TEKNOPOINT", "KELON", "TROTEC_3550", "SANYO_AC88", "BOSE", "ARRIS", "RHOSS", "AIRTON", "COOLIX48",
    "HITACHI_AC264", "KELON168", "HITACHI_AC296", "DAIKIN200", "HAIER_AC160", "CARRIER_AC128", "TOTO", "CLIMABUTLER", "TCL96AC", "BOSCH144",
    "SANYO_AC152", "DAIKIN312", "GORENJE", "WOWWEE", "CARRIER_AC84", "YORK", "BLUESTARHEAVY"
];

protocols.forEach(protocol => {
    const option = document.createElement("option");
    option.value = protocols.indexOf(protocol) + 1;
    option.textContent = protocol;
    AC_SELECTOR.appendChild(option);

		const option2 = document.createElement("option");
    option2.value = protocols.indexOf(protocol) + 1;
    option2.textContent = protocol;
    PROTOCOL_INPUT.appendChild(option2);
		
});


ws.onmessage = async (msg) => {
    console.log(msg);
    let d = await msg.data.bytes();
    let buffer = new Uint8ClampedArray(d);
    
    //console.log(buffer);
    let imd = new ImageData(buffer, 32, 24);
    ctx.putImageData(imd, 0, 0);
}

INC_TEMP_ICON.addEventListener("click", async () => {
    sendDataToAircon({
        protocol: Number(AC_SELECTOR.value),
        temperature: "increase",
        power: powerStatus,
mode: currentMode
    }).catch(error => console.error("Failed to send aircon command: ", error));
});

DEC_TEMP_ICON.addEventListener("click", () => {
    sendDataToAircon({
        protocol: Number(AC_SELECTOR.value),
        temperature: "decrease",
        power: powerStatus,
mode: currentMode
    }).catch(error => console.error("Failed to send aircon command: ", error));
});

AC_SELECTOR.addEventListener("change", async (ev) => {
    sendDataToAircon({
        protocol: Number(AC_SELECTOR.value),
        temperature: "current",
        power: powerStatus,
mode: currentMode
    }).catch(error => console.error("Failed to send aircon command: ", error));
})

ON_BUTTON.addEventListener("click", async (ev) => {
    powerStatus = true;
    sendDataToAircon({
        protocol: Number(AC_SELECTOR.value),
        temperature: "current",
        power: powerStatus,
mode: currentMode
    }).catch(error => console.error("Failed to send aircon command: ", error));
})

OFF_BUTTON.addEventListener("click", async (ev) => {
    powerStatus = false;
    sendDataToAircon({
        protocol: Number(AC_SELECTOR.value),
        temperature: "current",
        power: powerStatus,
mode: currentMode
    }).catch(error => console.error("Failed to send aircon command: ", error));
})

TOGGLE_MODE.addEventListener("click", () => {
  currentMode = (currentMode === "cool") ? "heat" : "cool";
  TOGGLE_MODE.textContent = `Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`;
	
  sendDataToAircon({
    protocol: Number(AC_SELECTOR.value),
    temperature: "current",
    power: powerStatus,
    mode: currentMode
  }).catch(error => console.error("Failed to send aircon command: ", error));
});

async function sendDataToAircon(JSONBody) {
    const response = await fetch(`http://fing-bot.brazilsouth.cloudapp.azure.com:${SERVER_PORT}/aircon`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(JSONBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response: ", data);
    TEMP_SCREEN.innerHTML = data.temperature;
}



PROTOCOL_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  const protocol = PROTOCOL_INPUT.value.trim();
  const service = SERVICE_INPUT.value.trim();
  const room = ROOM_INPUT.value.trim();

  if (!protocol || !service || !room) {
    console.error("All fields must be filled out!");
    return;
  }

  savedProtocols.push({ protocol, service, room });
  renderProtocolList();

  PROTOCOL_INPUT.value = "";
  SERVICE_INPUT.value = "";
  ROOM_INPUT.value = "";
});

function renderProtocolList() {
  PROTOCOL_LIST.innerHTML = "";
  savedProtocols.forEach(({ protocol, service, room }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.width = "100%";
    btn.style.marginBottom = "0.3rem";
    btn.textContent = `${protocols[protocol - 1]} - ${service} - ${room}`;

    btn.addEventListener("click", () => {
      const option = Array.from(AC_SELECTOR.options).find(o => o.value === protocol);
      if (option) {
        AC_SELECTOR.value = protocol;
        AC_SELECTOR.dispatchEvent(new Event('change'));
      }
    });

    PROTOCOL_LIST.appendChild(btn);
  });
}
