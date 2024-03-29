import PgGameSelect from "../pages/PgGameSelect.js";
import PgHome from "../pages/PgHome.js";
import PgLogin from "../pages/PgLogin.js";
import PgPlayOnline from "../pages/PgPlayOnline.js";
import PgPlayRedOrBlack from "../pages/PgPlayRedOrBlack.js";
import PgPlayRingOfFire from "../pages/PgPlayRingOfFire.js";
import PgSetupGame from "../pages/PgSetupGame.js";

export default function ceLoader() {
    customElements.define('pg-game-select',PgGameSelect);
    customElements.define('pg-home',PgHome);
    customElements.define('pg-login',PgLogin);
    customElements.define('pg-play-online',PgPlayOnline);
    customElements.define('pg-play-red-or-black',PgPlayRedOrBlack);
    customElements.define('pg-play-ring-of-fire',PgPlayRingOfFire);
    customElements.define('pg-setup-game',PgSetupGame);
}