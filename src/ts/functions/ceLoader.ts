import CeAboutMenu from "../elements/CeAboutMenu.js";
import CeAccountButton from "../elements/CeAccountButton.js";
import CeAccountMenu from "../elements/CeAccountMenu.js";
import CeAvatar from "../elements/CeAvatar.js";
import CeAvatarUpload from "../elements/CeAvatarUpload.js";
import CeCard from "../elements/CeCard.js";
import CeCreatePlayerMenu from "../elements/CeCreatePlayerMenu.js";
import CeInteractivePopUp from "../elements/CeInteractivePopUp.js";
import CeInviteMenu from "../elements/CeInviteMenu.js";
import CeLoadScreen from "../elements/CeLoadScreen.js";
import CeMenu from "../elements/CeMenu.js";
import CeModifyPlayerMenu from "../elements/CeModifyPlayerMenu.js";
import CeNextPlayer from "../elements/CeNextPlayer.js";
import CeNextPlayerCenter from "../elements/CeNextPlayerCenter.js";
import CePlayer from "../elements/CePlayer.js";
import CePlayerList from "../elements/CePlayerList.js";
import CePopUp from "../elements/CePopUp.js";
import CePotCounter from "../elements/CePotCounter.js";
import CeRule from "../elements/CeRule.js";
import CeShowButton from "../elements/CeShowButton.js";
import CeHeader from "../elements/CeHeader.js";


export default function ceLoader() {
    customElements.define('ce-about-menu', CeAboutMenu);
    customElements.define('ce-account-button', CeAccountButton);
    customElements.define('ce-account-menu', CeAccountMenu);
    customElements.define('ce-avatar', CeAvatar);
    customElements.define('ce-avatar-upload', CeAvatarUpload);
    customElements.define('ce-card', CeCard);
    customElements.define('ce-create-player-menu', CeCreatePlayerMenu);
    customElements.define('ce-header',CeHeader);
    customElements.define('ce-interactive-popup',CeInteractivePopUp);
    customElements.define('ce-invite-menu',CeInviteMenu);
    customElements.define('ce-load-screen',CeLoadScreen);
    customElements.define('ce-menu',CeMenu);
    customElements.define('ce-modify-player-menu',CeModifyPlayerMenu);
    customElements.define('ce-next-player',CeNextPlayer);
    customElements.define('ce-next-player-center',CeNextPlayerCenter);
    customElements.define('ce-player',CePlayer);
    customElements.define('ce-player-list',CePlayerList);
    customElements.define('ce-popup',CePopUp);
    customElements.define('ce-pot-counter',CePotCounter);
    customElements.define('ce-rule',CeRule);
    customElements.define('ce-show-button',CeShowButton);
}